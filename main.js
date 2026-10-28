/* ==========================================================
   PRIME BYTE ENTERPRISE — SHARED SITE SCRIPT
   Handles: nav scroll/mobile state, scroll-reveal animations,
   animated count-up metrics, FAQ accordions, form submission.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Sticky nav background on scroll ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) {
        nav.classList.add("scrolled");
      } else if (!document.querySelector(".mobile-menu.open")) {
        nav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  /* ---------- Mobile menu toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
      nav.classList.toggle("scrolled", mobileMenu.classList.contains("open") || window.scrollY > 12);
      navToggle.innerHTML = mobileMenu.classList.contains("open") ? ICONS.x : ICONS.menu;
    });
  }

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated count-up metrics ----------
     Usage: <span class="metric-value" data-count-to="40" data-suffix="%">0%</span>
     Counts up once, the moment its containing .metric-group scrolls into view. */
  var metricGroups = document.querySelectorAll("[data-metric-group]");
  if ("IntersectionObserver" in window && metricGroups.length) {
    var metricObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateGroup(entry.target);
            metricObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    metricGroups.forEach(function (el) { metricObserver.observe(el); });
  } else {
    metricGroups.forEach(animateGroup);
  }

  function animateGroup(group) {
    var metrics = group.querySelectorAll("[data-count-to]");
    metrics.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var suffix = el.getAttribute("data-suffix") || "";
      var prefix = el.getAttribute("data-prefix") || "";
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var duration = 1400;
      var start = performance.now();

      function ease(t) { return 1 - Math.pow(1 - t, 3); }

      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var value = target * ease(progress);
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item, i) {
    var question = item.querySelector(".faq-question");
    if (!question) return;
    if (i === 0) item.classList.add("open");
    question.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      faqItems.forEach(function (other) { other.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- Contact / lead forms ---------- */
  var forms = document.querySelectorAll("[data-lead-form]");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var successEl = document.querySelector(form.getAttribute("data-success-target"));
      if (successEl) {
        form.style.display = "none";
        successEl.style.display = "block";
      }
      // NOTE: wire this up to your actual backend/CRM endpoint.
      // e.g. fetch('/api/lead', { method: 'POST', body: new FormData(form) })
    });
  });
});

var ICONS = {
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>',
  x: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
};
