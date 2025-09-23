document.addEventListener("DOMContentLoaded", function () {
  // =======================================================
  // ========= ۱. ثبت پلاگین‌های GSAP (یک بار در ابتدا) =========
  // =======================================================
  gsap.registerPlugin(ScrollTrigger);

  // =======================================================
  // ========= ۲. تعریف ماژول اصلی برنامه (App) =========
  // =======================================================
  const App = {
    /**
     * نقطه شروع اجرای کل اسکریپت
     */
    init: function () {
      this.setupPreloader();
    },

    /**
     * تنظیم و اجرای انیمیشن ورودی Lottie
     */
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

        // پس از اتمام پریلودر، تمام قابلیت‌های اصلی سایت را اجرا می‌کنیم
        this.initMainFeatures();
      });
    },

    /**
     * این تابع تمام قابلیت‌ها و انیمیشن‌های اصلی صفحه را فراخوانی می‌کند
     */
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
      gsap.utils.toArray(".project-section").forEach((section) => {
        const media = section.querySelector(".project-media-wrapper");
        const description = section.querySelector(
          ".project-description-wrapper"
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        const isReversed = section.querySelector(".layout-reverse");

        if (isReversed) {
          tl.from(media, {
            xPercent: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          }).from(
            description,
            { xPercent: -100, opacity: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          );
        } else {
          tl.from(media, {
            xPercent: -100,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          }).from(
            description,
            { xPercent: 100, opacity: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          );
        }
      });
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
      };

      const closePanel = () => {
        overlay.classList.remove("is-open");
      };

      openBtn.addEventListener("click", openPanel);
      closeBtn.addEventListener("click", closePanel);

      // جدید: بستن با کلیک روی خود overlay
      overlay.addEventListener("click", (e) => {
        // فقط زمانی که روی خود پس‌زمینه کلیک شد، بسته شود
        if (e.target === overlay) {
          closePanel();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("is-open")) {
          closePanel();
        }
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

    // در فایل script.js، این تابع را به طور کامل جایگزین کنید

    initCustomPlayer: function () {
      const modal = document.getElementById("video-modal");
      const modalContent = document.querySelector(".video-modal-content");
      const closeBtn = document.getElementById("video-modal-close");
      const videoPlayerElement = document.getElementById("portfolio-player");
      const portfolioGrid = document.querySelector(".portfolio-grid");

      if (!modal || !modalContent || !videoPlayerElement || !portfolioGrid) {
        return;
      }

      const player = new Plyr(videoPlayerElement, {
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

      // ✨ منطق ساده‌شده: فقط یک کلاس را بر اساس ابعاد ویدیو اضافه/حذف می‌کنیم
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
        document.body.classList.add("is-modal-open");
        player.source = {
          type: "video",
          title: "نمونه کار",
          sources: [{ src: videoSrc, type: "video/mp4" }],
        };
        modal.classList.add("is-visible");
        player.play();
      };

      const closeModal = () => {
        document.body.classList.remove("is-modal-open");
        player.stop();
        modal.classList.remove("is-visible");
        // ✨ در هنگام بستن، کلاس را حتما حذف می‌کنیم تا برای ویدیوی بعدی آماده باشد
        modalContent.classList.remove("is-vertical");
      };

      // Event Listeners (بدون تغییر)
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
  };

  // =======================================================
  // ========= ۳. اجرای برنامه =========
  // =======================================================
  App.init();
});
