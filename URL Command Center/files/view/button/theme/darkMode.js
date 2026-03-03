window.DarkMode = {};

DarkMode.applyDarkMode = function (enable) {
	if (!window.AppState) return;

	if (!AppState.settings) AppState.settings = {};

	const settings = AppState.settings;

	const body = document.body;
	if (!body) return;

	const bgColor   = settings.darkBgColor   || "#7f7f93";
	const textColor = settings.darkTextColor || "#ffffff";
	const rainbow   = settings.darkRainbowBg || false;

	// メモ帳
	const memoPad = document.getElementById("memoPad");
	const memoTextarea = document.getElementById("memoTextarea");

	if (memoPad && memoTextarea) {
		if (enable) {
			memoPad.style.background = "#2c2c34";
			memoTextarea.style.background = "#1f1f25";
			memoTextarea.style.color = "#fff";
		} else {
			memoPad.style.background = "#f8f9fb";
			memoTextarea.style.background = "#fff";
			memoTextarea.style.color = "#000";
		}
	}

	if (enable) {
		if (rainbow) {
			body.style.background =
				"linear-gradient(135deg,#ff0080,#7928ca,#2afadf,#00f2fe)";
			body.style.backgroundSize = "400% 400%";
			body.style.animation = "darkRainbow 12s ease infinite";
		} else {
			body.style.background = bgColor;
			body.style.animation = "";
		}
		body.style.color = textColor;
	} else {
		body.style.background = "#fafafa";
		body.style.color = "#000";
		body.style.animation = "";
	}
};

// 初期反映（settings未ロードでも落ちない）
DarkMode.applyDarkMode(AppState?.settings?.darkMode ?? false);