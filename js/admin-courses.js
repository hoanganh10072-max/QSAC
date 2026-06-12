/* =============================================
   admin-courses.js — CRUD khoá trong lộ trình học
   Dùng cho: admin/courses.html (đã chuyển sang quản lý lộ trình)
   Phụ thuộc: admin-shared.js (AdminShared) + learning-data.js
              (LP_CATEGORIES, LP_PATH_DETAILS, LP_LEVEL_LABEL)
   Lưu vào: localStorage key 'qsac_admin_paths' — flat array
            { id, catKey, level, title, duration, note }
   Trang public learning-path.html / path-detail.html đọc cùng key
   thông qua learning-data.js (rebuild LP_PATH_DETAILS từ storage).
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return;
  AdminShared.bindSidebar();
  AdminShared.bindLogout();

  const STORAGE_KEY = 'qsac_admin_paths';

  /** Seed: trải LP_PATH_DETAILS thành flat array, dùng khi storage trống lần đầu */
  function buildSeed() {
    const out = [];
    LP_CATEGORIES.forEach(cat => {
      const byLevel = LP_PATH_DETAILS[cat.key] || {};
      ['basic', 'intermediate', 'advanced'].forEach(level => {
        (byLevel[level] || []).forEach(c => {
          out.push({
            id: AdminShared.uid(),
            catKey: cat.key,
            level: level,
            title: c.t,
            duration: c.d,
            note: c.note || ''
          });
        });
      });
    });
    return out;
  }

  /* DOM refs */
  const tbody     = document.getElementById('dataBody');
  const empty     = document.getElementById('emptyState');
  const countEl   = document.getElementById('rowCount');
  const searchEl  = document.getElementById('searchInput');
  const filterCat = document.getElementById('filterCategory');
  const filterLv  = document.getElementById('filterLevel');
  const form      = document.getElementById('dataForm');
  const formTitle = document.getElementById('formTitle');
  const formCat   = document.getElementById('formCat');

  let data = AdminShared.loadData(STORAGE_KEY, buildSeed());
  let editingId = null;

  /* Map nhanh cat key → cat metadata để render */
  const CAT_MAP = {};
  LP_CATEGORIES.forEach(c => { CAT_MAP[c.key] = c; });

  /** Populate options cho filter và form select từ LP_CATEGORIES (DRY) */
  function populateCatSelects() {
    const html = LP_CATEGORIES.map(c =>
      `<option value="${c.key}">${AdminShared.escapeHtml(c.name)}</option>`
    ).join('');
    filterCat.insertAdjacentHTML('beforeend', html);
    formCat.insertAdjacentHTML('beforeend', html);
  }

  /** Render bảng theo bộ lọc hiện tại */
  function render() {
    const q   = (searchEl.value || '').trim().toLowerCase();
    const cat = filterCat.value;
    const lv  = filterLv.value;

    const filtered = data.filter(r => {
      if (cat && r.catKey !== cat) return false;
      if (lv  && r.level  !== lv)  return false;
      if (q && !(
        (r.title || '').toLowerCase().includes(q) ||
        (r.note  || '').toLowerCase().includes(q)
      )) return false;
      return true;
    });

    countEl.textContent = filtered.length + ' khoá học';

    if (!filtered.length) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    const esc = AdminShared.escapeHtml;
    tbody.innerHTML = filtered.map((r, i) => {
      const cat = CAT_MAP[r.catKey];
      const catName  = cat ? cat.name : r.catKey;
      const catTheme = cat ? cat.theme : '';
      const catIcon  = cat ? `<i class="${cat.iconType} ${cat.icon}"></i>` : '';
      const lvLabel  = LP_LEVEL_LABEL[r.level] || r.level;

      return `
        <tr data-id="${r.id}">
          <td>${i + 1}</td>
          <td><span class="adm-pill adm-pill-${esc(catTheme)}">${catIcon} ${esc(catName)}</span></td>
          <td><span class="adm-pill adm-pill-lv-${esc(r.level)}">${esc(lvLabel)}</span></td>
          <td><b>${esc(r.title)}</b></td>
          <td>${esc(r.duration)}</td>
          <td class="adm-note-cell">${esc(r.note || '—')}</td>
          <td>
            <div class="adm-row-actions">
              <button class="adm-icon-btn" data-act="edit" title="Sửa"><i class="fa-solid fa-pen"></i></button>
              <button class="adm-icon-btn adm-icon-btn-danger" data-act="delete" title="Xoá"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  /** Mở modal: mode 'add' hoặc 'edit' */
  function openForm(mode, record) {
    editingId = mode === 'edit' ? record.id : null;
    formTitle.textContent = mode === 'edit' ? 'Sửa khoá trong lộ trình' : 'Thêm khoá vào lộ trình';
    form.reset();
    form.querySelectorAll('.err').forEach(e => e.textContent = '');

    if (mode === 'edit') {
      form.title.value    = record.title || '';
      form.catKey.value   = record.catKey || '';
      form.level.value    = record.level || '';
      form.duration.value = record.duration || '';
      form.note.value     = record.note || '';
    }
    AdminShared.openModal('formModal');
  }

  /** Validate form. Trả về object data nếu hợp lệ, false nếu lỗi. */
  function validateForm() {
    form.querySelectorAll('.err').forEach(e => e.textContent = '');
    const fd = new FormData(form);
    const obj = {
      title:    (fd.get('title')    || '').trim(),
      catKey:   (fd.get('catKey')   || '').trim(),
      level:    (fd.get('level')    || '').trim(),
      duration: (fd.get('duration') || '').trim(),
      note:     (fd.get('note')     || '').trim()
    };
    let ok = true;
    function setErr(name, msg) {
      const el = form.querySelector(`[data-err="${name}"]`);
      if (el) el.textContent = msg;
      ok = false;
    }
    if (!obj.title)    setErr('title',    'Nhập tên khoá học.');
    if (!obj.catKey)   setErr('catKey',   'Chọn nền tảng.');
    if (!obj.level)    setErr('level',    'Chọn cấp độ.');
    if (!obj.duration) setErr('duration', 'Nhập thời lượng (vd. 5h).');
    return ok ? obj : false;
  }

  /* ── Bind events ── */

  document.getElementById('btnAdd').addEventListener('click', () => openForm('add'));
  searchEl.addEventListener('input', render);
  filterCat.addEventListener('change', render);
  filterLv.addEventListener('change', render);

  // Submit form (add hoặc update)
  form.addEventListener('submit', e => {
    e.preventDefault();
    const obj = validateForm();
    if (!obj) return;

    if (editingId) {
      data = data.map(r => r.id === editingId ? Object.assign({}, r, obj) : r);
      AdminShared.toast('Đã cập nhật khoá học.', 'success');
    } else {
      data.push(Object.assign({ id: AdminShared.uid() }, obj));
      AdminShared.toast('Đã thêm khoá vào lộ trình.', 'success');
    }
    AdminShared.saveData(STORAGE_KEY, data);
    AdminShared.closeModal('formModal');
    render();
  });

  // Click trên hàng → edit / delete
  tbody.addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const tr = btn.closest('tr');
    const id = tr && tr.dataset.id;
    const record = data.find(r => r.id === id);
    if (!record) return;

    if (btn.dataset.act === 'edit') {
      openForm('edit', record);
    } else if (btn.dataset.act === 'delete') {
      AdminShared.confirmDialog({
        title: 'Xoá khoá học?',
        message: `Khoá "${record.title}" sẽ bị xoá khỏi lộ trình. Không thể hoàn tác.`,
        confirmText: 'Xoá',
        danger: true
      }).then(ok => {
        if (!ok) return;
        data = data.filter(r => r.id !== id);
        AdminShared.saveData(STORAGE_KEY, data);
        AdminShared.toast('Đã xoá khoá học.', 'success');
        render();
      });
    }
  });

  /* Khởi tạo */
  populateCatSelects();
  render();
})();
