/* =============================================
   admin-courses.js — CRUD khoá học
   Dùng cho: admin/courses.html
   Phụ thuộc: admin-shared.js (AdminShared)
   Luồng: guard → load data (seed nếu trống) → render
          → bind add/edit/delete + search/filter
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return;
  AdminShared.bindSidebar();
  AdminShared.bindLogout();

  const STORAGE_KEY = 'qsac_admin_courses';

  // Seed dữ liệu mẫu, khớp với index.html public (ảnh dùng picsum.photos để có thumbnail luôn).
  // c1..c5 có thông tin khai giảng (startDate/timeStart/timeEnd/seatsLeft/label) để hiển thị
  // trên trang Lịch khai giảng. c6..c8 chưa lên lịch.
  const PIC = function (seed) { return 'https://picsum.photos/seed/' + seed + '/400/240'; };
  const SEED = [
    { id: 'c1', name: 'Nhập môn Thương mại điện tử cho người mới', category: 'basic',      teacher: 'GV. Trần Thị Hà',   price: 1500000, duration: 6, lessons: 24, status: 'active', image: PIC('tmdt-intro'),         startDate: '2026-06-06', timeStart: '20:00', timeEnd: '22:00', seatsLeft: 35, label: 'hot'  },
    { id: 'c2', name: 'Bán hàng chuyên nghiệp trên Shopee & Lazada', category: 'advanced',  teacher: 'GV. Lê Văn Bình',   price: 2800000, duration: 8, lessons: 32, status: 'active', image: PIC('shopee-course'),      startDate: '2026-06-10', timeStart: '19:30', timeEnd: '21:30', seatsLeft: 28, label: 'best' },
    { id: 'c3', name: 'Marketing số & SEO cho sàn TMĐT',             category: 'marketing', teacher: 'GV. Phạm Minh Tuấn', price: 2200000, duration: 7, lessons: 28, status: 'active', image: PIC('digital-marketing'), startDate: '2026-06-21', timeStart: '20:00', timeEnd: '22:00', seatsLeft: 20, label: ''    },
    { id: 'c4', name: 'Pháp lý TMĐT & Hợp đồng thương mại điện tử',  category: 'legal',     teacher: 'GV. Nguyễn Thu Hương', price: 1800000, duration: 5, lessons: 20, status: 'active', image: PIC('law-ecommerce'),    startDate: '2026-06-25', timeStart: '19:00', timeEnd: '21:00', seatsLeft: 25, label: 'new' },
    { id: 'c5', name: 'Vận hành sàn TMĐT chuyên nghiệp từ A–Z',      category: 'operations',teacher: 'GV. Đỗ Quang Huy',  price: 3500000, duration: 9, lessons: 36, status: 'active', image: PIC('ecommerce-ops'),      startDate: '2026-07-02', timeStart: '20:00', timeEnd: '22:00', seatsLeft: 30, label: ''    },
    { id: 'c6', name: 'Quản lý kho hàng & Logistics TMĐT hiệu quả',  category: 'basic',     teacher: 'GV. Trần Đức Long', price: 1600000, duration: 6, lessons: 24, status: 'active', image: PIC('logistics-store') },
    { id: 'c7', name: 'Xây dựng thương hiệu online cá nhân & DN',   category: 'advanced',  teacher: 'GV. Vũ Thị Mai',    price: 2500000, duration: 8, lessons: 30, status: 'active', image: PIC('brand-online') },
    { id: 'c8', name: 'Phân tích dữ liệu & Báo cáo kinh doanh TMĐT', category: 'advanced', teacher: 'GV. Ngô Thành Nam', price: 2900000, duration: 7, lessons: 28, status: 'draft',  image: PIC('data-analytics') },
  ];

  const CAT_LABELS = {
    basic: 'Cơ bản', advanced: 'Nâng cao', marketing: 'Marketing số',
    legal: 'Pháp lý', operations: 'Vận hành',
  };

  // ── DOM refs ──
  const tbody = document.getElementById('dataBody');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('rowCount');
  const searchEl = document.getElementById('searchInput');
  const filterCat = document.getElementById('filterCategory');
  const filterSt = document.getElementById('filterStatus');
  const form = document.getElementById('dataForm');
  const formTitle = document.getElementById('formTitle');
  // Image picker refs
  const imgUrl = document.getElementById('imgUrl');
  const imgFile = document.getElementById('imgFile');
  const imgClear = document.getElementById('imgClear');
  const imgPreviewImg = document.getElementById('imgPreviewImg');
  const imgPreviewPh = document.getElementById('imgPreviewPlaceholder');

  let data = AdminShared.loadData(STORAGE_KEY, SEED);
  let editingId = null;

  // ── Render bảng theo bộ lọc hiện tại ──
  function render() {
    const q = (searchEl.value || '').trim().toLowerCase();
    const cat = filterCat.value;
    const st = filterSt.value;

    const filtered = data.filter(function (r) {
      if (cat && r.category !== cat) return false;
      if (st && r.status !== st) return false;
      if (q && !(r.name.toLowerCase().includes(q) || (r.teacher || '').toLowerCase().includes(q))) return false;
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
    tbody.innerHTML = filtered.map(function (r) {
      const statusPill = r.status === 'active'
        ? '<span class="adm-pill ok">Đang mở</span>'
        : '<span class="adm-pill warn">Bản nháp</span>';
      const thumb = r.image
        ? '<img class="adm-thumb" src="' + esc(r.image) + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'" />' +
          '<span class="adm-thumb-placeholder" style="display:none"><i class="fa-solid fa-image"></i></span>'
        : '<span class="adm-thumb-placeholder"><i class="fa-solid fa-image"></i></span>';
      return '' +
        '<tr>' +
        '  <td>' + thumb + '</td>' +
        '  <td><b>' + esc(r.name) + '</b><br><small style="color:var(--adm-muted)">' + r.lessons + ' bài</small></td>' +
        '  <td>' + esc(CAT_LABELS[r.category] || r.category) + '</td>' +
        '  <td>' + esc(r.teacher) + '</td>' +
        '  <td>' + AdminShared.formatMoney(r.price) + '</td>' +
        '  <td>' + r.duration + '</td>' +
        '  <td>' + statusPill + '</td>' +
        '  <td>' +
        '    <div class="adm-row-actions">' +
        '      <button class="adm-icon-btn" data-edit="' + r.id + '" title="Sửa"><i class="fa-solid fa-pen"></i></button>' +
        '      <button class="adm-icon-btn danger" data-del="' + r.id + '" title="Xoá"><i class="fa-solid fa-trash"></i></button>' +
        '    </div>' +
        '  </td>' +
        '</tr>';
    }).join('');
  }

  // ── Cập nhật khung preview ảnh theo URL hiện tại trong input ──
  function updateImgPreview() {
    const url = (imgUrl.value || '').trim();
    if (url) {
      imgPreviewImg.src = url;
      imgPreviewImg.hidden = false;
      imgPreviewPh.style.display = 'none';
    } else {
      imgPreviewImg.removeAttribute('src');
      imgPreviewImg.hidden = true;
      imgPreviewPh.style.display = '';
    }
  }

  // ── Open modal: thêm mới hoặc sửa ──
  function openCreate() {
    editingId = null;
    formTitle.textContent = 'Thêm khoá học';
    form.reset();
    clearErrors();
    updateImgPreview();
    AdminShared.openModal('formModal');
  }
  function openEdit(id) {
    const r = data.find(function (x) { return x.id === id; });
    if (!r) return;
    editingId = id;
    formTitle.textContent = 'Sửa khoá học';
    clearErrors();
    Object.keys(r).forEach(function (k) {
      const f = form.elements[k];
      if (f) f.value = r[k];
    });
    updateImgPreview();
    AdminShared.openModal('formModal');
  }

  function clearErrors() {
    form.querySelectorAll('.err').forEach(function (e) { e.textContent = ''; });
    form.querySelectorAll('.invalid').forEach(function (e) { e.classList.remove('invalid'); });
  }

  // ── Validate form và trả về object dữ liệu ──
  function validate() {
    clearErrors();
    const fd = new FormData(form);
    const obj = {
      name: (fd.get('name') || '').toString().trim(),
      category: fd.get('category') || '',
      teacher: (fd.get('teacher') || '').toString().trim(),
      price: Number(fd.get('price')),
      duration: Number(fd.get('duration')),
      lessons: Number(fd.get('lessons')),
      status: fd.get('status') || 'active',
      image: (fd.get('image') || '').toString().trim(),
      // Khai giảng (tùy chọn) — chỉ validate khi user điền
      startDate: (fd.get('startDate') || '').toString(),
      timeStart: (fd.get('timeStart') || '').toString(),
      timeEnd: (fd.get('timeEnd') || '').toString(),
      seatsLeft: fd.get('seatsLeft') === '' || fd.get('seatsLeft') == null ? null : Number(fd.get('seatsLeft')),
      label: fd.get('label') || '',
    };
    let ok = true;
    const setErr = function (name, msg) {
      const errEl = form.querySelector('[data-err="' + name + '"]');
      const inp = form.elements[name];
      if (errEl) errEl.textContent = msg;
      if (inp) inp.classList.add('invalid');
      ok = false;
    };
    if (!obj.name) setErr('name', 'Vui lòng nhập tên khoá học');
    if (!obj.category) setErr('category', 'Chọn danh mục');
    if (!obj.teacher) setErr('teacher', 'Nhập tên giảng viên');
    if (!(obj.price >= 0)) setErr('price', 'Giá phải là số ≥ 0');
    if (!(obj.duration >= 1)) setErr('duration', 'Tối thiểu 1 tuần');
    if (!(obj.lessons >= 1)) setErr('lessons', 'Tối thiểu 1 bài');
    // Nếu đã nhập startDate → bắt buộc nhập giờ bắt đầu/kết thúc + giờ kết thúc > giờ bắt đầu
    if (obj.startDate) {
      if (!obj.timeStart) setErr('timeStart', 'Nhập giờ bắt đầu');
      if (!obj.timeEnd) setErr('timeEnd', 'Nhập giờ kết thúc');
      if (obj.timeStart && obj.timeEnd && obj.timeEnd <= obj.timeStart) {
        setErr('timeEnd', 'Giờ kết thúc phải sau giờ bắt đầu');
      }
    }
    return ok ? obj : null;
  }

  // ── Submit handler ──
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const obj = validate();
    if (!obj) return;
    if (editingId) {
      const idx = data.findIndex(function (x) { return x.id === editingId; });
      if (idx >= 0) data[idx] = Object.assign({}, data[idx], obj);
      AdminShared.toast('Đã cập nhật khoá học');
    } else {
      data.unshift(Object.assign({ id: AdminShared.uid() }, obj));
      AdminShared.toast('Đã thêm khoá học mới');
    }
    AdminShared.saveData(STORAGE_KEY, data);
    AdminShared.closeModal('formModal');
    render();
  });

  // ── Image picker handlers ──
  // 1. Gõ/dán URL trực tiếp → preview ngay
  imgUrl.addEventListener('input', updateImgPreview);

  // 2. Chọn file → đọc thành base64 và set vào URL input
  imgFile.addEventListener('change', function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Cảnh báo nếu file lớn (base64 trong localStorage rất tốn dung lượng ~5MB tổng)
    if (file.size > 500 * 1024) {
      AdminShared.toast('Ảnh > 500KB sẽ chiếm nhiều localStorage. Nên dùng URL ngoài.', 'warn');
    }
    const reader = new FileReader();
    reader.onload = function () {
      imgUrl.value = reader.result;
      updateImgPreview();
    };
    reader.onerror = function () {
      AdminShared.toast('Không đọc được file ảnh', 'error');
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset để chọn lại cùng file vẫn trigger
  });

  // 3. Nút bỏ ảnh
  imgClear.addEventListener('click', function () {
    imgUrl.value = '';
    updateImgPreview();
  });

  // ── Bind nút Thêm + actions trên hàng ──
  document.getElementById('btnAdd').addEventListener('click', openCreate);

  tbody.addEventListener('click', function (e) {
    const editBtn = e.target.closest('[data-edit]');
    if (editBtn) { openEdit(editBtn.dataset.edit); return; }
    const delBtn = e.target.closest('[data-del]');
    if (delBtn) {
      const id = delBtn.dataset.del;
      const row = data.find(function (x) { return x.id === id; });
      AdminShared.confirmDialog({
        title: 'Xoá khoá học',
        message: 'Bạn chắc chắn muốn xoá khoá học "' + (row ? row.name : '') + '"? Hành động này không thể hoàn tác.',
        okText: 'Xoá', okClass: 'danger',
        onOk: function () {
          data = data.filter(function (x) { return x.id !== id; });
          AdminShared.saveData(STORAGE_KEY, data);
          render();
          AdminShared.toast('Đã xoá khoá học', 'warn');
        }
      });
    }
  });

  // ── Bind search/filter với debounce nhẹ ──
  let t;
  searchEl.addEventListener('input', function () {
    clearTimeout(t); t = setTimeout(render, 150);
  });
  filterCat.addEventListener('change', render);
  filterSt.addEventListener('change', render);

  render();
})();
