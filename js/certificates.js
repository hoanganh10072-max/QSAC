/* certificates.js — Trang chứng chỉ */

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

document.addEventListener('DOMContentLoaded', () => {

  // ── TABS LỌC CHỨNG CHỈ ──
  const tabs = document.querySelectorAll('.cert-tabs span');
  const rows = document.querySelectorAll('.cert-row');
  const filterMap = { 0: 'all', 1: 'ms-red', 2: 'ms-green', 3: 'ms-gold' };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = filterMap[i];
      rows.forEach(row => {
        if (filter === 'all') {
          row.style.display = '';
        } else {
          const seal = row.querySelector('.mini-seal');
          row.style.display = seal?.classList.contains(filter) ? '' : 'none';
        }
      });
    });
  });

  // ── NÚT XEM CHỨNG CHỈ / XEM LÝ DO ──
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent.trim() === 'Xem lý do') {
        showToast('Lý do: Điểm chưa đạt ngưỡng 80/100 yêu cầu');
      } else {
        showToast('Đang tải chứng chỉ PDF...');
      }
    });
  });

  // ── NÚT MORE (...) ──
  document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      showToast('Tải xuống · Chia sẻ · In chứng chỉ');
    });
  });

  // ── KIỂM TRA CHỨNG CHỈ ──
  document.querySelector('.cf-check')?.addEventListener('click', () => {
    showToast('Nhập mã chứng chỉ vào ô tìm kiếm để kiểm tra');
  });

  // ── TÌM HIỂU VỀ CHỨNG CHỈ ──
  document.querySelector('.learn-btn')?.addEventListener('click', () => {
    document.querySelector('.cert-content')?.scrollIntoView({ behavior: 'smooth' });
  });

  // ── XEM QUY CHẾ CHỨNG CHỈ ──
  document.querySelector('.wide-btn')?.addEventListener('click', () => {
    showToast('Đang tải tài liệu quy chế chứng chỉ...');
  });

  // ── QUY ĐỊNH & CHÍNH SÁCH ──
  document.querySelector('.policy-btn')?.addEventListener('click', () => {
    showToast('Đang mở quy định & chính sách...');
  });

  // ── CF-SELECT DROPDOWNS ──
  document.querySelectorAll('.cf-select').forEach(sel => {
    sel.style.cursor = 'pointer';
    sel.addEventListener('click', () => {
      showToast('Bộ lọc đang được cập nhật!');
    });
  });

  // ── LEVEL CARDS ──
  document.querySelectorAll('.level-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const level = card.querySelector('h3')?.textContent || '';
      showToast(`Xem thông tin: ${level}`);
    });
  });

});
