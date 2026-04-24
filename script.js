let items = document.querySelectorAll(".slider .item");
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
