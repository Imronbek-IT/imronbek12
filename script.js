
// ====================================
// APPLE WEBSITE - JAVASCRIPT
// ====================================

// LOADER
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".loader").classList.add("hide");
  }, 700);
});

// THEME SWITCHER
const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("apple-theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☾";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");

  themeBtn.textContent = isLight ? "☾" : "☼";

  localStorage.setItem(
    "apple-theme",
    isLight ? "light" : "dark"
  );
});

// MOBILE MENU
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuBtn.textContent = navLinks.classList.contains("open")
    ? "✕"
    : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.textContent = "☰";
  });
});

// SCROLL REVEAL
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  }
);

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

// ====================================
// 3D CIRCLE CAROUSEL
// ====================================

const stage = document.getElementById("circleStage");
const cards = [...document.querySelectorAll(".circle-card")];

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const carouselTitle = document.getElementById("carouselTitle");
const carouselDescription = document.getElementById("carouselDescription");
const dotsContainer = document.getElementById("carouselDots");

const descriptions = [
  "A whole new level of innovation.",
  "Power meets beautiful simplicity.",
  "Your creativity has no limits.",
  "A healthier future on your wrist.",
  "Sound beyond imagination.",
  "Complete your Apple experience."
];

let currentIndex = 0;
let rotation = 0;
let autoPlay;
let isDragging = false;
let startX = 0;
let lastX = 0;
let dragDistance = 0;

const total = cards.length;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// CREATE DOTS
cards.forEach((card, index) => {
  const dot = document.createElement("button");

  dot.setAttribute("aria-label", `Go to product ${index + 1}`);

  dot.addEventListener("click", () => {
    currentIndex = index;
    updateCarousel();
    restartAutoPlay();
  });

  dotsContainer.appendChild(dot);

  card.addEventListener("click", () => {
    if (Math.abs(dragDistance) > 8) return;

    currentIndex = index;
    updateCarousel();
    restartAutoPlay();
  });
});

const dots = [...dotsContainer.querySelectorAll("button")];

function getRadius() {
  return Math.min(stage.clientWidth * 0.39, 225);
}

function updateCarousel() {
  const radius = getRadius();
  const angleStep = (Math.PI * 2) / total;

  cards.forEach((card, index) => {
    let relative = index - currentIndex;

    // Eng qisqa aylanish yo'lini topish
    if (relative > total / 2) relative -= total;
    if (relative < -total / 2) relative += total;

    const angle = relative * angleStep + Math.PI / 2;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.72;

    const isActive = index === currentIndex;

    const scale = isActive ? 1.15 : 0.72;
    const zIndex = 10 - Math.abs(relative);

    card.style.transform = `
      translate(${x}px, ${y}px)
      scale(${scale})
    `;

    card.style.zIndex = zIndex;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-current", isActive ? "true" : "false");
  });

  carouselTitle.textContent = cards[currentIndex]
    .querySelector("span").textContent;

  carouselDescription.textContent = descriptions[currentIndex];

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

// NEXT / PREVIOUS
function nextSlide() {
  currentIndex = (currentIndex + 1) % total;
  updateCarousel();
}

function previousSlide() {
  currentIndex = (currentIndex - 1 + total) % total;
  updateCarousel();
}

nextBtn.addEventListener("click", () => {
  nextSlide();
  restartAutoPlay();
});

prevBtn.addEventListener("click", () => {
  previousSlide();
  restartAutoPlay();
});

// AUTO PLAY
function startAutoPlay() {
  if (prefersReducedMotion) return;

  stopAutoPlay();

  autoPlay = setInterval(() => {
    if (!document.hidden && !isDragging) {
      nextSlide();
    }
  }, 3500);
}

function stopAutoPlay() {
  clearInterval(autoPlay);
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

stage.addEventListener("mouseenter", stopAutoPlay);
stage.addEventListener("mouseleave", startAutoPlay);

// TOUCH / MOUSE DRAG
stage.addEventListener("pointerdown", event => {
  isDragging = true;
  startX = event.clientX;
  lastX = event.clientX;
  dragDistance = 0;

  stage.setPointerCapture(event.pointerId);
  stopAutoPlay();
});

stage.addEventListener("pointermove", event => {
  if (!isDragging) return;

  lastX = event.clientX;
  dragDistance = lastX - startX;
});

function finishDrag() {
  if (!isDragging) return;

  isDragging = false;

  if (Math.abs(dragDistance) > 40) {
    if (dragDistance < 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  }

  dragDistance = 0;
  startAutoPlay();
}

stage.addEventListener("pointerup", finishDrag);
stage.addEventListener("pointercancel", finishDrag);

// KEYBOARD CONTROLS
document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") {
    nextSlide();
    restartAutoPlay();
  }

  if (event.key === "ArrowLeft") {
    previousSlide();
    restartAutoPlay();
  }
});

// RESIZE
window.addEventListener("resize", updateCarousel);

// INITIALIZE
updateCarousel();
startAutoPlay();

// PAUSE WHEN TAB IS HIDDEN
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
});

// HERO PARALLAX
const heroImage = document.querySelector(".hero-phone");

if (!prefersReducedMotion) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight) {
      heroImage.style.transform =
        `translateY(${scrollY * 0.12}px) rotate(-3deg)`;
    }
  }, { passive: true });
}

console.log("Apple website initialized successfully!");


// =================================
// PREMIUM 3D CARD INTERACTIONS
// =================================

const animatedCards = document.querySelectorAll(".product-card");

animatedCards.forEach(card => {

  // Scroll reveal
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        card.classList.add("card-visible");
        cardObserver.unobserve(card);
      }
    });
  }, {
    threshold: 0.15
  });

  cardObserver.observe(card);

  // 3D mouse tilt
  card.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;

    card.style.transform = `
      translateY(-14px)
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.025)
    `;
  });

  // Mouse chiqib ketganda original holat
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });

  // Keyboard accessibility
  card.addEventListener("focusin", () => {
    card.style.boxShadow =
      "0 25px 60px rgba(41,151,255,.15)";
  });

  card.addEventListener("focusout", () => {
    card.style.boxShadow = "";
  });

});
