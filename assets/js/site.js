/* Rora — roramake.ca
   Generative hero, scroll reveals, parallax and cursor. No dependencies. */

(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- generative visuals (stand in for photography) ---------- */
  var PALETTES = [
    [[18,42,48],[36,92,84],[122,150,120],[214,199,170]],
    [[20,26,40],[52,74,110],[128,134,168],[226,206,182]],
    [[28,24,26],[92,62,60],[158,124,102],[224,212,192]],
    [[16,34,34],[44,88,96],[136,160,150],[232,224,206]]
  ];
  function rnd(seed){ var s = seed; return function(){ s = (s*1103515245 + 12345) % 2147483648; return s/2147483648; }; }
  function field(cv, seed, t){
    var pal = PALETTES[seed % PALETTES.length];
    var w = cv.width, h = cv.height, ctx = cv.getContext('2d');
    var r = rnd(seed*7919 + 13);
    ctx.fillStyle = 'rgb('+pal[0].join(',')+')';
    ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation = 'lighter';
    for(var i=0;i<7;i++){
      var c = pal[1 + (i % 3)];
      var bx = r(), by = r(), ph = r()*6.28, sp = 0.35 + r()*0.5;
      var x = (bx + Math.sin(t*sp + ph)*0.13) * w;
      var y = (by + Math.cos(t*sp*0.8 + ph)*0.11) * h;
      var rad = (0.22 + r()*0.34) * w;
      var g = ctx.createRadialGradient(x,y,0,x,y,rad);
      g.addColorStop(0,'rgba('+c.join(',')+',0.85)');
      g.addColorStop(1,'rgba('+c.join(',')+',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x,y,rad,0,6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  /* hero: tiny buffer, blurred + scaled by CSS = cheap and smooth */
  var hero = document.getElementById('heroCanvas');
  if(hero){
    hero.width = 200; hero.height = 130;
    if(reduce){ field(hero, 5, 0); }
    else {
      var t0 = performance.now(), raf = null, running = true;
      var loop = function(now){
        if(!running) return;
        field(hero, 5, (now - t0)/6500);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      document.addEventListener('visibilitychange', function(){
        if(document.hidden){ running = false; if(raf) cancelAnimationFrame(raf); }
        else if(!running){ running = true; t0 = performance.now() - 3000; raf = requestAnimationFrame(loop); }
      });
    }
  }

  /* work tiles: one static frame each */
  var shots = [].slice.call(document.querySelectorAll('.shot'));
  shots.forEach(function(shot){
    var cv = shot.querySelector('canvas');
    if(!cv) return;
    cv.width = 160; cv.height = 110;
    field(cv, parseInt(shot.getAttribute('data-seed'),10) || 3, 1.7);
  });

  /* ---------- scroll reveals ---------- */
  var rvs = [].slice.call(document.querySelectorAll('.rv'));
  if(reduce || !('IntersectionObserver' in window)){
    rvs.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {rootMargin:'0px 0px -12% 0px', threshold:0.08});
    rvs.forEach(function(el){ io.observe(el); });
    /* failsafe: never leave content hidden */
    setTimeout(function(){
      rvs.forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.top < window.innerHeight) el.classList.add('in');
      });
    }, 1600);
  }

  /* ---------- header state + parallax ---------- */
  var hdr = document.getElementById('hdr');
  var ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.pageYOffset || document.documentElement.scrollTop;
      hdr.classList.toggle('solid', y > window.innerHeight * 0.72);
      if(!reduce){
        var vh = window.innerHeight;
        shots.forEach(function(shot){
          var r = shot.getBoundingClientRect();
          if(r.bottom < -200 || r.top > vh + 200) return;
          var p = (r.top + r.height/2 - vh/2) / vh;
          var cv = shot.querySelector('canvas');
          if(cv) cv.style.transform = 'translate3d(0,' + (p * -26).toFixed(2) + 'px,0)';
        });
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      var el = id === '#top' ? document.body : document.querySelector(id);
      if(!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
    });
  });

  /* ---------- cursor ---------- */
  var cur = document.getElementById('cur');
  if(cur && !reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    var cx = 0, cy = 0, tx = 0, ty = 0, started = false;
    window.addEventListener('mousemove', function(e){
      tx = e.clientX; ty = e.clientY;
      if(!started){ cx = tx; cy = ty; started = true; cur.classList.add('on'); }
    }, {passive:true});
    (function follow(){
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll('a, .shot').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cur.classList.add('big'); });
      el.addEventListener('mouseleave', function(){ cur.classList.remove('big'); });
    });
  }
})();
