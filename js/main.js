/* =========================================================
   Akeef · Studio — main.js
   Premium portfolio behaviour
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Mobile vh fix ---------- */
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  setVh();
  window.addEventListener('resize', setVh, { passive: true });
  window.addEventListener('orientationchange', setVh);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* =========================================================
     Loader
     ========================================================= */
  const loader = document.getElementById('loader');
  const counter = document.getElementById('loaderCount');
  const bar = loader?.querySelector('.loader__bar span');

  const startLoader = () => {
    if (!loader) { document.body.classList.remove('no-scroll'); initOnLoad(); return; }
    let pct = 0;
    const tick = () => {
      pct += Math.random() * 11 + 4;
      if (pct > 100) pct = 100;
      if (counter) counter.textContent = String(Math.floor(pct)).padStart(2, '0');
      if (bar) bar.style.width = `${pct}%`;
      if (pct < 100) {
        setTimeout(tick, 70);
      } else {
        setTimeout(finishLoader, 300);
      }
    };
    tick();
  };

  let booted = false;
  const finishLoader = () => {
    if (!loader || booted) return;
    booted = true;
    loader.classList.add('is-out');
    document.body.classList.remove('no-scroll');
    setTimeout(() => loader?.remove(), 900);
    document.querySelector('.hero')?.classList.add('is-in');
    initOnLoad();
  };

  window.addEventListener('load', startLoader);
  // safety net — force-finish in case load doesn't fire on slow networks
  setTimeout(() => { if (!booted) finishLoader(); }, 3500);

  /* =========================================================
     Custom cursor — transform-based, no layout thrash
     ========================================================= */
  const cursor = document.querySelector('.cursor');
  const dot = cursor?.querySelector('.cursor__dot');
  const ring = cursor?.querySelector('.cursor__ring');

  const initCursor = () => {
    if (!cursor || isTouch) { cursor?.remove(); return; }
    let mx = -50, my = -50;
    let rx = mx, ry = my;
    let dotPending = false;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (!dotPending) {
        dotPending = true;
        requestAnimationFrame(() => {
          if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
          dotPending = false;
        });
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverables = 'a, button, [data-magnetic], input, select, textarea, .chip, .card, .mstep';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
    }, { passive: true });
    document.addEventListener('mousedown', () => cursor.classList.add('is-down'), { passive: true });
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-down'), { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-hover', 'is-down'));
  };

  /* =========================================================
     Nav scroll state + active link
     ========================================================= */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__links a, .menu__links a');

  const initNavScroll = () => {
    let last = 0, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        if (Math.abs(y - last) > 4) {
          nav?.classList.toggle('is-scrolled', y > 30);
          last = y;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  const initActiveNav = () => {
    const sections = ['home','about','process','work','motion','services','connect','skills','contact']
      .map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const id = en.target.id;
          navLinks.forEach(a => {
            const match = a.getAttribute('href') === `#${id}`;
            a.classList.toggle('is-active', match);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => obs.observe(s));
  };

  /* =========================================================
     Mobile menu — auto-close on link click, escape, and resize
     ========================================================= */
  const initMenu = () => {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('menu');
    if (!toggle || !menu) return;

    // Defensive: ensure menu starts closed (in case any CSS state leaked)
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };
    toggle.addEventListener('click', () => {
      toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // Auto-close if viewport resizes to desktop
    const mql = window.matchMedia('(min-width: 1081px)');
    const handleViewport = (e) => { if (e.matches) close(); };
    if (mql.addEventListener) mql.addEventListener('change', handleViewport);
    else if (mql.addListener) mql.addListener(handleViewport);
  };

  /* =========================================================
     Hero rotator (cycling words)
     ========================================================= */
  const initRotator = () => {
    const rot = document.querySelector('[data-rotator]');
    if (!rot) return;
    const words = Array.from(rot.children);
    if (!words.length) return;
    let i = 0;
    rot.style.position = 'relative';
    rot.style.display = 'inline-block';
    rot.style.width = '100%';
    words.forEach((w, idx) => {
      w.style.position = 'absolute';
      w.style.left = '0';
      w.style.right = '0';
      w.style.willChange = 'transform, opacity';
      w.style.transform = idx === 0 ? 'translate3d(0,0,0)' : 'translate3d(0,110%,0)';
      w.style.opacity = idx === 0 ? '1' : '0';
    });

    setInterval(() => {
      const cur = words[i];
      const next = words[(i + 1) % words.length];
      cur.style.transform = 'translate3d(0,-110%,0)';
      cur.style.opacity = '0';
      next.style.transform = 'translate3d(0,0,0)';
      next.style.opacity = '1';
      i = (i + 1) % words.length;
    }, 2400);
  };

  /* =========================================================
     Reveal on scroll
     ========================================================= */
  const initReveal = () => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal], .reveal-lines').forEach(el => el.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    document.querySelectorAll('[data-reveal], .reveal-lines').forEach(el => obs.observe(el));
  };

  /* =========================================================
     Magnetic buttons (transform-based, throttled with rAF)
     ========================================================= */
  const initMagnetic = () => {
    if (isTouch) return;
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      let pending = false, tx = 0, ty = 0;
      el.style.willChange = 'transform';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * 0.18;
        ty = (e.clientY - r.top - r.height / 2) * 0.22;
        if (!pending) {
          pending = true;
          requestAnimationFrame(() => {
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            pending = false;
          });
        }
      }, { passive: true });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  };

  /* =========================================================
     Service card glow follow
     ========================================================= */
  const initSvcGlow = () => {
    if (isTouch) return;
    document.querySelectorAll('.svc').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      }, { passive: true });
    });
  };

  /* =========================================================
     Project filter
     ========================================================= */
  const initFilter = () => {
    const chips = document.querySelectorAll('.work__filters .chip');
    const cards = document.querySelectorAll('.work__grid .card');
    if (!chips.length) return;
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-selected', 'false'); });
        chip.classList.add('is-active'); chip.setAttribute('aria-selected', 'true');
        const f = chip.dataset.filter;
        cards.forEach(card => {
          const show = f === 'all' || card.dataset.cat === f;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  };

  /* =========================================================
     Anchor smooth scrolling — native
     ========================================================= */
  const initAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return;
        const tgt = document.querySelector(id);
        if (!tgt) return;
        e.preventDefault();
        const top = tgt.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    });
  };

  /* =========================================================
     Contact form — direct send via FormSubmit AJAX
     (no app or other website opens — message goes to inbox)
     ========================================================= */
  const initContactForm = () => {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const msg = (data.get('message') || '').toString().trim();
      const honey = (data.get('_honey') || '').toString().trim();

      if (honey) return; // bot trap

      if (!name || !email || !msg) {
        note.textContent = 'Please complete name, email and message before sending.';
        note.className = 'form__note is-error';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const submitLabel = submitBtn?.querySelector('span');
      const originalLabel = submitLabel ? submitLabel.textContent : '';
      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending…';
      note.textContent = 'Sending your inquiry directly to the studio inbox…';
      note.className = 'form__note is-loading';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        const json = await res.json().catch(() => ({}));
        const ok = res.ok || res.status === 200;
        const successFlag = json.success === 'true' || json.success === true;
        const msg = (json.message || '').toLowerCase();
        const needsActivation = msg.includes('activat') || msg.includes('confirm') || msg.includes('verify');

        if (ok && successFlag && !needsActivation) {
          // Fully delivered
          note.textContent = 'Thank you, ' + name.split(' ')[0] + '. Your inquiry has landed in the studio inbox — I will reply within 24 hours.';
          note.className = 'form__note is-success';
          form.reset();
        } else if (ok && (successFlag || needsActivation)) {
          // First-time use: FormSubmit needs the owner to activate
          note.innerHTML = 'Thank you, ' + name.split(' ')[0] + '. Your message was received. <strong>One-time setup:</strong> the studio inbox needs to confirm this email endpoint — until then I may not see this. You can also reach me directly at <a href="mailto:akeef.farooqi@gmail.com" style="color:inherit;text-decoration:underline">akeef.farooqi@gmail.com</a>.';
          note.className = 'form__note is-success';
          form.reset();
        } else {
          throw new Error(json.message || `HTTP ${res.status}`);
        }
      } catch (err) {
        // Network or service failure — graceful fallback
        note.innerHTML = 'The form service is temporarily unreachable. Please email me directly at <a href="mailto:akeef.farooqi@gmail.com" style="color:inherit;text-decoration:underline">akeef.farooqi@gmail.com</a> and I will reply within 24 hours.';
        note.className = 'form__note is-error';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = originalLabel;
      }
    });
  };

  /* =========================================================
     Footer time (IST)
     ========================================================= */
  const initFooterTime = () => {
    const el = document.getElementById('footerTime');
    if (!el) return;
    const tick = () => {
      try {
        const now = new Date();
        const fmt = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
        });
        el.textContent = `IST · ${fmt.format(now)}`;
      } catch { /* noop */ }
    };
    tick();
    setInterval(tick, 30 * 1000);
  };

  /* =========================================================
     Skills slider — dot tracker + tap-to-scroll (mobile/tablet)
     ========================================================= */
  const initSkillsSlider = () => {
    const slider = document.querySelector('.skills__grid');
    const dots = document.querySelectorAll('.skills__dots .dot');
    if (!slider || !dots.length) return;

    const cards = () => slider.querySelectorAll('.skillgroup');

    const update = () => {
      const items = cards();
      if (!items.length) return;
      const r = slider.getBoundingClientRect();
      const center = r.left + r.width / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      items.forEach((card, idx) => {
        const cr = card.getBoundingClientRect();
        const cc = cr.left + cr.width / 2;
        const d = Math.abs(center - cc);
        if (d < bestDist) { bestDist = d; bestIdx = idx; }
      });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === bestIdx));
    };

    let pending = false;
    slider.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { update(); pending = false; });
    }, { passive: true });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const items = cards();
        const target = items[idx];
        if (!target) return;
        const sliderRect = slider.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = (targetRect.left + targetRect.width / 2) - (sliderRect.left + sliderRect.width / 2);
        slider.scrollBy({ left: offset, behavior: 'smooth' });
      });
    });

    // Sync on load + resize
    const onResize = () => requestAnimationFrame(update);
    window.addEventListener('resize', onResize, { passive: true });
    setTimeout(update, 200);
  };

  /* =========================================================
     In-motion section — typing terminal + phase indicator
     ========================================================= */
  const initMotion = () => {
    const term = document.getElementById('terminalBody');
    const phaseEl = document.getElementById('motionPhase');
    const steps = document.querySelectorAll('.mstep');
    if (!term) return;

    const seq = [
      { type: 'cmd',   prompt: 'akeef@studio', path: '~/client-site', cmd: 'figma export --frames hero,services,contact', phase: 0 },
      { type: 'out',   text: '◇ Exporting brand frames…' },
      { type: 'ok',    text: '✓ 12 frames exported · 1.6 MB' },
      { type: 'space' },
      { type: 'cmd',   prompt: 'akeef@studio', path: '~/client-site', cmd: 'npm run build', phase: 1 },
      { type: 'out',   text: '◇ Compiling components…' },
      { type: 'out',   text: '◇ Bundling JS · CSS · images…' },
      { type: 'ok',    text: '✓ Built in 2.4s · 184 KB gzipped' },
      { type: 'space' },
      { type: 'cmd',   prompt: 'akeef@studio', path: '~/client-site', cmd: 'npm run audit', phase: 2 },
      { type: 'out',   text: '◇ Running Lighthouse…' },
      { type: 'ok',    text: '✓ Performance 99 · A11y 100 · BP 100 · SEO 100' },
      { type: 'space' },
      { type: 'cmd',   prompt: 'akeef@studio', path: '~/client-site', cmd: 'git push origin main', phase: 3 },
      { type: 'out',   text: '◇ Deploying to production…' },
      { type: 'out',   text: '◇ Building image · 12s' },
      { type: 'out',   text: '◇ Provisioning SSL · 3s' },
      { type: 'ok',    text: '✓ Live at <span class="t-link">https://client.studio</span>' },
    ];

    const phaseLabels = [
      'Designing in Figma',
      'Building components',
      'Auditing & testing',
      'Shipping to production'
    ];

    let started = false;
    const start = () => {
      if (started) return;
      started = true;

      // Clear any pre-existing markup (the placeholder prompt+cursor)
      term.innerHTML = '';

      let i = 0;
      let charIdx = 0;
      let curCmdEl = null;
      let curCursorEl = null;

      const writeStaticLine = (cls, html) => {
        const line = document.createElement('span');
        line.className = `terminal__line ${cls || ''}`.trim();
        line.innerHTML = html;
        term.appendChild(line);
        scrollTermToBottom();
      };

      const scrollTermToBottom = () => { term.scrollTop = term.scrollHeight; };

      const setPhase = (p) => {
        if (p == null || !phaseEl) return;
        phaseEl.innerHTML = `<span>${String(p + 1).padStart(2,'0')}</span> ${phaseLabels[p]}`;
        steps.forEach((s, idx) => s.classList.toggle('is-active', idx <= p));
      };

      const next = () => {
        if (i >= seq.length) {
          // pause then loop
          setTimeout(() => {
            term.innerHTML = '';
            i = 0; charIdx = 0;
            steps.forEach(s => s.classList.remove('is-active'));
            setPhase(0);
            next();
          }, 4500);
          return;
        }

        const item = seq[i];

        if (item.type === 'space') {
          writeStaticLine('', '&nbsp;');
          i++;
          setTimeout(next, 200);
          return;
        }

        if (item.type === 'out') {
          writeStaticLine('t-out', item.text);
          i++;
          setTimeout(next, 320 + Math.random() * 200);
          return;
        }

        if (item.type === 'ok') {
          writeStaticLine('t-ok', item.text);
          i++;
          setTimeout(next, 380 + Math.random() * 200);
          return;
        }

        if (item.type === 'cmd') {
          if (charIdx === 0) {
            // create a new prompt line with empty cmd + blinking cursor
            const line = document.createElement('span');
            line.className = 'terminal__line t-prompt-line';
            line.innerHTML = `<span class="t-prompt">${item.prompt}</span>:<span class="t-path">${item.path}</span>$ <span class="t-cmd"></span><span class="t-cursor">▮</span>`;
            term.appendChild(line);
            curCmdEl = line.querySelector('.t-cmd');
            curCursorEl = line.querySelector('.t-cursor');
            scrollTermToBottom();
            setPhase(item.phase);
          }
          if (charIdx < item.cmd.length) {
            curCmdEl.textContent += item.cmd[charIdx];
            charIdx++;
            setTimeout(next, 38 + Math.random() * 55);
          } else {
            curCursorEl?.remove();
            charIdx = 0;
            i++;
            setTimeout(next, 520);
          }
          return;
        }
      };

      // initial label
      setPhase(0);
      next();
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) start(); });
      }, { threshold: 0.25 });
      obs.observe(term);
    } else {
      start();
    }
  };

  /* =========================================================
     GSAP scroll-driven niceties (optional, gracefully skipped)
     ========================================================= */
  const initGSAP = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReduced) return;
    gsap.registerPlugin(ScrollTrigger);

    // Subtle parallax on hero orbs
    gsap.to('.hero__orb--a', {
      yPercent: 24, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__orb--b', {
      yPercent: -20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Section heads slide-in
    gsap.utils.toArray('.section__head').forEach(el => {
      gsap.from(el, {
        opacity: 0, x: -16, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  };

  /* =========================================================
     Boot
     ========================================================= */
  const initOnLoad = () => {
    initCursor();
    initNavScroll();
    initActiveNav();
    initMenu();
    initRotator();
    initReveal();
    initMagnetic();
    initSvcGlow();
    initFilter();
    initAnchors();
    initContactForm();
    initFooterTime();
    initMotion();
    initSkillsSlider();
    initGSAP();
  };

})();
