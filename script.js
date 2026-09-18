(function() {
    "use strict";

    // =============================================
    // 1. SPINNER
    // =============================================
    window.addEventListener('load', function() {
        var spinner = document.getElementById('spinner');
        if (spinner) spinner.classList.add('hidden');
    });

    // =============================================
    // 2. NAVBAR SCROLL EFFECT
    // =============================================
    var navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            navbar.style.display = 'flex';
        } else {
            navbar.style.display = 'none';
        }
    });

    // =============================================
    // 3. MOBILE TOGGLE
    // =============================================
    var toggler = document.getElementById('navbarToggler');
    var collapse = document.getElementById('navbarCollapse');
    toggler.addEventListener('click', function() {
        collapse.classList.toggle('active');
    });

    // =============================================
    // 4. SMOOTH SCROLL & ACTIVE LINK
    // =============================================
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.section, .hero-section, #home');

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu
                collapse.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        var current = '';
        sections.forEach(function(section) {
            var top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // =============================================
    // 5. TYPED TEXT EFFECT
    // =============================================
    var typedOutput = document.querySelector('.typed-text-output');
    var typedHidden = document.querySelector('.typed-text-hidden');
    if (typedOutput && typedHidden) {
        var strings = typedHidden.textContent.split(', ');
        var stringIndex = 0;
        var charIndex = 0;
        var isDeleting = false;

        function typeEffect() {
            var currentString = strings[stringIndex];
            if (!isDeleting) {
                typedOutput.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentString.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, 2000);
                    return;
                }
                setTimeout(typeEffect, 100);
            } else {
                typedOutput.textContent = currentString.substring(0, charIndex);
                charIndex--;
                if (charIndex < 0) {
                    isDeleting = false;
                    stringIndex = (stringIndex + 1) % strings.length;
                    setTimeout(typeEffect, 500);
                    return;
                }
                setTimeout(typeEffect, 50);
            }
        }
        typeEffect();
    }

    // =============================================
    // 6. VIDEO MODAL
    // =============================================
    var playBtn = document.getElementById('videoPlayBtn');
    var modal = document.getElementById('videoModal');
    var iframe = document.getElementById('videoIframe');
    var closeModal = document.getElementById('closeVideoModal');

    if (playBtn && modal) {
        playBtn.addEventListener('click', function() {
            var src = this.getAttribute('data-src');
            iframe.src = src + '?autoplay=1&modestbranding=1&showinfo=0';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeVideo() {
        modal.classList.remove('active');
        iframe.src = '';
        document.body.style.overflow = '';
    }
    if (closeModal) closeModal.addEventListener('click', closeVideo);
    window.addEventListener('click', function(e) {
        if (e.target === modal) closeVideo();
    });

    // =============================================
    // 7. COUNTER UP (Intersection Observer)
    // =============================================
    var counters = document.querySelectorAll('.counter');
    var countersStarted = false;

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                counters.forEach(function(counter) {
                    var target = parseInt(counter.getAttribute('data-target'));
                    var current = 0;
                    var increment = Math.ceil(target / 100);
                    function updateCounter() {
                        if (current < target) {
                            current += increment;
                            if (current > target) current = target;
                            counter.textContent = current;
                            setTimeout(updateCounter, 20);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.3 });

    var statsRow = document.querySelector('.stats-row');
    if (statsRow) counterObserver.observe(statsRow);

    // =============================================
    // 8. SKILLS PROGRESS BAR
    // =============================================
    var skillBars = document.querySelectorAll('.progress-bar');
    var skillsStarted = false;

    var skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !skillsStarted) {
                skillsStarted = true;
                skillBars.forEach(function(bar) {
                    var width = bar.getAttribute('data-width');
                    setTimeout(function() {
                        bar.style.width = width + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.3 });

    var skillsWrapper = document.querySelector('.skills-wrapper');
    if (skillsWrapper) skillsObserver.observe(skillsWrapper);

    // =============================================
    // 9. EXPERIENCE / EDUCATION TABS
    // =============================================
    var tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            var tabId = this.getAttribute('data-tab');
            var panes = document.querySelectorAll('.tab-pane');
            panes.forEach(function(pane) { pane.classList.remove('active'); });
            var activePane = document.getElementById(tabId);
            if (activePane) activePane.classList.add('active');
        });
    });

    // =============================================
    // 10. PORTFOLIO FILTER
    // =============================================
    var filterItems = document.querySelectorAll('.filter-list li');
    var projectItems = document.querySelectorAll('.project-item');

    filterItems.forEach(function(item) {
        item.addEventListener('click', function() {
            filterItems.forEach(function(f) { f.classList.remove('active'); });
            this.classList.add('active');
            var filter = this.getAttribute('data-filter');
            projectItems.forEach(function(proj) {
                var category = proj.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    proj.style.display = 'block';
                } else {
                    proj.style.display = 'none';
                }
            });
        });
    });

    // =============================================
    // 11. TESTIMONIAL SLIDER
    // =============================================
    var testimonialItems = document.querySelectorAll('.testimonial-item');
    var dots = document.querySelectorAll('.dot');
    var currentSlide = 0;

    function showSlide(index) {
        testimonialItems.forEach(function(item) { item.classList.remove('active'); });
        dots.forEach(function(dot) { dot.classList.remove('active'); });
        testimonialItems[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            currentSlide = parseInt(this.getAttribute('data-index'));
            showSlide(currentSlide);
        });
    });

    // Auto-play
    setInterval(function() {
        currentSlide = (currentSlide + 1) % testimonialItems.length;
        showSlide(currentSlide);
    }, 5000);

    // =============================================
    // 12. CONTACT FORM VALIDATION
    // =============================================
    var contactForm = document.getElementById('contactForm');
    var feedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('cname').value.trim();
            var email = document.getElementById('cemail').value.trim();
            var message = document.getElementById('cmessage').value.trim();

            if (!name || !email || !message) {
                feedback.style.display = 'block';
                feedback.style.color = 'red';
                feedback.textContent = '⚠️ Please fill in all required fields.';
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                feedback.style.display = 'block';
                feedback.style.color = 'red';
                feedback.textContent = '⚠️ Please enter a valid email.';
                return;
            }

            feedback.style.display = 'block';
            feedback.style.color = 'green';
            feedback.textContent = '✅ Message sent successfully!';
            contactForm.reset();
            setTimeout(function() { feedback.style.display = 'none'; }, 5000);
        });
    }

    // =============================================
    // 13. BACK TO TOP
    // =============================================
    var backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backBtn.style.display = 'flex';
        } else {
            backBtn.style.display = 'none';
        }
    });
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

})();