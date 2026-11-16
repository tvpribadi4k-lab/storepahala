(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var navbar = document.getElementById("spNavbar");

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".sp-navbar .nav-link"));
  var spySections = ["services", "about", "portfolio"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var featuredEl = document.getElementById("featured");

  function onScroll() {
    if (navbar) {
      var y = window.scrollY || document.documentElement.scrollTop;
      navbar.classList.toggle("is-solid", y > 40);
    }
    if (!navLinks.length) return;
    var current = "#home";
    if (featuredEl && featuredEl.getBoundingClientRect().top <= 120) {
      current = "#home";
    }
    spySections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 120) {
        current = "#" + sec.id;
      }
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var lenis = null;
  var gsapReady = typeof window.gsap !== "undefined";

  if (gsapReady && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof window.ScrollToPlugin !== "undefined") {
      gsap.registerPlugin(ScrollToPlugin);
    }
  }

  if (!reduceMotion && gsapReady && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true
    });

    if (typeof window.ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    } else if (gsapReady && typeof window.ScrollToPlugin !== "undefined") {
      gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1.2, ease: "power2.inOut" });
    } else {
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);

      var collapseEl = document.querySelector(".navbar-collapse.show");
      if (collapseEl && typeof window.bootstrap !== "undefined") {
        var instance = bootstrap.Collapse.getInstance(collapseEl);
        if (instance) instance.hide();
      }
    });
  });

  if (!gsapReady || reduceMotion) return;

  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".sp-navbar", { y: -40, autoAlpha: 0, duration: 0.9 })
    .from(".sp-hero .sp-line", { yPercent: 115, duration: 1.15, stagger: 0.14 }, "-=0.4")
    .from(".sp-hero-desc", { y: 28, autoAlpha: 0, duration: 0.9 }, "-=0.65")
    .from(".sp-hero-actions .sp-btn", { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, "-=0.6")
    .from(".sp-media-frame", { clipPath: "inset(0% 0% 100% 0%)", scale: 1.06, duration: 1.5, ease: "power4.out" }, 0.35)
    .from(".sp-scroll-hint", { y: 16, duration: 0.8 }, "-=0.4");

  gsap.to(".sp-scroll-hint", {
    autoAlpha: 0,
    scrollTrigger: { trigger: ".sp-hero", start: "top top", end: "35% top", scrub: true }
  });

  var mm = gsap.matchMedia();
  mm.add("(min-width: 992px)", function () {
    gsap.fromTo(".sp-hero-img", { yPercent: 0 }, {
      yPercent: 7,
      ease: "none",
      scrollTrigger: { trigger: ".sp-hero", start: "top top", end: "bottom top", scrub: true }
    });
  });

  gsap.to(".sp-hero-content", {
    yPercent: -8,
    autoAlpha: 0.35,
    ease: "none",
    scrollTrigger: { trigger: ".sp-hero", start: "50% top", end: "bottom top", scrub: true }
  });

  gsap.from(".sp-section-head > *", {
    y: 40,
    autoAlpha: 0,
    duration: 1,
    stagger: 0.15,
    scrollTrigger: { trigger: ".sp-featured", start: "top 75%" }
  });

  gsap.from(".sp-product", {
    y: 60,
    autoAlpha: 0,
    duration: 1,
    stagger: 0.12,
    scrollTrigger: { trigger: ".sp-product-grid", start: "top 82%" }
  });

  if (typeof window.ScrollTrigger !== "undefined") {
    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  }
})();
