window.FixedButtons = {};

FixedButtons.createFixedButtons = function() {
	const closeExtBtn = document.createElement("button");
	closeExtBtn.textContent = "✖　終了する";
	closeExtBtn.className = "close-extension-btn";
	closeExtBtn.onclick = () => window.close();

	const editSetBtn = document.createElement("button");
	editSetBtn.textContent = "⇅　マイセット編集";
	editSetBtn.className = "edit-set-btn";
	editSetBtn.onclick = () => {
		const key = AppState.active;
		if (key && window.openEditor) openEditor(key);
	};

	const settingBtn = document.createElement("button");
	settingBtn.textContent = "⚙　全体設定";
	settingBtn.className = "setting-btn";
	settingBtn.onclick = () => {
		const panel = document.getElementById("settingsPanel");
		if (panel) {
			panel.classList.toggle("open");
			window.initSettings?.();//後ほど改修
		}
	};

	const hr = document.createElement("hr");
	hr.style.margin = "6px 0";

	return { closeExtBtn, editSetBtn, settingBtn, hr };
};