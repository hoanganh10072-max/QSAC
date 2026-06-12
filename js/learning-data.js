/* learning-data.js — Dữ liệu lộ trình học dùng chung
   Phải load TRƯỚC learning-path.js và path-detail.js.
   Expose 3 global: LP_CATEGORIES, LP_PATH_DETAILS, LP_LEVEL_LABEL.
*/

/* 7 nền tảng/chủ đề — quyết định thứ tự, icon, theme màu, mô tả ngắn */
const LP_CATEGORIES = [
  { key: 'shopee',     name: 'Shopee',              icon: 'fa-bag-shopping',     iconType: 'fa-solid',  theme: 'orange',
    desc: 'Bán hàng trên sàn Shopee — gian hàng, voucher, Ads.' },
  { key: 'lazada',     name: 'Lazada',              icon: 'fa-truck-fast',       iconType: 'fa-solid',  theme: 'purple',
    desc: 'Bán hàng Lazada — LazMall, LazLive, Sponsored.' },
  { key: 'tiktok',     name: 'TikTok Shop',         icon: 'fa-tiktok',           iconType: 'fa-brands', theme: 'cyan',
    desc: 'TikTok Shop — content viral, affiliate, live commerce.' },
  { key: 'livestream', name: 'Livestream bán hàng', icon: 'fa-tower-broadcast',  iconType: 'fa-solid',  theme: 'pink',
    desc: 'Setup, kịch bản, chốt đơn livestream đa nền tảng.' },
  { key: 'marketing',  name: 'Marketing & QC',      icon: 'fa-bullhorn',         iconType: 'fa-solid',  theme: 'blue',
    desc: 'Digital Marketing, Performance, Tracking TMĐT.' },
  { key: 'ops',        name: 'Vận hành & CSKH',     icon: 'fa-headset',          iconType: 'fa-solid',  theme: 'green',
    desc: 'Xử lý đơn, kho vận, chăm sóc khách hàng.' },
  { key: 'brand',      name: 'Xây dựng thương hiệu',icon: 'fa-medal',            iconType: 'fa-solid',  theme: 'purple',
    desc: 'Định vị, nhận diện, PR & chiến lược thương hiệu.' }
];

/* Khóa học cho từng (nền tảng × cấp). Mỗi khóa: {t: tiêu đề, d: thời lượng "Xh"}.
   Đây là SEED — sẽ bị override bởi dữ liệu admin trong localStorage (xem cuối file). */
