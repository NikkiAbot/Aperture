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

  // Add a tracking class to the slider when on the "Contact Me" slide (index 3)
  if (active === 3) {
    document.querySelector(".slider").classList.add("contact-slide-active");
  } else {
    document.querySelector(".slider").classList.remove("contact-slide-active");
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
const numNodes = 25; // Total scattered nodes
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
    ctx.fillStyle = `rgba(200, 130, 90, ${this.depth})`;
    ctx.fill();
  }
}

function initNodes() {
  nodesArray = [];
  for (let i = 0; i < numNodes; i++) {
    nodesArray.push(new NodeParticle(nodesCanvas.width, nodesCanvas.height));
  }
}

function animateNodes() {
  // Skip heavy calculations and drawing if the section is hidden
  if (!nodesCanvas.closest(".detail-item").classList.contains("active")) {
    requestAnimationFrame(animateNodes);
    return;
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

// ResizeObserver to cleanly handle canvas resizing without Layout Thrashing
const nodesResizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
      nodesCanvas.width = entry.contentRect.width;
      nodesCanvas.height = entry.contentRect.height;
      initNodes();
    }
  }
});
if (nodesCanvas.parentElement)
  nodesResizeObserver.observe(nodesCanvas.parentElement);

// Start the animation loop
animateNodes();

// PROJECTS CAROUSEL LOGIC
const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".proj-ctrl.next");
const prevButton = document.querySelector(".proj-ctrl.prev");
const dotsNav = document.querySelector(".proj-indicators");
const dots = Array.from(dotsNav.children);

let currentProjIndex = 0;

const moveToSlide = (index) => {
  track.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[index].classList.add("active");

  currentProjIndex = index;
};

nextButton.addEventListener("click", () => {
  let targetIndex = currentProjIndex + 1;
  if (targetIndex >= slides.length) targetIndex = 0; // Loop back
  moveToSlide(targetIndex);
});

prevButton.addEventListener("click", () => {
  let targetIndex = currentProjIndex - 1;
  if (targetIndex < 0) targetIndex = slides.length - 1; // Loop to end
  moveToSlide(targetIndex);
});

dotsNav.addEventListener("click", (e) => {
  const targetDot = e.target.closest("span");
  if (!targetDot) return;
  const targetIndex = dots.findIndex((dot) => dot === targetDot);
  moveToSlide(targetIndex);
});

// PROJECTS INTERACTIVE BACKGROUND LOGIC (CANVAS)
const projCanvas = document.getElementById("projects-canvas");
const pCtx = projCanvas.getContext("2d");

let projParticles = [];
const numProjParticles = 35; // Number of floating particles
const projConnectionDistance = 120; // Distance to connect to each other
const mouseInteractionRadius = 180; // Distance to connect to mouse

let projMouse = { x: null, y: null };

// Track mouse position relative to the canvas
window.addEventListener("mousemove", (event) => {
  if (!projCanvas) return;
  const rect = projCanvas.getBoundingClientRect();
  // Check if mouse is within the bounds of the section
  if (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  ) {
    projMouse.x = event.clientX - rect.left;
    projMouse.y = event.clientY - rect.top;
  } else {
    projMouse.x = null;
    projMouse.y = null;
  }
});

window.addEventListener("mouseout", () => {
  projMouse.x = null;
  projMouse.y = null;
});

class ProjParticle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.radius = Math.random() * 2.5 + 1;
  }

  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    pCtx.fillStyle = "rgba(140, 170, 110, 0.8)"; // Matches the olive theme
    pCtx.fill();
  }
}

function initProjParticles() {
  projParticles = [];
  for (let i = 0; i < numProjParticles; i++) {
    projParticles.push(new ProjParticle(projCanvas.width, projCanvas.height));
  }
}

