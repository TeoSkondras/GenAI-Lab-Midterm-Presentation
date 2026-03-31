const VIDEO_EMBED_URL = "https://www.youtube.com/watch?v=HVm_r50J4Pw";

const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const slideTrack = document.querySelector("[data-slide-track]");
const slides = Array.from(document.querySelectorAll(".slide"));
const slideCurrent = document.querySelector("[data-slide-current]");
const slideDirectionButtons = Array.from(
  document.querySelectorAll("[data-slide-dir]")
);
const slideDotButtons = Array.from(
  document.querySelectorAll("[data-slide-dot]")
);
const videoSlot = document.querySelector("[data-video-slot]");

const state = {
  activeTab: "presentation",
  activeSlide: 0,
};

function clampSlide(index) {
  return Math.min(Math.max(index, 0), slides.length - 1);
}

function setActiveTab(targetId) {
  state.activeTab = targetId;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === targetId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.id === targetId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function setActiveSlide(nextIndex) {
  state.activeSlide = clampSlide(nextIndex);
  slideTrack.style.transform = `translateX(-${state.activeSlide * 100}%)`;
  slideCurrent.textContent = String(state.activeSlide + 1);

  slideDirectionButtons.forEach((button) => {
    const direction = Number(button.dataset.slideDir);
    const wouldBeIndex = state.activeSlide + direction;
    button.disabled = wouldBeIndex < 0 || wouldBeIndex > slides.length - 1;
  });

  slideDotButtons.forEach((button) => {
    const isActive = Number(button.dataset.slideDot) === state.activeSlide;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function renderVideoSlot() {
  if (!videoSlot) {
    return;
  }

  if (VIDEO_EMBED_URL) {
    videoSlot.innerHTML = `
      <div class="video-placeholder video-link-card">
        <div>
          <strong>Demo video</strong>
          <p>Open the full video on YouTube.</p>
          <p>
            <a href="${VIDEO_EMBED_URL}" target="_blank" rel="noreferrer">
              Watch video on YouTube
            </a>
          </p>
        </div>
      </div>
    `;
    return;
  }

  videoSlot.innerHTML = `
    <div class="video-placeholder">
      <div>
        <strong>Video goes here</strong>
        <p>Add a YouTube embed URL in <code>script.js</code> when it is ready.</p>
      </div>
    </div>
  `;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tabTarget);
  });
});

slideDirectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.slideDir);
    setActiveSlide(state.activeSlide + direction);
  });
});

slideDotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSlide(Number(button.dataset.slideDot));
  });
});

document.addEventListener("keydown", (event) => {
  if (state.activeTab !== "presentation") {
    return;
  }

  const target = event.target;
  if (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  ) {
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    setActiveSlide(state.activeSlide + 1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    setActiveSlide(state.activeSlide - 1);
  }
});

renderVideoSlot();
setActiveTab(state.activeTab);
setActiveSlide(state.activeSlide);
