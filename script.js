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

// NODES BACKGROUND ANIMATION LOGIC (CANVAS)
const nodesCanvas = document.getElementById("nodes-canvas");
const ctx = nodesCanvas.getContext("2d");

let nodesArray = [];
const numNodes = 80; // Total scattered nodes
const maxDistance = 150; // How close they need to be to connect

class NodeParticle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    // Depth creates a 3D parallax effect: lower value = further away
    this.depth = Math.random() * 0.8 + 0.2;
    this.vx = (Math.random() - 0.5) * (1.5 * this.depth); // Far nodes move slower
    this.vy = (Math.random() - 0.5) * (1.5 * this.depth);
    this.radius = (Math.random() * 2 + 1) * this.depth; // Far nodes are smaller
  }

  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce smoothly off the edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // Far nodes are dimmer, adding depth
    ctx.fillStyle = `rgba(200, 130, 90, ${this.depth * 0.8})`;
    ctx.shadowBlur = 8; // Adds a glowing blur to the nodes
    ctx.shadowColor = "rgba(200, 130, 90, 0.8)";
    ctx.fill();
    ctx.shadowBlur = 0; // Reset so connecting lines don't get overly blurred
  }
}

function initNodes() {
  nodesArray = [];
  for (let i = 0; i < numNodes; i++) {
    nodesArray.push(new NodeParticle(nodesCanvas.width, nodesCanvas.height));
  }
}

function animateNodes() {
  const parentWidth = nodesCanvas.parentElement.offsetWidth;
  const parentHeight = nodesCanvas.parentElement.offsetHeight;

  // Automatically resize canvas and re-scatter nodes if container changes size
  if (
    parentWidth > 0 &&
    (nodesCanvas.width !== parentWidth || nodesCanvas.height !== parentHeight)
  ) {
    nodesCanvas.width = parentWidth;
    nodesCanvas.height = parentHeight;
    initNodes();
  }

  ctx.clearRect(0, 0, nodesCanvas.width, nodesCanvas.height);

  for (let i = 0; i < nodesArray.length; i++) {
    nodesArray[i].update(nodesCanvas.width, nodesCanvas.height);
    nodesArray[i].draw();

    // Calculate distance and draw connecting lines to all nearby nodes
    for (let j = i + 1; j < nodesArray.length; j++) {
      const dx = nodesArray[i].x - nodesArray[j].x;
      const dy = nodesArray[i].y - nodesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(nodesArray[i].x, nodesArray[i].y);
        ctx.lineTo(nodesArray[j].x, nodesArray[j].y);
        // Connections between far nodes are also dimmer
        const depthOpacity = (nodesArray[i].depth + nodesArray[j].depth) / 2;
        const opacity = (1 - distance / maxDistance) * depthOpacity;
        ctx.strokeStyle = `rgba(200, 130, 90, ${opacity * 0.6})`; // Fading connection
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateNodes);
}

// Start the animation loop
animateNodes();
