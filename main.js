// Typing effect
var el = document.getElementById('role');
var roles = ['I build Discord bots', 'I create web apps', 'I manage systems'];
var r = 0, c = 0, del = false;
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function type() {
  var w = roles[r];
  el.textContent = w.slice(0, c);
  if (!del && c === w.length) { 
    del = true; 
    return setTimeout(type, 1800); 
  }
  if (del && c === 0) { 
    del = false; 
    r = (r + 1) % roles.length; 
  }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 85);
}

if (reduce) {
  el.textContent = roles[0];
} else {
  type();
}

// Scroll reveal
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('active');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function (s) {
  io.observe(s);
});

// Lightbox
var lb = document.getElementById('lb');
var lbi = document.getElementById('lbi');

document.querySelectorAll('.shot').forEach(function (b) {
  b.addEventListener('click', function () {
    lbi.src = b.dataset.src || b.src;
    lbi.alt = b.dataset.alt || '';
    lb.style.display = 'flex';
  });
});

document.getElementById('lbx').onclick = function () {
  lb.style.display = 'none';
};

lb.addEventListener('click', function (e) {
  if (e.target === lb) lb.style.display = 'none';
});

// Twinkling stars background canvas
var cv = document.getElementById('stars');
var cx = cv.getContext('2d');
var st = [];

function size() {
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  st = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 12)) }, function () {
    return {
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: Math.random() * 1.2 + 0.4,
      s: Math.random() * 0.02 + 0.005,
      p: Math.random() * 6.28
    };
  });
}

function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  st.forEach(function (s) {
    s.p += s.s;
    cx.globalAlpha = 0.25 + Math.abs(Math.sin(s.p)) * 0.6;
    cx.fillStyle = '#efe7dc';
    cx.beginPath();
    cx.arc(s.x, s.y, s.r, 0, 6.28);
    cx.fill();
  });
  if (!reduce) requestAnimationFrame(draw);
}

window.addEventListener('resize', size);
size();
draw();
