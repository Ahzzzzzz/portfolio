// Section reveal on scroll
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach(section => observer.observe(section));

// Image slideshow with dots
(function () {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".slideshow-dots");
  if (slides.length === 0) return;

  let currentSlide = 0;

  // Create dot indicators
  if (dotsContainer) {
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "slideshow-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to image " + (i + 1));
      dot.addEventListener("click", function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  var dots = dotsContainer ? dotsContainer.querySelectorAll(".slideshow-dot") : [];

  function goToSlide(index) {
    slides[currentSlide].classList.remove("active");
    if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

    currentSlide = index;

    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
  }

  function showNextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  setInterval(showNextSlide, 3000);
})();

// Content slideshow for certificate, skills, projects pages
const contentSlides = document.querySelectorAll(".content-slide");
let contentIndex = 0;

function nextContentSlide() {
  if (contentSlides.length === 0) return;

  contentSlides[contentIndex].classList.remove("active");
  contentIndex = (contentIndex + 1) % contentSlides.length;
  contentSlides[contentIndex].classList.add("active");
}

setInterval(nextContentSlide, 4000);

// AI News Carousel
(function () {
  const newsSlides = document.querySelectorAll(".news-slide");
  const dotsContainer = document.querySelector(".news-dots");
  const leftArrow = document.querySelector(".news-arrow-left");
  const rightArrow = document.querySelector(".news-arrow-right");

  if (newsSlides.length === 0) return;

  let newsIndex = 0;
  let autoPlayTimer;
  let progressTimer;
  const AUTO_PLAY_INTERVAL = 5000;

  // Create dot indicators
  newsSlides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.className = "news-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", function () {
      goToNewsSlide(i);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  // Create progress bar
  var progressWrap = document.createElement("div");
  progressWrap.className = "news-progress";
  var progressBar = document.createElement("div");
  progressBar.className = "news-progress-bar";
  progressWrap.appendChild(progressBar);
  dotsContainer.parentNode.insertBefore(progressWrap, dotsContainer.nextSibling);

  var dots = dotsContainer.querySelectorAll(".news-dot");

  function goToNewsSlide(index) {
    newsSlides[newsIndex].classList.remove("active");
    dots[newsIndex].classList.remove("active");

    newsIndex = index;

    newsSlides[newsIndex].classList.add("active");
    dots[newsIndex].classList.add("active");

    resetProgress();
  }

  function nextNewsSlide() {
    goToNewsSlide((newsIndex + 1) % newsSlides.length);
  }

  function prevNewsSlide() {
    goToNewsSlide((newsIndex - 1 + newsSlides.length) % newsSlides.length);
  }

  // Progress bar animation
  var progressStart;
  function animateProgress(timestamp) {
    if (!progressStart) progressStart = timestamp;
    var elapsed = timestamp - progressStart;
    var pct = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
    progressBar.style.width = pct + "%";
    if (pct < 100) {
      progressTimer = requestAnimationFrame(animateProgress);
    }
  }

  function resetProgress() {
    cancelAnimationFrame(progressTimer);
    progressBar.style.width = "0%";
    progressStart = null;
    progressTimer = requestAnimationFrame(animateProgress);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextNewsSlide, AUTO_PLAY_INTERVAL);
    resetProgress();
  }

  // Arrow controls
  if (leftArrow) {
    leftArrow.addEventListener("click", function () {
      prevNewsSlide();
      resetAutoPlay();
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", function () {
      nextNewsSlide();
      resetAutoPlay();
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    var carousel = document.querySelector(".news-carousel");
    if (!carousel) return;
    var rect = carousel.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === "ArrowLeft") {
      prevNewsSlide();
      resetAutoPlay();
    } else if (e.key === "ArrowRight") {
      nextNewsSlide();
      resetAutoPlay();
    }
  });

  // Pause on hover
  var carouselEl = document.querySelector(".news-carousel");
  if (carouselEl) {
    carouselEl.addEventListener("mouseenter", function () {
      clearInterval(autoPlayTimer);
      cancelAnimationFrame(progressTimer);
    });
    carouselEl.addEventListener("mouseleave", function () {
      resetAutoPlay();
    });
  }

  // Touch/swipe support
  var touchStartX = 0;
  if (carouselEl) {
    carouselEl.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carouselEl.addEventListener("touchend", function (e) {
      var touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextNewsSlide();
        } else {
          prevNewsSlide();
        }
        resetAutoPlay();
      }
    }, { passive: true });
  }

  // Start auto-play
  autoPlayTimer = setInterval(nextNewsSlide, AUTO_PLAY_INTERVAL);
  resetProgress();
})();
// Login form submit
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const loginUrl = "http://127.0.0.1:3000/login";

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Login successful ✅");
        loginForm.reset();
      } else {
        alert(data.message || "Invalid credentials ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  });
}

const openBtn = document.getElementById("openChat");
const closeBtn = document.getElementById("closeChat");
const chatBox = document.getElementById("chatBox");

if (openBtn) {
  openBtn.onclick = () => chatBox.style.display = "flex";
  closeBtn.onclick = () => chatBox.style.display = "none";
}  