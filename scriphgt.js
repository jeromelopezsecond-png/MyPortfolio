/* Jerome Lopez portfolio: vanilla JS */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- Navigation: solid bar, progress, mobile menu ---- */
  function initNav() {
    const nav = $('#nav'), bar = $('.progress'), burger = $('.burger'), menu = $('#menu');

    const onScroll = () => {
      nav.classList.toggle('solid', window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const setMenu = (open) => {
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width:901px)').addEventListener('change', () => setMenu(false));
  }

  /* ---- Active link while scrolling ---- */
  function initActiveLinks() {
    const links = $$('.menu a');
    const sections = links.map((l) => $(l.getAttribute('href'))).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* ---- Reveal on scroll ---- */
  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('in')); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
  }

  /* ---- Contact form: validates, then opens the visitor's email app ---- */
  function initForm() {
    const form = $('#contact-form'), status = $('.status', form);
    const EMAIL = 'jeromelopezsecond@gmail.com'; // change to your address
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const name = f.get('name').trim(), email = f.get('email').trim(), msg = f.get('message').trim();
      let ok = true;
      $$('input,textarea', form).forEach((el) => {
        const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
        el.setAttribute('aria-invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) { status.textContent = 'Fill in every field with a valid email address.'; status.style.color = '#c9776a'; return; }
      const body = msg + '\n\nFrom: ' + name + ' (' + email + ')';
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Portfolio message from ' + name) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Opening your email app to send the message.';
      status.style.color = 'var(--gold)';
      form.reset();
    });
  }

  /* ---- Footer: year and back to top ---- */
  function initFooter() {
    $('#year').textContent = new Date().getFullYear();
    $('.top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Real social links open in a new tab ---- */
  function initExternalLinks() {
    $$('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  }

  initNav();
  initExternalLinks();
  initActiveLinks();
  initReveal();
  initForm();
  initFooter();
})();
