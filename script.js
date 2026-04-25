let items = document.querySelectorAll(".slider .item");
let detailItems = document.querySelectorAll(".details-section .detail-item");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let lastPosition = items.length - 1;
let firstPosition = 0;
let active = 0;
const itemNames = ["Home", "About Me", "My Projects", "Contact Me"];

nextBtn.onclick = () => {
  active++;
  setSlider();
};

prevBtn.onclick = () => {
  active--;
  setSlider();
};

const setSlider = () => {
  let oldActive = document.querySelector(".slider .item.active");
  if (oldActive) oldActive.classList.remove("active");
  items[active].classList.add("active");

  // Sync the details section to show the correct content below the slider
  let oldActiveDetail = document.querySelector(
    ".details-section .detail-item.active",
  );
  if (oldActiveDetail) oldActiveDetail.classList.remove("active");
  if (detailItems[active]) detailItems[active].classList.add("active");

  nextBtn.classList.remove("d-none");
  prevBtn.classList.remove("d-none");

  if (active == lastPosition) {
    nextBtn.classList.add("d-none");
  } else {
    nextBtn.querySelector("span").innerText = itemNames[active + 1];
  }

  if (active == firstPosition) {
    prevBtn.classList.add("d-none");
  } else {
    prevBtn.querySelector("span").innerText = itemNames[active - 1];
  }
};

setSlider();

const setDiameter = () => {
  let slider = document.querySelector(".slider");
  let widthSlider = slider.offsetWidth;
  let heightSlider = slider.offsetHeight;
  let diameter = Math.sqrt(
    Math.pow(widthSlider, 2) + Math.pow(heightSlider, 2),
  );
  document.documentElement.style.setProperty("--diameter", diameter + "px");
};

setDiameter();
window.addEventListener("resize", setDiameter);

// BACK TO TOP BUTTON LOGIC
const backToTopBtn = document.getElementById("back-to-top");
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }

  // STICKY HEADER BACKGROUND LOGIC
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// HAMBURGER MENU LOGIC
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navMenuItems = document.querySelectorAll(".nav-menu li");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

navMenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetIndex = parseInt(item.getAttribute("data-index"));
    active = targetIndex;
    setSlider();
    navMenu.classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.addEventListener("click", (e) => {
  if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active");
  }
});

// SCROLL TRIGGER ANIMATION LOGIC
const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.1, // Trigger when 10% of the element is visible
  rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the true bottom
};

const appearOnScroll = new IntersectionObserver(function (
  entries,
  appearOnScroll,
) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("appear");
    } else {
      entry.target.classList.remove("appear");
    }
  });
}, appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});
