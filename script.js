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


/* =========================================
   CONTACT FORM - FORMSPREE
========================================= */

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");

    const characterCount = document.getElementById("character-count");

    const submitButton = document.getElementById("contact-submit");
    const submitText = document.getElementById("submit-text");
    const submitArrow = document.getElementById("submit-arrow");

    const formStatus = document.getElementById("form-status");


    /* =========================================
       CHARACTER COUNTER
    ========================================= */

    messageInput.addEventListener("input", function () {

        characterCount.textContent = messageInput.value.length;

    });


    /* =========================================
       CLEAR ERROR WHEN USER TYPES
    ========================================= */

    nameInput.addEventListener("input", function () {
        nameError.textContent = "";
    });

    emailInput.addEventListener("input", function () {
        emailError.textContent = "";
    });

    messageInput.addEventListener("input", function () {
        messageError.textContent = "";
    });


    /* =========================================
       FORM SUBMISSION
    ========================================= */

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        /* Clear previous messages */

        nameError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";

        formStatus.className = "form-status";
        formStatus.textContent = "";


        /* Get values */

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();


        /* =========================================
           BASIC VALIDATION
        ========================================= */

        let isValid = true;


        /* Name validation */

        if (name === "") {

            nameError.textContent = "Please enter your name.";

            isValid = false;
        }


        /* Email validation */

        if (email === "") {

            emailError.textContent = "Please enter your email.";

            isValid = false;

        } else if (!isValidEmail(email)) {

            emailError.textContent = "Please enter a valid email address.";

            isValid = false;
        }


        /* Message validation */

        if (message === "") {

            messageError.textContent = "Please enter your message.";

            isValid = false;

        } else if (message.length < 10) {

            messageError.textContent =
                "Please write at least 10 characters.";

            isValid = false;
        }


        /* Stop if validation failed */

        if (!isValid) {
            return;
        }


        /* =========================================
           SHOW SENDING STATE
        ========================================= */

        submitButton.disabled = true;

        submitText.textContent = "Sending...";
        submitArrow.textContent = "•";


        try {

            /* =====================================
               FORMSPREE REQUEST

               IMPORTANT:
               Replace YOUR_FORM_ID with
               your actual Formspree form ID.
            ===================================== */

            const response = await fetch(
                "https://formspree.io/f/xqpabvqd",
                {
                    method: "POST",

                    body: new FormData(contactForm),

                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


            /* =====================================
               SUCCESS
            ===================================== */

            if (response.ok) {

                formStatus.className =
                    "form-status success";

                formStatus.textContent =
                    "✓ Thank you! Your message has been sent successfully.";


                /* Clear form */

                contactForm.reset();

                characterCount.textContent = "0";


            } else {

                /* =================================
                   FORMSPREE ERROR
                ================================= */

                let data = {};

                try {
                    data = await response.json();
                } catch (error) {
                    data = {};
                }


                if (data.errors) {

                    formStatus.textContent =
                        data.errors
                            .map(error => error.message)
                            .join(", ");

                } else {

                    formStatus.textContent =
                        "Sorry, your message could not be sent. Please try again.";

                }


                formStatus.className =
                    "form-status error";
            }


        } catch (error) {

            /* =====================================
               NETWORK ERROR
            ===================================== */

            formStatus.className =
                "form-status error";

            formStatus.textContent =
                "Network error. Please check your internet connection and try again.";

        }


        /* =========================================
           RESTORE BUTTON
        ========================================= */

        submitButton.disabled = false;

        submitText.textContent = "Send message";
        submitArrow.textContent = "↗";

    });


    /* =========================================
       EMAIL VALIDATION FUNCTION
    ========================================= */

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);

    }

}
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