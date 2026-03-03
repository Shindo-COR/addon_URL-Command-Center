window.RainbowHover = {};

RainbowHover.applyRainbowHover = function (enable) {
	const buttonsEl = document.getElementById("buttons");
	if (!buttonsEl) return;

	buttonsEl.querySelectorAll("button").forEach((btn) => {
		if (
			btn.classList.contains("close-extension-btn") ||
			btn.classList.contains("setting-btn") ||
			btn.classList.contains("edit-set-btn")
		) return;

		btn.onmouseenter = null;
		btn.onmouseleave = null;

		if (btn.dataset.color) btn.style.background = btn.dataset.color;
		btn.style.animation = "";

		if (enable) {
			btn.onmouseenter = () => {
				btn.style.background =
					"linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
				btn.style.backgroundSize = "400% 100%";
				btn.style.animation = "rainbowSlide 3s linear infinite";
			};
			btn.onmouseleave = () => {
				btn.style.background = btn.dataset.color;
				btn.style.animation = "";
			};
		}
	});
};


RainbowHover.applyRainbowHover(AppState.settings?.rainbowHover ?? false);