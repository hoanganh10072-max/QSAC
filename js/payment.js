/* payment.js — Trang thanh toán QR */

const COURSE_PRICES = {
  1: { price: 1500000, label: 'TMDT' },
  2: { price: 2800000, label: 'LDZ'  },
  3: { price: 2200000, label: 'MKT'  },
  4: { price: 1800000, label: 'PLY'  },
  5: { price: 3500000, label: 'VHN'  },
  6: { price: 1600000, label: 'LOG'  },
  7: { price: 2500000, label: 'THG'  },
  8: { price: 2900000, label: 'DATA' },
};

function fmt(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function renderQR() {
  const on = [2,6,8,10,12,17,20,22,24,28,31,35,38,41,43,45,48,52,55,58,60,62,65,69,
    72,74,77,80,82,84,87,91,94,97,99,101,104,106,108,111,114,117,120,122,125,128,130,
    132,135,139,142,144,147,149,152,155,157,159,162,164,167,171,174,177,180,182,185,
    187,190,193,196,199,201,204,207,210,212,215,218,221,224,227,230,232,235,238,241,
    244,247,250,253,256,259,262,265,268,271,274,277,280,283,286];
  const grid = document.getElementById('qr-grid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: 289 }, (_, i) =>
    `<span class="${on.includes(i) ? 'q' : ''}"></span>`
  ).join('');
}

function startCountdown(totalSeconds) {
  const el = document.getElementById('countdown');
  if (!el) return;
  let remaining = totalSeconds;
  const tick = () => {
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
    if (remaining > 0) {
      remaining--;
      setTimeout(tick, 1000);
    } else {
      el.textContent = '00:00';
      el.style.color = '#e03030';
    }
  };
  tick();
}

document.addEventListener('DOMContentLoaded', () => {
  const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
  const data = COURSE_PRICES[id] || COURSE_PRICES[1];

  // Populate price
  document.querySelector('.js-price').textContent = fmt(data.price);

  // Generate transfer code from timestamp
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts = String(now.getFullYear()).slice(-2)
    + pad(now.getMonth() + 1)
    + pad(now.getDate())
    + pad(now.getHours())
    + pad(now.getMinutes())
    + pad(now.getSeconds());
  const code = `QSAC_${data.label}_${ts}`;
  document.querySelector('.js-code').textContent = code;

  // Copy button
  const copyBtn = document.getElementById('copy-btn');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(code).then(() => {
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      copyBtn.style.color = '#18a052';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        copyBtn.style.color = '';
      }, 2000);
    });
  });

  // Render QR
  renderQR();

  // Start 15-minute countdown
  startCountdown(15 * 60 - 1);
});
