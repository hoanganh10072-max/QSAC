/* =============================================
   certificates.js — Trang chứng chỉ
   Phụ thuộc: public-data.js (PublicData)
   Render danh sách chứng chỉ từ admin (qsac_admin_certificates) rồi bind
   tabs filter / view button / more button / level cards.
   ============================================= */

function showToast(msg) {
  let t = document.getElementById('_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '_toast';
    t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:#1e293b;color:#fff;padding:10px 24px;border-radius:50px;font-size:13px;font-weight:600;opacity:0;transition:all .25s;z-index:9999;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(16px)';
  }, 2200);
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Bảng meta theo cấp độ — dùng cho cả seal class, màu, nhãn, điểm chuẩn
const LEVEL_META = {
  red:   { sealCls: 'ms-red',   color: '#ef3b2e', label: 'Chứng chỉ Cấp độ Đỏ',  tier: 'cơ bản',    seal: '../assets/seal-red.png',   lessons: 6,  baseScore: 80 },
  green: { sealCls: 'ms-green', color: '#21b14b', label: 'Chứng chỉ Cấp độ Xanh', tier: 'nâng cao', seal: '../assets/seal-green.png', lessons: 9,  baseScore: 85 },
  gold:  { sealCls: 'ms-gold',  color: '#ffa31a', label: 'Chứng chỉ Cấp độ Vàng', tier: 'chuyên gia',seal: '../assets/seal-gold.png', lessons: 12, baseScore: 90 },
};

// Định dạng YYYY-MM-DD → DD/MM/YYYY (admin lưu ISO date)
function fmtDate(iso) {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return m[3] + '/' + m[2] + '/' + m[1];
}

// Tính ngày hết hạn = ngày cấp + 2 năm
function calcExpiry(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  d.setFullYear(d.getFullYear() + 2);
  return fmtDate(d.toISOString().slice(0, 10));
}

document.addEventListener('DOMContentLoaded', () => {

  const host = document.getElementById('certRows');
  if (!host) return;

  // Lấy CẢ valid + revoked để hiển thị các trạng thái khác nhau (UI cũ có "Đã thu hồi")
  const records = PublicData.getCertificateRecords({ onlyValid: false });

  // ── Render danh sách ──
  function render() {
    if (!records.length) {
      host.innerHTML = '<p style="text-align:center;color:#64748b;padding:40px">Chưa có chứng chỉ nào.</p>';
      return;
    }
    host.innerHTML = records.map((r) => {
      const meta = LEVEL_META[r.level] || LEVEL_META.red;
      const isValid = r.status === 'valid';
      const score = meta.baseScore;
      const scoreBadge = isValid
        ? '<span class="badge-pass">Đạt</span>'
        : '<span class="badge-fail">Không đạt</span>';
      const statusBlock = isValid
        ? '<span class="status-valid"><i class="fa-solid fa-circle"></i> Đang hiệu lực</span>'
        : '<span class="status-revoked"><i class="fa-solid fa-circle"></i> Đã thu hồi</span>';
      const viewLabel = isValid ? 'Xem chứng chỉ' : 'Xem lý do';
      return '' +
        '<div class="cert-row" data-level="' + esc(r.level) + '" data-id="' + esc(r.id) + '">' +
        '  <img class="mini-seal ' + meta.sealCls + '" src="' + meta.seal + '" alt="Seal ' + esc(r.level) + '">' +
        '  <div class="cr-info">' +
        '    <div class="cr-level" style="color:' + meta.color + '">' + meta.label + '</div>' +
        '    <h4>' + esc(r.course) + '</h4>' +
        '    <small><i class="fa-solid fa-layer-group"></i> Cấp độ ' + meta.tier +
        ' &nbsp; <i class="fa-solid fa-users"></i> ' + meta.lessons + ' khóa học bắt buộc</small>' +
        '  </div>' +
        '  <div class="cr-score">' +
        '    <small>Điểm đạt</small>' +
        '    <div><b>' + score + '</b>/100 ' + scoreBadge + '</div>' +
        '    <small>Cấp ngày: ' + fmtDate(r.issuedAt) + '</small>' +
        '  </div>' +
        '  <div class="cr-valid">' +
        '    <small>Hiệu lực đến: ' + calcExpiry(r.issuedAt) + '</small>' +
        '    ' + statusBlock +
        '  </div>' +
        '  <button class="view-btn">' + viewLabel + '</button>' +
        '  <button class="more-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>' +
        '</div>';
    }).join('');

    bindRowEvents();
  }

  // Bind sự kiện ở các row sau khi render xong (view + more)
  function bindRowEvents() {
    host.querySelectorAll('.view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.textContent.trim() === 'Xem lý do') {
          showToast('Lý do: Điểm chưa đạt ngưỡng 80/100 yêu cầu');
        } else {
          showToast('Đang tải chứng chỉ PDF...');
        }
      });
    });
    host.querySelectorAll('.more-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Tải xuống · Chia sẻ · In chứng chỉ');
      });
    });
  }

  render();

  // ── Tabs lọc theo cấp độ ──
  // index 0 = tất cả, 1 = red, 2 = green, 3 = gold
  const tabs = document.querySelectorAll('.cert-tabs span');
  const levelByIdx = { 0: 'all', 1: 'red', 2: 'green', 3: 'gold' };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = levelByIdx[i] || 'all';
      host.querySelectorAll('.cert-row').forEach((row) => {
        row.style.display = (filter === 'all' || row.dataset.level === filter) ? '' : 'none';
      });
    });
  });

  // ── Các nút khác ngoài danh sách (giữ nguyên hành vi cũ) ──
  document.querySelector('.cf-check')?.addEventListener('click', () => {
    showToast('Nhập mã chứng chỉ vào ô tìm kiếm để kiểm tra');
  });
  document.querySelector('.learn-btn')?.addEventListener('click', () => {
    document.querySelector('.cert-content')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('.wide-btn')?.addEventListener('click', () => {
    showToast('Đang tải tài liệu quy chế chứng chỉ...');
  });
  document.querySelector('.policy-btn')?.addEventListener('click', () => {
    showToast('Đang mở quy định & chính sách...');
  });
  document.querySelectorAll('.cf-select').forEach((sel) => {
    sel.style.cursor = 'pointer';
    sel.addEventListener('click', () => showToast('Bộ lọc đang được cập nhật!'));
  });
  document.querySelectorAll('.level-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const level = card.querySelector('h3')?.textContent || '';
      showToast(`Xem thông tin: ${level}`);
    });
  });

});
