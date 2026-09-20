/* ==========================================================
   1. DARK MODE
   ========================================================== */

(function () {

  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  if (!toggle) return;

  function updateToggle() {

    const dark =
      root.getAttribute("data-theme") === "dark";

    toggle.setAttribute(
      "aria-pressed",
      String(dark)
    );

    const text =
      toggle.querySelector("span:last-child");

    if (text) {
      text.textContent =
        dark ? "Light mode" : "Dark mode";
    }
  }

  updateToggle();

  toggle.addEventListener("click", function () {

    const current =
      root.getAttribute("data-theme");

    const next =
      current === "dark"
        ? "light"
        : "dark";

    root.setAttribute(
      "data-theme",
      next
    );

    try {
      localStorage.setItem(
        "portfolio-theme",
        next
      );
    } catch (error) {
      // Ignore storage errors
    }

    updateToggle();
  });

})();


/* ==========================================================
   2. MOBILE MENU
   ========================================================== */

(function () {

  const menuButton =
    document.getElementById("menu-toggle");

  const nav =
    document.getElementById("site-nav");

  if (!menuButton || !nav) return;


  function closeMenu() {

    nav.classList.remove("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  function toggleMenu() {

    const open =
      nav.classList.toggle("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );
  }


  menuButton.addEventListener(
    "click",
    toggleMenu
  );


  nav.querySelectorAll("a").forEach(
    function (link) {

      link.addEventListener(
        "click",
        closeMenu
      );

    }
  );


  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closeMenu();
      }

    }
  );

})();


/* ==========================================================
   3. SCROLL SPY
   ========================================================== */

(function () {

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );

  const links =
    document.querySelectorAll(
      ".site-nav a"
    );

  if (!sections.length || !links.length) {
    return;
  }


  const observer =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(
          function (entry) {

            if (!entry.isIntersecting) {
              return;
            }

            links.forEach(
              function (link) {

                link.removeAttribute(
                  "aria-current"
                );

                if (
                  link.getAttribute("href") ===
                  "#" + entry.target.id
                ) {

                  link.setAttribute(
                    "aria-current",
                    "page"
                  );

                }

              }
            );

          }
        );

      },
      {
        rootMargin:
          "-35% 0px -55% 0px"
      }
    );


  sections.forEach(
    function (section) {
      observer.observe(section);
    }
  );

})();


/* ==========================================================
   4. PROJECT FILTER
   ========================================================== */

(function () {

  const buttons =
    document.querySelectorAll(
      ".filter-btn"
    );

  const projects =
    document.querySelectorAll(
      ".project"
    );

  const status =
    document.getElementById(
      "filter-status"
    );


  if (!buttons.length || !projects.length) {
    return;
  }


  buttons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const filter =
            button.dataset.filter;


          buttons.forEach(
            function (item) {

              item.setAttribute(
                "aria-pressed",
                String(item === button)
              );

            }
          );


          let visibleCount = 0;


          projects.forEach(
            function (project) {

              const category =
                project.dataset.category;


              const show =
                filter === "all" ||
                category === filter;


              project.hidden = !show;


              if (show) {
                visibleCount++;
              }

            }
          );


          if (status) {

            status.textContent =
              visibleCount +
              " project" +
              (visibleCount === 1 ? "" : "s") +
              " displayed.";

          }

        }
      );

    }
  );

})();


/* ==========================================================
   5. CONTACT FORM
   ========================================================== */

(function () {

  const form =
    document.getElementById(
      "contact-form"
    );

  if (!form) return;


  const nameInput =
    document.getElementById("name");

  const emailInput =
    document.getElementById("email");

  const messageInput =
    document.getElementById("message");

  const nameError =
    document.getElementById("name-error");

  const emailError =
    document.getElementById("email-error");

  const messageError =
    document.getElementById("message-error");

  const messageCount =
    document.getElementById("message-count");

  const status =
    document.getElementById("form-status");


  const CONTACT_EMAIL =
    "your.email@example.com";


  /* Character counter */

  function updateCounter() {

    const length =
      messageInput.value.length;

    messageCount.textContent =
      length + " / 500";
  }


  messageInput.addEventListener(
    "input",
    updateCounter
  );


  updateCounter();


  /* Clear errors */

  function clearErrors() {

    nameError.textContent = "";

    emailError.textContent = "";

    messageError.textContent = "";

    status.textContent = "";

    nameInput.removeAttribute(
      "aria-invalid"
    );

    emailInput.removeAttribute(
      "aria-invalid"
    );

    messageInput.removeAttribute(
      "aria-invalid"
    );
  }


  /* Validate */

  function validate() {

    clearErrors();

    let valid = true;


    const name =
      nameInput.value.trim();


    const email =
      emailInput.value.trim();


    const message =
      messageInput.value.trim();


    if (name.length < 2) {

      nameError.textContent =
        "Please enter your name.";

      nameInput.setAttribute(
        "aria-invalid",
        "true"
      );

      valid = false;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

      emailError.textContent =
        "Please enter a valid email.";

      emailInput.setAttribute(
        "aria-invalid",
        "true"
      );

      valid = false;
    }


    if (message.length < 10) {

      messageError.textContent =
        "Message should contain at least 10 characters.";

      messageInput.setAttribute(
        "aria-invalid",
        "true"
      );

      valid = false;
    }


    return {
      valid,
      name,
      email,
      message
    };
  }


  /* Submit */

  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const result =
        validate();


      if (!result.valid) {

        status.textContent =
          "Please correct the highlighted fields.";

        return;
      }


      const subject =
        encodeURIComponent(
          "Portfolio message from " +
          result.name
        );


      const body =
        encodeURIComponent(
          "Name: " +
          result.name +
          "\n" +
          "Email: " +
          result.email +
          "\n\n" +
          result.message
        );


      window.location.href =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        subject +
        "&body=" +
        body;


      status.textContent =
        "Opening your email application...";
    }
  );

})();


/* ==========================================================
   6. FOOTER YEAR
   ========================================================== */

(function () {

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

})();