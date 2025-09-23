document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const App = {
    // ✨ ۱. شمارنده مودال‌های فعال را اضافه می‌کنیم
    activeModalCount: 0,

    // ✨ ۲. یک تابع متمرکز برای قفل کردن اسکرول می‌سازیم
    lockScroll: function () {
      if (this.activeModalCount === 0) {
        // فقط بار اول که یک مودال باز می‌شود، کلاس را اضافه کن
        document.documentElement.classList.add("is-modal-active");
        document.body.classList.add("is-modal-active");
      }
      this.activeModalCount++;
    },

    // ✨ ۳. یک تابع متمرکز برای باز کردن قفل اسکرول می‌سازیم
    unlockScroll: function () {
      this.activeModalCount--;
      if (this.activeModalCount <= 0) {
        // فقط وقتی آخرین مودال بسته شد، کلاس را حذف کن
        document.documentElement.classList.remove("is-modal-active");
        document.body.classList.remove("is-modal-active");
        this.activeModalCount = 0; // برای جلوگیری از اعداد منفی، ریست می‌کنیم
      }
    },

    init: function () {
      this.setupPreloader();
    },

    setupPreloader: function () {
      const preloaderContainer = document.getElementById("lottie-preloader");
      if (!preloaderContainer) return;
      const lottieAnimation = lottie.loadAnimation({
        container: preloaderContainer,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "lottie/data.json",
      });
      lottieAnimation.addEventListener("complete", () => {
        const mainContent = document.getElementById("main-content");
        preloaderContainer.classList.add("loaded");
        mainContent.style.display = "block";
        this.initMainFeatures();
      });
    },
    initMainFeatures: function () {
      this.startContentAnimation();
      this.initParallax();
      this.initScrollAnimations();
      this.initScrollProgressBar(); // <-- این تابع به نسخه اصلی شما بازگشت
      this.initVanillaTilt();
      this.initParticleClickEffect();
      this.initEmailClipboard();
      this.initHueShiftEffect();
      this.initScrollParallax();
      this.initPortfolioPanel();
      this.initHoverToPlay();
      this.initCustomPlayer();
      this.initLanguageSwitcher();
    },

    // -------------------------------------------------------
    // --------- تعریف توابع مربوط به انیمیشن و قابلیت‌ها ---------
    // -------------------------------------------------------

    startContentAnimation: function () {
      const tl = gsap.timeline();
      tl.from("#hero-title-svg", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      tl.from(
        "#hero-subtitle-svg",
        { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );
      tl.from(
        ".scroll-arrow",
        { y: 30, opacity: 0, duration: 1, ease: "power3.out" },
        "-=0.5"
      );
    },

    initParallax: function () {
      gsap.matchMedia().add("(min-width: 1025px)", () => {
        const hero = document.querySelector(".hero");
        const heroContent = document.querySelector(".hero-content");

        if (hero && heroContent) {
          const moveFactor = 50;

          const mouseMoveHandler = (e) => {
            const xPercent = e.clientX / window.innerWidth;
            const yPercent = e.clientY / window.innerHeight;

            let moveX = (xPercent - 0.5) * moveFactor;
            const moveY = (yPercent - 0.5) * moveFactor;

            moveX = gsap.utils.clamp(-25, 0)(moveX);

            gsap.to(heroContent, {
              x: moveX,
              y: moveY,
              duration: 0.8,
              ease: "power3.out",
            });
          };

          hero.addEventListener("mousemove", mouseMoveHandler);

          return () => {
            hero.removeEventListener("mousemove", mouseMoveHandler);
            gsap.to(heroContent, { x: 0, y: 0, duration: 0.5 });
          };
        }
      });
    },

    initScrollAnimations: function () {
      this.setupScrollAnimations("rtl"); // اجرای اولیه انیمیشن‌ها با جهت پیش‌فرض (فارسی)
    },

    /**
     * تابع نوار پیشرفت اسکرول به نسخه اصلی و بدون باگ شما بازگردانده شد
     */
    initScrollProgressBar: function () {
      const progressBar = document.getElementById("scroll-progress-bar");
      if (!progressBar) return;

      window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const scrollableHeight = scrollHeight - clientHeight;
        // مقدار اسکرول را به صورت یک عدد بین ۰ تا ۱ محاسبه می‌کنیم
        const scrollValue = scrollTop / scrollableHeight;

        // مقیاس افقی (scaleX) را برای پر شدن از مرکز تغییر می‌دهیم
        progressBar.style.transform = `scaleX(${scrollValue})`;
      });
    },

    initVanillaTilt: function () {
      const tiltElement = document.querySelector(".about-image-wrapper");
      if (!tiltElement) return;

      VanillaTilt.init(tiltElement, {
        max: 8,
        speed: 400,
        scale: 1.02,
        glare: true,
        "max-glare": 0.3,
      });
    },

    initParticleClickEffect: function () {
      const clickArea = document.querySelector(".particle-click-area");
      if (!clickArea) return;

      clickArea.addEventListener("click", (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;

        for (let i = 0; i < 40; i++) {
          const particle = document.createElement("div");
          particle.classList.add("particle");
          document.body.appendChild(particle);

          const size = gsap.utils.random(3, 12);
          const destX = gsap.utils.random(-150, 150);
          const destY = gsap.utils.random(-150, 150);
          const duration = gsap.utils.random(0.6, 1.5);

          gsap.set(particle, {
            width: size,
            height: size,
            top: clickY + window.scrollY,
            left: clickX,
            xPercent: -50,
            yPercent: -50,
            opacity: 1,
          });

          gsap.to(particle, {
            x: `+=${destX}`,
            y: `+=${destY}`,
            opacity: 0,
            scale: 0,
            duration: duration,
            ease: "power3.out",
            onComplete: () => {
              particle.remove();
            },
          });
        }
      });
    },

    initEmailClipboard: function () {
      const emailLink = document.querySelector(".footer-email");
      if (!emailLink) return;

      emailLink.addEventListener("click", function (event) {
        event.preventDefault();
        const emailAddress = "hamidrezasadeghi.pr@gmail.com";

        navigator.clipboard
          .writeText(emailAddress)
          .then(() => {
            const existingTooltip = document.querySelector(".copy-tooltip");
            if (existingTooltip) {
              existingTooltip.remove();
            }

            const tooltip = document.createElement("div");
            tooltip.className = "copy-tooltip";
            tooltip.textContent = "کپی شد!";
            document.body.appendChild(tooltip);

            const rect = emailLink.getBoundingClientRect();
            gsap.set(tooltip, {
              top: rect.top - tooltip.offsetHeight - 10,
              left: rect.left + rect.width / 2 - tooltip.offsetWidth / 2,
            });

            gsap.to(tooltip, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "power3.out",
            });
            gsap.to(tooltip, {
              opacity: 0,
              y: -10,
              duration: 0.3,
              ease: "power3.in",
              delay: 1.5,
              onComplete: () => {
                tooltip.remove();
              },
            });
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      });
    },

    initHueShiftEffect: function () {
      const video = document.getElementById("hue-shifting-video");
      if (!video) return;

      let currentHue = 0;
      video.addEventListener("ended", () => {
        currentHue = (currentHue + 60) % 360;
        video.style.filter = `hue-rotate(${currentHue}deg)`;
        video.play();
      });
    },

    initScrollParallax: function () {
      gsap.utils.toArray(".project-section").forEach((section) => {
        const mediaWrapper = section.querySelector(".project-media-wrapper");
        if (!mediaWrapper) return;

        gsap.to(mediaWrapper, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    },

    initPortfolioPanel: function () {
      const overlay = document.getElementById("portfolio-panel-overlay");
      const openBtn = document.getElementById("open-portfolio-panel");
      const closeBtn = document.getElementById("close-portfolio-panel");
      if (!overlay || !openBtn || !closeBtn) return;

      const openPanel = (e) => {
        e.preventDefault();
        overlay.classList.add("is-open");
        // ✨ از تابع متمرکز جدید استفاده می‌کنیم
        this.lockScroll();
      };
      const closePanel = () => {
        overlay.classList.remove("is-open");
        // ✨ از تابع متمرکز جدید استفاده می‌کنیم
        this.unlockScroll();
      };

      openBtn.addEventListener("click", openPanel);
      closeBtn.addEventListener("click", closePanel);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closePanel();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("is-open"))
          closePanel();
      });
    },

    initHoverToPlay: function () {
      const portfolioItems = document.querySelectorAll(".portfolio-item");

      portfolioItems.forEach((item) => {
        // وقتی ماوس وارد آیتم می‌شود
        item.addEventListener("mouseenter", () => {
          if (item.querySelector("video")) return; // جلوگیری از اجرای دوباره

          const videoSrc = item.dataset.videoSrc;
          if (!videoSrc) return;

          const videoPreview = document.createElement("video");
          videoPreview.src = videoSrc;
          videoPreview.autoplay = true;
          videoPreview.muted = true;
          videoPreview.loop = true;
          videoPreview.playsInline = true;
          videoPreview.className = "portfolio-video-preview";

          // ۱. منتظر می‌مانیم تا ویدیو آماده پخش شود
          videoPreview.addEventListener("canplay", function onCanPlay() {
            // ۲. ویدیو را به صفحه اضافه می‌کنیم (هنوز نامرئی است)
            item.appendChild(videoPreview);

            // ۳. با یک تاخیر بسیار کوتاه، کلاس را اضافه می‌کنیم تا انیمیشن fade-in اجرا شود
            setTimeout(() => {
              videoPreview.classList.add("is-playing");
            }, 10); // این تاخیر کوتاه برای اجرای صحیح انیمیشن ضروری است

            videoPreview.removeEventListener("canplay", onCanPlay);
          });
        });

        // وقتی ماوس از آیتم خارج می‌شود
        item.addEventListener("mouseleave", () => {
          const video = item.querySelector(".portfolio-video-preview");
          if (video) {
            // ۱. کلاس را حذف می‌کنیم تا انیمیشن fade-out اجرا شود
            video.classList.remove("is-playing");

            // ۲. منتظر می‌مانیم تا انیمیشن تمام شود
            video.addEventListener(
              "transitionend",
              () => {
                // ۳. بعد از اتمام انیمیشن، ویدیو را به طور کامل حذف می‌کنیم
                if (video.parentNode) {
                  video.remove();
                }
              },
              { once: true }
            ); // {once: true} باعث می‌شود این listener فقط یک بار اجرا شود
          }
        });
      });
    },

    initCustomPlayer: function () {
      const modal = document.getElementById("video-modal");
      const modalContent = document.querySelector(".video-modal-content");
      const closeBtn = document.getElementById("video-modal-close");
      const videoPlayerElement = document.getElementById("portfolio-player");
      const portfolioGrid = document.querySelector(".portfolio-grid");

      if (!modal || !modalContent || !videoPlayerElement || !portfolioGrid) {
        console.error("One or more player elements are missing from the DOM.");
        return;
      }

      const player = new Plyr(videoPlayerElement, {
        // ✨ شروع تغییرات: لیست دکمه‌های دلخواه را اینجا تعریف می‌کنیم
        controls: [
          "play-large", // دکمه بزرگ پخش در وسط
          "play", // دکمه کوچک پخش/توقف در نوار کنترل
          "progress", // نوار پیشرفت ویدیو
          "current-time", // زمان فعلی ویدیو
          "mute", // دکمه بی‌صدا کردن
          "volume", // نوار کنترل ولوم
          "captions", // دکمه زیرنویس
          "settings", // منوی تنظیمات (سرعت و کیفیت)
          "fullscreen", // دکمه تمام‌صفحه
          // دکمه 'pip' از این لیست حذف شده است
        ],
        // ✨ پایان تغییرات

        i18n: {
          play: "پخش",
          pause: "توقف",
          fullscreen: "تمام صفحه",
          settings: "تنظیمات",
          pip: "تصویر در تصویر",
          mute: "بی‌صدا",
          unmute: "باصدا",
        },
      });

      player.on("loadedmetadata", () => {
        const video = player.elements.video;
        if (video && video.videoWidth > 0) {
          if (video.videoHeight > video.videoWidth) {
            modalContent.classList.add("is-vertical");
          } else {
            modalContent.classList.remove("is-vertical");
          }
        }
      });

      const openModal = (videoSrc) => {
        this.lockScroll();
        player.source = {
          type: "video",
          title: "نمونه کار",
          sources: [{ src: videoSrc, type: "video/mp4" }],
        };
        modal.classList.add("is-visible");
        player.play();
      };

      const closeModal = () => {
        this.unlockScroll();
        player.stop();
        modal.classList.remove("is-visible");
        modalContent.classList.remove("is-vertical");
      };

      portfolioGrid.addEventListener("click", (event) => {
        const portfolioItem = event.target.closest(".portfolio-item");
        if (portfolioItem && portfolioItem.dataset.videoSrc) {
          event.preventDefault();
          openModal(portfolioItem.dataset.videoSrc);
        }
      });

      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-visible")) {
          closeModal();
        }
      });
    },
    // در فایل script.js، این تابع جدید را به آبجکت App اضافه کنید

    // این تابع را با نسخه قبلی جایگزین کنید
    initLanguageSwitcher: function () {
      const switcherButtons = document.querySelectorAll(
        ".language-switcher button"
      );

      const switchLanguage = (lang) => {
        const oldDirection = document.documentElement.dir;
        const newDirection = lang === "fa" ? "rtl" : "ltr";

        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", newDirection);

        const elements = document.querySelectorAll("[data-translate-key]");
        elements.forEach((element) => {
          const key = element.dataset.translateKey;
          const translation = translations[lang][key];
          if (translation) {
            element.innerHTML = translation;
          }
        });

        localStorage.setItem("preferred_language", lang);

        switcherButtons.forEach((button) => {
          button.classList.toggle("active", button.dataset.lang === lang);
        });

        // اگر جهت صفحه تغییر کرده بود، انیمیشن‌ها را بازسازی کن
        if (oldDirection !== newDirection) {
          ScrollTrigger.getAll().forEach((t) => t.kill());
          this.setupScrollAnimations(newDirection);
          // رفرش کردن ScrollTrigger ضروری نیست چون kill کردن و ساختن دوباره، آن را بازسازی می‌کند
        }
      };

      switcherButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const selectedLang = event.target.dataset.lang;
          switchLanguage(selectedLang);
        });
      });

      const savedLang = localStorage.getItem("preferred_language") || "fa";
      if (savedLang !== "fa") {
        switchLanguage(savedLang);
      }
    },

    // این تابع جدید را به آبجکت App اضافه کنید
    setupScrollAnimations: function (direction) {
      const isRTL = direction === "rtl";

      gsap.utils.toArray(".project-section").forEach((section) => {
        const media = section.querySelector(".project-media-wrapper");
        const description = section.querySelector(
          ".project-description-wrapper"
        );

        // از بین بردن انیمیشن‌های قبلی روی این عناصر برای جلوگیری از تداخل
        gsap.killTweensOf([media, description]);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        const isReversed = section.classList.contains("layout-reverse");

        // انیمیشن ستون مدیا بر اساس جهت
        let mediaFromX = isReversed ? (isRTL ? -100 : 100) : isRTL ? 100 : -100;
        tl.from(media, {
          xPercent: mediaFromX,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        // انیمیشن ستون متن بر اساس جهت
        let descFromX = isReversed ? (isRTL ? 100 : -100) : isRTL ? -100 : 100;
        tl.from(
          description,
          {
            xPercent: descFromX,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        );
      });
    },
  };

  // =======================================================
  // ========= ۳. اجرای برنامه =========
  // =======================================================
  App.init();
});
