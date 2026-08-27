(function () {
  document.documentElement.classList.add("js");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var openButton = document.getElementById("openHeartBtn");
  var main = document.getElementById("main");
  var opening = document.getElementById("opening");
  var apologyMusic = document.getElementById("apologyMusic");
  var talkButton = document.getElementById("talkButton");
  var talkResponse = document.getElementById("talkResponse");
  var readAgainButton = document.getElementById("readAgainBtn");
  var copyButton = document.getElementById("copyMessageBtn");
  var copyStatus = document.getElementById("copyStatus");
  var backToTop = document.getElementById("backToTop");

  function playApologyMusic() {
    if (apologyMusic) {
      apologyMusic.play().catch(function () {
        // Autoplay may require a direct user gesture in some browsers.
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll("a[href]")).forEach(function (link) {
    link.addEventListener("click", playApologyMusic);
  });

  function scrollToElement(element) {
    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }

  if (openButton) {
    openButton.addEventListener("click", function () {
      playApologyMusic();

      document.body.classList.add("experience-opened");
      scrollToElement(main);

      if (main && typeof main.focus === "function") {
        main.focus({ preventScroll: true });
      }

      if (opening) {
        opening.setAttribute("aria-label", "Opening apology, completed");
      }
    });
  }

  if (talkButton && talkResponse) {
    talkButton.addEventListener("click", function () {
      talkResponse.hidden = false;
      talkResponse.classList.remove("is-visible");

      window.requestAnimationFrame(function () {
        talkResponse.classList.add("is-visible");
      });
    });
  }

  if (readAgainButton) {
    readAgainButton.addEventListener("click", function () {
      scrollToElement(document.getElementById("apology"));
    });
  }

  if (copyButton && copyStatus) {
    copyButton.addEventListener("click", function () {
      // EDITABLE: Gentle copied message.
      var message = "I am sorry. I care about you, and when you are ready I would like to listen without pressure.";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).then(function () {
          copyStatus.textContent = "Copied.";
        }).catch(function () {
          copyStatus.textContent = message;
        });
      } else {
        copyStatus.textContent = message;
      }
    });
  }

  var revealTargets = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var staggerGroups = Array.prototype.slice.call(document.querySelectorAll("[data-stagger]"));
  var letter = document.querySelector("[data-letter]");

  function revealStaggeredChildren(group) {
    Array.prototype.slice.call(group.children).forEach(function (child, index) {
      window.setTimeout(function () {
        child.classList.add("is-visible");
      }, prefersReducedMotion ? 0 : index * 120);
    });
  }

  function writeLetter() {
    if (!letter || letter.dataset.written === "true") {
      return;
    }

    letter.dataset.written = "true";
    var lines = Array.prototype.slice.call(letter.querySelectorAll(".letter-body p"));
    lines.forEach(function (line, index) {
      window.setTimeout(function () {
        line.classList.add("is-written");
      }, prefersReducedMotion ? 0 : index * 260);
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        if (entry.target.hasAttribute("data-stagger")) {
          revealStaggeredChildren(entry.target);
        }

        if (entry.target.contains(letter)) {
          writeLetter();
        }

        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    revealTargets.forEach(function (target) {
      observer.observe(target);
    });

    staggerGroups.forEach(function (group) {
      observer.observe(group);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add("is-visible");
    });

    staggerGroups.forEach(revealStaggeredChildren);
    writeLetter();
  }

  Array.prototype.slice.call(document.querySelectorAll(".promise-item")).forEach(function (button) {
    button.addEventListener("click", function () {
      var pressed = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!pressed));
    });
  });

  function updateBackToTop() {
    if (!backToTop) {
      return;
    }

    if (window.scrollY > 720) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      scrollToElement(document.body);
    });

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  }

  function initParticleScene() {
    var canvas = document.getElementById("particleCanvas");

    if (!canvas || prefersReducedMotion) {
      return;
    }

    var context = canvas.getContext("2d");
    var particles = [];
    var width = 0;
    var height = 0;
    var dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.min(72, Math.max(28, Math.floor(width / 18)));
      particles = Array.from({ length: count }, function (_, index) {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.6 + Math.random() * 1.8,
          speed: 0.12 + Math.random() * 0.38,
          drift: -0.18 + Math.random() * 0.36,
          alpha: 0.12 + Math.random() * 0.26,
          phase: index * 0.27
        };
      });
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      particles.forEach(function (particle) {
        var shimmer = Math.sin((time * 0.001) + particle.phase) * 0.06;
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -12) {
          particle.y = height + 12;
          particle.x = Math.random() * width;
        }

        if (particle.x < -12) {
          particle.x = width + 12;
        }

        if (particle.x > width + 12) {
          particle.x = -12;
        }

        context.beginPath();
        context.fillStyle = "rgba(215, 189, 139, " + Math.max(0.04, particle.alpha + shimmer) + ")";
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalCompositeOperation = "source-over";
      window.requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(draw);
  }

  initParticleScene();

  // Initialize 3D tilt interactions for elements marked with `data-tilt-3d`
  function initTilt3d() {
    if (prefersReducedMotion) return;

    document.querySelectorAll("[data-tilt-3d]").forEach(function (element) {
      element.addEventListener("pointermove", function (event) {
        var rect = element.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;

        element.style.setProperty("--tilt-x", ((0.5 - y) * 7).toFixed(2) + "deg");
        element.style.setProperty("--tilt-y", ((x - 0.5) * 8).toFixed(2) + "deg");
      });

      element.addEventListener("pointerleave", function () {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  initTilt3d();

  // Fade the page when the user reaches the end using an IntersectionObserver sentinel
  if (!prefersReducedMotion) {
    var sentinel = document.createElement('div');
    sentinel.id = 'page-end-sentinel';
    sentinel.style.position = 'absolute';
    sentinel.style.left = '0';
    sentinel.style.right = '0';
    sentinel.style.height = '1px';
    sentinel.style.pointerEvents = 'none';
    // place it just after the main content so it appears when scrolled past
    document.body.appendChild(sentinel);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add class when sentinel enters viewport (near bottom)
          document.body.classList.add('page-fade');
        } else {
          document.body.classList.remove('page-fade');
        }
      });
    }, {
      root: null,
      threshold: 0.01,
      rootMargin: '0px 0px -8% 0px'
    });

    observer.observe(sentinel);
  }

  // Fade the final section based on scroll position
  if (!prefersReducedMotion) {
    var finalSection = document.getElementById("final");

    function fadeFinalOnScroll() {
      if (!finalSection) {
        return;
      }

      var rect = finalSection.getBoundingClientRect();
      var windowHeight = window.innerHeight;

      // Starts fading once the final section is near the bottom of the viewport.
      var fadeStart = windowHeight * 0.25;
      var fadeEnd = -windowHeight * 0.25;

      var progress = (rect.top - fadeEnd) / (fadeStart - fadeEnd);
      var opacity = Math.max(0, Math.min(1, progress));

      finalSection.style.opacity = opacity;
    }

    window.addEventListener("scroll", fadeFinalOnScroll, { passive: true });
    window.addEventListener("resize", fadeFinalOnScroll);
    fadeFinalOnScroll();
  }

  // Floating hearts and texts (lightweight, GPU-driven)
  if (!prefersReducedMotion) {
    var floatingScene = document.getElementById('floatingScene');
    if (floatingScene) {
      var phrases = ["You mean a lot to me", "I am sorry", "I love you"];

      function spawnText(xPct, text, z, dur) {
        var t = document.createElement('div');
        t.className = 'float-item floating-text';
        t.textContent = text;
        t.style.left = xPct + '%';
        t.style.bottom = '-12px';
        t.style.setProperty('--z', z + 'px');
        t.style.setProperty('--dur', dur + 'ms');
        floatingScene.appendChild(t);
        requestAnimationFrame(function () { t.classList.add('animate'); });
        setTimeout(function () { t.remove(); }, dur + 200);
      }

      /* hearts removed — keeping floating text only */

      // periodic floating text
      var textIdx = 0;
      var textInterval = setInterval(function () {
        spawnText(20 + (Math.random() * 60), phrases[textIdx % phrases.length], 8 + Math.random() * 30, 6800 + Math.random() * 1600);
        textIdx++;
        // stop after a while to avoid buildup
        if (textIdx > 12) clearInterval(textInterval);
      }, 2400);

      // subtle parallax on pointer move
      var sceneCard = floatingScene;
      window.addEventListener('mousemove', function (e) {
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        var dx = (e.clientX - cx) / cx;
        var dy = (e.clientY - cy) / cy;
        // small rotate to give 3D feeling
        sceneCard.style.transform = 'rotateX(' + (dy * 6) + 'deg) rotateY(' + (dx * 6) + 'deg)';
      }, { passive: true });
    }
  }
})();