const LP_PATH_SEED = {
  shopee: {
    basic: [
      { t: 'Mở gian hàng Shopee từ A → Z', d: '5h', note: 'Đăng ký, xác minh, thiết lập gian hàng đầu tiên trên Shopee.' },
      { t: 'Đăng & tối ưu sản phẩm Shopee', d: '6h', note: 'Tiêu đề, mô tả, ảnh, biến thể — chuẩn SEO Shopee.' },
      { t: 'Cài đặt vận chuyển & thanh toán', d: '3h', note: 'Kết nối đối tác vận chuyển, phương thức thanh toán.' }
    ],
    intermediate: [
      { t: 'SEO listing & xếp hạng tìm kiếm', d: '8h', note: 'Cấu trúc title, keyword, ảnh chuẩn xếp hạng.' },
      { t: 'Flash Sale, Voucher, Combo deals', d: '6h', note: 'Lên kịch bản khuyến mãi tăng đơn theo chu kỳ.' },
      { t: 'Quản đơn & Chat tư vấn', d: '5h', note: 'Quy trình xử lý đơn, response rate, mẫu trả lời.' }
    ],
    advanced: [
      { t: 'Shopee Ads: đấu thầu & tối ưu CPC', d: '10h', note: 'Search/Discovery Ads, đấu giá, ROAS.' },
      { t: 'Lên Shopee Mall & ngôi sao', d: '6h', note: 'Tiêu chí, hồ sơ, gia hạn ngôi sao yêu thích.' },
      { t: 'Phân tích Business Insights', d: '7h', note: 'Đọc báo cáo, A/B, ra quyết định dữ liệu.' }
    ]
  },
  lazada: {
    basic: [
      { t: 'Đăng ký & thiết lập gian Lazada', d: '4h', note: 'Tài khoản, xác minh, cấu hình gian hàng.' },
      { t: 'Đăng sản phẩm chuẩn Lazada', d: '5h', note: 'Listing chuẩn Lazada, danh mục, biến thể.' }
    ],
    intermediate: [
      { t: 'LazMall & chính sách bán hàng', d: '6h', note: 'Tiêu chí LazMall, bảo hành, chính sách trả hàng.' },
      { t: 'LazLive: livestream Lazada', d: '5h', note: 'Lên kế hoạch, kịch bản, tương tác trong LazLive.' },
      { t: 'Khuyến mãi & Voucher Lazada', d: '4h', note: 'Voucher shop, ngân sách, hiệu quả.' }
    ],
    advanced: [
      { t: 'Sponsored Discovery & Search Ads', d: '8h', note: 'Cấu hình quảng cáo theo từ khoá và mục tiêu.' },
      { t: 'Business Advisor & báo cáo', d: '6h', note: 'Phân tích báo cáo, tối ưu hiệu quả gian hàng.' }
    ]
  },
  tiktok: {
    basic: [
      { t: 'Đăng ký tài khoản TikTok Shop', d: '3h', note: 'Mở tài khoản, xác minh, liên kết.' },
      { t: 'Quay video bán hàng cơ bản', d: '5h', note: 'Setup ánh sáng, góc quay, biên tập nhanh.' },
      { t: 'Đăng & gắn sản phẩm vào video', d: '4h', note: 'Workflow đăng video, tagging sản phẩm.' }
    ],
    intermediate: [
      { t: 'Affiliate & cộng tác KOL/KOC', d: '6h', note: 'Cơ chế hoa hồng, tuyển KOC, đo lường.' },
      { t: 'Box giỏ hàng & checkout in-app', d: '4h', note: 'Cấu hình giỏ hàng, kịch bản chốt đơn.' },
      { t: 'Tăng tương tác & follower', d: '6h', note: 'Trend, hashtag, lịch đăng, cộng đồng.' }
    ],
    advanced: [
      { t: 'TikTok Ads (TopView, Spark, VSA)', d: '10h', note: 'Cấu hình, ngân sách, sáng tạo nội dung Ads.' },
      { t: 'Live Commerce: chốt đơn livestream', d: '8h', note: 'Kịch bản dài, sản phẩm chủ lực, kêu gọi.' },
      { t: 'Chiến lược content viral đa kênh', d: '7h', note: 'Tận dụng nội dung TikTok cho Shopee/FB.' }
    ]
  },
  livestream: {
    basic: [
      { t: 'Setup studio livestream tại nhà', d: '4h', note: 'Ánh sáng, mic, background tối thiểu.' },
      { t: 'Kỹ năng nói trước camera', d: '5h', note: 'Giọng nói, body language, năng lượng.' }
    ],
    intermediate: [
      { t: 'Kịch bản livestream chốt đơn', d: '6h', note: 'Cấu trúc 1 buổi live: hook → demo → CTA.' },
      { t: 'Tương tác & xử lý bình luận live', d: '4h', note: 'Đọc comment, xử lý phản đối, mod hỗ trợ.' }
    ],
    advanced: [
      { t: 'Tối ưu CPM & ngân sách livestream', d: '6h', note: 'Phân tích chi phí giữ chân, mức boost.' },
      { t: 'Live đa nền tảng (Shopee/TikTok/FB)', d: '5h', note: 'Restream, OBS, quản lý đồng thời.' }
    ]
  },
  marketing: {
    basic: [
      { t: 'Tổng quan Digital Marketing 2026', d: '4h', note: 'Landscape, channel mix, KPI cơ bản.' },
      { t: 'Funnel & hành trình khách hàng', d: '5h', note: 'AIDA, AAARRR, mapping touchpoint.' }
    ],
    intermediate: [
      { t: 'Facebook Ads cho TMĐT', d: '8h', note: 'Cấu trúc tài khoản, audience, sáng tạo.' },
      { t: 'Google Ads & Shopping Ads', d: '7h', note: 'Search, Shopping, Performance Max.' },
      { t: 'Email & SMS Marketing', d: '5h', note: 'Lifecycle, automation, đo lường.' }
    ],
    advanced: [
      { t: 'Tracking & GA4 cho TMĐT', d: '8h', note: 'Events, e-commerce, GTM, debug.' },
      { t: 'Phân tích Cohort & LTV', d: '6h', note: 'Retention, LTV, payback period.' },
      { t: 'Performance Marketing tổng thể', d: '10h', note: 'Multi-channel attribution, budget mix.' }
    ]
  },
  ops: {
    basic: [
      { t: 'Quy trình xử lý đơn hàng chuẩn', d: '4h', note: 'Pick-pack-ship, SLA, exception flow.' },
      { t: 'Quản lý kho cơ bản (FIFO/FEFO)', d: '5h', note: 'Layout kho, mã SKU, kiểm kê.' },
      { t: 'Chăm sóc khách hàng cơ bản', d: '4h', note: 'Tone, kịch bản FAQ, escalation.' }
    ],
    intermediate: [
      { t: 'Tối ưu fulfilment & đóng gói', d: '5h', note: 'Tối ưu chi phí, packaging, bảo vệ hàng.' },
      { t: 'Xử lý đổi trả & khiếu nại', d: '4h', note: 'Quy trình RMA, làm dịu khách khó.' }
    ],
    advanced: [
      { t: 'Tự động hóa CSKH với chatbot', d: '6h', note: 'Bot script, handoff, đo CSAT.' },
      { t: 'CRM & phân khúc khách hàng', d: '7h', note: 'RFM, segment, chiến dịch nuôi dưỡng.' }
    ]
  },
  brand: {
    basic: [
      { t: 'Định vị thương hiệu cá nhân', d: '5h', note: 'Xác định USP, persona, audience.' },
      { t: 'Nguyên lý xây dựng brand', d: '4h', note: 'Brand pillars, archetype, ngôn ngữ.' }
    ],
    intermediate: [
      { t: 'Bộ nhận diện thương hiệu shop', d: '6h', note: 'Logo, color, font, mockup.' },
      { t: 'Câu chuyện thương hiệu (brand story)', d: '5h', note: 'Cấu trúc story, áp dụng đa kênh.' },
      { t: 'Tone of voice & visual guideline', d: '4h', note: 'Sổ tay style cho team content.' }
    ],
    advanced: [
      { t: 'Chiến lược PR & truyền thông', d: '7h', note: 'Lên kế hoạch PR, khủng hoảng, đo earned media.' },
      { t: 'KOL, KOC & community building', d: '6h', note: 'Tuyển chọn, hợp tác, đánh giá hiệu quả.' },
      { t: 'Brand collab & co-marketing', d: '5h', note: 'Đàm phán, deliverable, đo lường chung.' }
    ]
  }
};

const LP_LEVEL_LABEL = { basic: 'Cơ bản', intermediate: 'Trung cấp', advanced: 'Nâng cao' };

/* Rebuild LP_PATH_DETAILS từ localStorage nếu admin đã sửa dữ liệu.
   Key 'qsac_admin_paths' là flat array { id, catKey, level, title, duration, note }
   do admin/courses.html (admin-courses.js) ghi xuống. Nếu không có → dùng seed. */
function buildPathDetails() {
  try {
    const raw = localStorage.getItem('qsac_admin_paths');
    if (!raw) return LP_PATH_SEED;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return LP_PATH_SEED;

    const out = {};
    arr.forEach(item => {
      if (!item || !item.catKey || !item.level || !item.title) return;
      if (!out[item.catKey]) out[item.catKey] = { basic: [], intermediate: [], advanced: [] };
      if (!out[item.catKey][item.level]) out[item.catKey][item.level] = [];
      out[item.catKey][item.level].push({
        t: item.title,
        d: item.duration || '',
        note: item.note || ''
      });
    });
    return out;
  } catch (e) {
    return LP_PATH_SEED;
  }
}

const LP_PATH_DETAILS = buildPathDetails();
