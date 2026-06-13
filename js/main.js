document.addEventListener("DOMContentLoaded", () => {
  // 1. Email Copy Functionality
  const emailBtn = document.getElementById("email-copy");

  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      const emailText = document.querySelector(".email-address").textContent;
      const feedback = document.querySelector(".copy-feedback");

      navigator.clipboard
        .writeText(emailText)
        .then(() => {
          feedback.classList.add("show");
          setTimeout(() => {
            feedback.classList.remove("show");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  }

  // 2. Smooth Fade-in Animation on Scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((section) => {
    observer.observe(section);
  });
});