function animateProjParticles() {
  // Skip heavy calculations and drawing if the section is hidden
  if (!projCanvas.closest(".detail-item").classList.contains("active")) {
    requestAnimationFrame(animateProjParticles);
    return;
  }

  pCtx.clearRect(0, 0, projCanvas.width, projCanvas.height);

  for (let i = 0; i < projParticles.length; i++) {
    projParticles[i].update(projCanvas.width, projCanvas.height);
    projParticles[i].draw();

    // Connect particles to each other
    for (let j = i + 1; j < projParticles.length; j++) {
      const dx = projParticles[i].x - projParticles[j].x;
      const dy = projParticles[i].y - projParticles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < projConnectionDistance) {
        pCtx.beginPath();
        pCtx.moveTo(projParticles[i].x, projParticles[i].y);
        pCtx.lineTo(projParticles[j].x, projParticles[j].y);
        const opacity = 1 - distance / projConnectionDistance;
        pCtx.strokeStyle = `rgba(140, 170, 110, ${opacity * 0.4})`;
        pCtx.lineWidth = 1;
        pCtx.stroke();
      }
    }

    // Interactive mouse connection and repel effect
    if (projMouse.x != null && projMouse.y != null) {
      const dxMouse = projParticles[i].x - projMouse.x;
      const dyMouse = projParticles[i].y - projMouse.y;
      const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (distanceMouse < mouseInteractionRadius) {
        pCtx.beginPath();
        pCtx.moveTo(projParticles[i].x, projParticles[i].y);
        pCtx.lineTo(projMouse.x, projMouse.y);
        const opacityMouse = 1 - distanceMouse / mouseInteractionRadius;
        pCtx.strokeStyle = `rgba(140, 170, 110, ${opacityMouse * 0.8})`;
        pCtx.lineWidth = 1.5;
        pCtx.stroke();

        // Push particles away slightly (repel effect)
        const forceDirectionX = dxMouse / distanceMouse;
        const forceDirectionY = dyMouse / distanceMouse;
        const force =
          (mouseInteractionRadius - distanceMouse) / mouseInteractionRadius;

        projParticles[i].x += forceDirectionX * force * 1.5;
        projParticles[i].y += forceDirectionY * force * 1.5;
      }
    }
  }
  requestAnimationFrame(animateProjParticles);
}

// ResizeObserver to cleanly handle canvas resizing without Layout Thrashing
const projResizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
      projCanvas.width = entry.contentRect.width;
      projCanvas.height = entry.contentRect.height;
      initProjParticles();
    }
  }
});
if (projCanvas.parentElement)
  projResizeObserver.observe(projCanvas.parentElement);

animateProjParticles();

// TYPEWRITER EFFECT LOGIC
const typeWriterElement = document.querySelector(".typewriter-text");
const typeWriterStrings = [
  "console.log('Hello World!');",
  "System.out.println('My Work');",
  "print('Check out my projects')",
  "echo 'Welcome to my portfolio!';",
  "printf('Creative solutions\\n');",
  "fmt.Println('Making cool things');",
  "puts 'Turning ideas into reality'",
  "SELECT * FROM projects;",
  "<h1>Hello, World!</h1>",
  "return <Portfolio />;",
];
let typeStringIndex = 0;
let typeCharIndex = 0;
let isDeleting = false;

function typeWriter() {
  if (!typeWriterElement) return;

  const currentString = typeWriterStrings[typeStringIndex];
  let typeSpeed = isDeleting ? 40 : 100;

  if (!isDeleting) {
    typeWriterElement.textContent = currentString.substring(
      0,
      typeCharIndex + 1,
    );
    typeCharIndex++;
  } else {
    typeWriterElement.textContent = currentString.substring(
      0,
      typeCharIndex - 1,
    );
    typeCharIndex--;
  }

  if (!isDeleting && typeCharIndex === currentString.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at the end of typing
  } else if (isDeleting && typeCharIndex === 0) {
    isDeleting = false;
    typeStringIndex = (typeStringIndex + 1) % typeWriterStrings.length;
    typeSpeed = 500; // Pause before typing next word
  }

  setTimeout(typeWriter, typeSpeed);
}

typeWriter();

// EMAILJS CONTACT FORM LOGIC
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Robustly prevents the page from reloading
    sendMail();
  });
}

function sendMail() {
  const sendBtn = document.querySelector(".contact-form .btn");
  const originalBtnText = sendBtn.innerText;
  sendBtn.innerText = "Sending..."; // Updates the button text while processing
  sendBtn.disabled = true;

  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs
    .send("service_a2pym84", "template_dnsag4r", parms)
    .then(() => {
      sendBtn.innerText = originalBtnText;
      sendBtn.disabled = false;

      // Trigger dissolve effect on inputted text
      const inputs = document.querySelectorAll(
        ".contact-form input, .contact-form textarea",
      );
      inputs.forEach((input) => input.classList.add("dissolve"));

      // Show the animated success popup
      const popup = document.getElementById("success-popup");
      popup.classList.add("show");

      // Wait for the dissolve animation to finish (0.5s), then permanently clear the fields
      setTimeout(() => {
        inputs.forEach((input) => {
          input.value = "";
          input.classList.remove("dissolve");
        });
      }, 500);

      // Automatically hide the popup after 3.5 seconds
      setTimeout(() => {
        popup.classList.remove("show");
      }, 3500);
    })
    .catch((error) => {
      sendBtn.innerText = originalBtnText;
      sendBtn.disabled = false;
      alert("Failed to send the email. Please try again.");
      console.error("EmailJS Error:", error);
    });
}
