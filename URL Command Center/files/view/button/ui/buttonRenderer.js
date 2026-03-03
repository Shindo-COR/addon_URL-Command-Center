window.ButtonRenderer = {};
ButtonRenderer.renderButtons = function() {
	const buttonsEl = document.getElementById("buttons");
	if (!buttonsEl) return;
	buttonsEl.innerHTML = "";

	const { closeExtBtn, editSetBtn, settingBtn, hr } = FixedButtons.createFixedButtons();
	const mainContainer = MainButtons.createMainButtonsContainer();

	const buttonsOnTop = AppState.settings?.buttonsOnTop ?? true;

	if (buttonsOnTop) {
		buttonsEl.append(settingBtn, closeExtBtn, editSetBtn, hr, mainContainer);
	} else {
		buttonsEl.append(mainContainer, hr, editSetBtn, settingBtn, closeExtBtn);
	}
	window.initSortableMainButtons(mainContainer); 

	const closeSettingBtn = document.getElementById("closeSettingsBtn");
	if (closeSettingBtn) {
		closeSettingBtn.onclick = () =>
			document.getElementById("settingsPanel")?.classList.remove("open");
	}

	DarkMode.applyDarkMode(AppState.settings?.darkMode ?? false);
	RainbowHover.applyRainbowHover(AppState.settings?.rainbowHover ?? false);
};

