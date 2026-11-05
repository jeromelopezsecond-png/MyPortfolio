
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

const form = document.getElementById("contact-form");
const statusElement = form.querySelector(".status");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Pinipigilan nito ang pag-reload ng page

  // 1. Suriin kung kumpleto ang mga field (HTML5 Validation)
  if (!form.checkValidity()) {
    statusElement.textContent = "Please fill out all required fields correctly.";
    statusElement.style.color = "#ff4d4d"; // Pula kung may kulang
    return;
  }

  // 2. Ihanda ang data na ipapadala
  const data = new FormData(event.target);
  
  // Palitan ang text ng button habang naglo-load
  const button = form.querySelector(".btn");
  const originalButtonText = button.textContent;
  button.textContent = "Sending...";
  button.disabled = true;

  // 3. I-send ang data sa Formspree gamit ang Fetch API
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // SUCCESS: Maayos na naipadala
      statusElement.textContent = "Thanks! Your message has been sent.";
      statusElement.style.color = "#cbb279"; // Kulay ginto/berde depende sa CSS mo
      form.reset(); // Buburahin ang laman ng form inputs pagkatapos mag-send
    } else {
      // ERROR mula sa Formspree server
      const responseData = await response.json();
      if (responseData.hasOwnProperty('errors')) {
        statusElement.textContent = responseData['errors'].map(error => error['message']).join(", ");
      } else {
        statusElement.textContent = "Oops! There was a problem submitting your form.";
      }
      statusElement.style.color = "#ff4d4d";
    }
  } catch (error) {
    // NETWORK ERROR (Walang internet o block ang connection)
    statusElement.textContent = "Oops! There was a problem connecting to the server.";
    statusElement.style.color = "#ff4d4d";
  } finally {
    // Ibalik sa dati ang button matapos ang proseso
    button.textContent = originalButtonText;
    button.disabled = false;
  }
});

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
