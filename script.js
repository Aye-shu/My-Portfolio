'use strict';

/* ==========================================================
   1. THEME TOGGLE (light / dark, remembered between visits)
   ========================================================== */
(function themeToggle() {
  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');
  if (!button) return;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {
      /* Storage can be blocked; the toggle still works for this visit */
    }
  }

  // Sync the button with the theme the <head> script already applied
  button.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));

  button.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();

/* ==========================================================
   2. MOBILE MENU
   ========================================================== */
(function mobileMenu() {
  var button = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!button || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  }

  button.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });

  // Close after choosing a section
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });
})();

/* ==========================================================
   3. SCROLL SPY (highlights the section you are reading)
   ========================================================== */
(function scrollSpy() {
  var nav = document.getElementById('site-nav');
  if (!nav || !('IntersectionObserver' in window)) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
})();

/* ==========================================================
   4. PROJECT FILTER
   ========================================================== */
(function projectFilter() {
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project');
  var status = document.getElementById('filter-status');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter');
      var visible = 0;

      buttons.forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === button));
      });

      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (status) {
        status.textContent = 'Showing ' + visible + (visible === 1 ? ' project' : ' projects');
      }
    });
  });
})();

/* ==========================================================
   5. CONTACT FORM VALIDATION
   ========================================================== */
(function contactForm() {
  var CONTACT_EMAIL = 'your.email@example.com'; // EDIT: your real email

  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var counter = document.getElementById('message-count');

  var rules = {
    name: function (value) {
      return value.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).';
    },
    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ''
        : 'Enter a valid email address, like name@example.com.';
    },
    message: function (value) {
      return value.trim().length >= 10 ? '' : 'Write at least 10 characters so I know how to help.';
    }
  };

  function check(field) {
    var input = form.elements[field];
    var error = document.getElementById(field + '-error');
    var message = rules[field](input.value);
    error.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  Object.keys(rules).forEach(function (field) {
    var input = form.elements[field];
    // Validate when leaving a field, then keep feedback live while typing
    input.addEventListener('blur', function () { check(field); });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') check(field);
    });
  });

  form.elements.message.addEventListener('input', function (event) {
    counter.textContent = event.target.value.length + ' / 500';
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.textContent = '';

    var firstInvalid = null;
    Object.keys(rules).forEach(function (field) {
      if (!check(field) && !firstInvalid) firstInvalid = form.elements[field];
    });

    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = 'Fix the highlighted fields and send again.';
      return;
    }

    var subject = 'Portfolio message from ' + form.elements.name.value.trim();
    var body = form.elements.message.value.trim() +
      '\n\nFrom: ' + form.elements.name.value.trim() +
      ' (' + form.elements.email.value.trim() + ')';

    window.location.href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    status.textContent = 'Your email app should open with the message filled in. If it does not, write to ' +
      CONTACT_EMAIL + '.';
  });
})();

/* ==========================================================
   6. FOOTER YEAR
   ========================================================== */
(function footerYear() {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();