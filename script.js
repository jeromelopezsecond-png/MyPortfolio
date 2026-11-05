
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  function initNav() {
    const nav = $('#nav');
    const bar = $('.progress');
    const burger = $('.burger');
    const menu = $('#menu');

    const onScroll = () => {
      nav.classList.toggle('solid', window.scrollY > 40);

      const max = document.documentElement.scrollHeight - window.innerHeight;

      bar.style.transform =
        'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const setMenu = (open) => {
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', () => {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });

    $$('a', menu).forEach((a) => {
      a.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setMenu(false);
      }
    });

    window.matchMedia('(min-width:901px)').addEventListener('change', () => {
      setMenu(false);
    });
  }

  function initActiveLinks() {
    const links = $$('.menu a');

    const sections = links
      .map((link) => $(link.getAttribute('href')))
      .filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          links.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        });
      },
      {
        rootMargin: '-45% 0px -50% 0px'
      }
    );

    sections.forEach((section) => io.observe(section));
  }

  function initReveal() {
    const items = $$('.reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  }


  function initForm() {
    const form = $('#contact-form');
    const status = $('.status', form);

    const EMAIL = 'jeromelopezsecond@gmail.com'; 

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const f = new FormData(form);

      const name = f.get('name').trim();
      const email = f.get('email').trim();
      const msg = f.get('message').trim();

      let ok = true;

      $$('input, textarea', form).forEach((el) => {
        const bad =
          !el.value.trim() ||
          (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));

        el.setAttribute('aria-invalid', bad);

        if (bad) {
          ok = false;
        }
      });

      if (!ok) {
        status.textContent =
          'Fill in every field with a valid email address.';

        status.style.color = '#c9776a';
        return;
      }

      const body = msg + '\n\nFrom: ' + name + ' (' + email + ')';

      window.location.href =
        'mailto:' +
        EMAIL +
        '?subject=' +
        encodeURIComponent('Portfolio message from ' + name) +
        '&body=' +
        encodeURIComponent(body);

      status.textContent =
        'Opening your email app to send the message.';

      status.style.color = 'var(--gold)';

      form.reset();
    });
  }

  function initFooter() {
    $('#year').textContent = new Date().getFullYear();

    $('.top').addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function initExternalLinks() {
    $$('a[href^="http"]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  initNav();
  initExternalLinks();
  initActiveLinks();
  initReveal();
  initForm();
  initFooter();

})();
