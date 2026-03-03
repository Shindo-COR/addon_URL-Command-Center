// Tooltip 作成（URLホバー用）
const tooltip = document.createElement("div");
tooltip.className = "url-tooltip";
document.body.appendChild(tooltip);

window.renderButtons = function () {
	const buttonsEl = document.getElementById("buttons");
	if (!buttonsEl) return;
	buttonsEl.innerHTML = "";

	// =====================
	// 固定ボタン
	// =====================
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
			window.initSettings?.();
		}
	};

	const hr = document.createElement("hr");
	hr.style.margin = "6px 0";

	// =====================
	// メインボタン専用Container
	// =====================
	const mainContainer = document.createElement("div");
	mainContainer.id = "mainButtonsContainer";

	const list = AppState.sets[AppState.active]?.buttons || [];

	list.forEach((b) => {
		const btn = document.createElement("button");
		btn.className = "main-url-btn";
		btn.dataset.color = b.color || "#607d8b";
		btn.dataset.url = b.url || "";
		btn.style.background = btn.dataset.color;
		btn.style.cursor = "grab";

		// label
		const labelSpan = document.createElement("span");
		labelSpan.textContent = b.label;

		// delete
		const deleteBtn = document.createElement("span");
		deleteBtn.textContent = "✖";
		deleteBtn.className = "main-btn-delete";

		deleteBtn.onclick = (e) => {
			e.stopPropagation();
			btn.remove(); 
			AppState.sets[AppState.active].buttons.splice(index, 1);
			saveStorage({ sets: AppState.sets });
			renderButtons();
		};

		// click URL
		btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

		// Tooltip
		btn.addEventListener("mouseenter", (e) => {
			tooltip.textContent = btn.dataset.url;
			tooltip.style.opacity = 1;
			tooltip.style.left = e.pageX + 10 + "px";
			tooltip.style.top = e.pageY + 10 + "px";
			});

		btn.addEventListener("mousemove", (e) => {
			tooltip.style.left = e.pageX + 10 + "px";
			tooltip.style.top = e.pageY + 10 + "px";
		});

		btn.addEventListener("mouseleave", () => {
			tooltip.style.opacity = 0;
		});

		btn.appendChild(labelSpan);
		btn.appendChild(deleteBtn);
		mainContainer.appendChild(btn);
	});

	// =====================
	// 上下配置切替
	// =====================
	const buttonsOnTop = AppState.settings?.buttonsOnTop ?? true;

	if (buttonsOnTop) {
		buttonsEl.append(settingBtn, closeExtBtn, editSetBtn, hr, mainContainer);
	} else {
		buttonsEl.append(mainContainer, hr, editSetBtn, settingBtn, closeExtBtn);
	}

	// =====================
	// Sortable（メインボタン専用）
	// =====================
	if (typeof Sortable !== "undefined") {
		if (mainContainer._sortable) mainContainer._sortable.destroy();

		mainContainer._sortable = Sortable.create(mainContainer, {
			animation: 150,
			ghostClass: "dragging",
			draggable: ".main-url-btn",

			onEnd: (evt) => {
				const buttons = AppState.sets[AppState.active].buttons;
				const moved = buttons.splice(evt.oldIndex, 1)[0];
				buttons.splice(evt.newIndex, 0, moved);

				saveStorage({ sets: AppState.sets });
				renderButtons();
			},
		});
	}

	// =====================
	// 設定閉じる
	// =====================
	const closeSettingBtn = document.getElementById("closeSettingsBtn");
	if (closeSettingBtn) {
		closeSettingBtn.onclick = () =>
			document.getElementById("settingsPanel")?.classList.remove("open");
	}

	applyDarkMode(AppState.settings?.darkMode ?? false);
	applyRainbowHover(AppState.settings?.rainbowHover ?? false);
};

// =====================
// ダークモード（カスタム対応）
// =====================
function applyDarkMode(enable) {
const body = document.body;
const buttonsEl = document.getElementById("buttons");
const tabsEl = document.getElementById("tabs");

if (!body) return;

const bgColor = AppState.settings.darkBgColor || "#7f7f93";
const textColor = AppState.settings.darkTextColor || "#ffffff";
const rainbow = AppState.settings.darkRainbowBg || false;
//メモ帳にも追加
const memoPad = document.getElementById("memoPad");
const memoTextarea = document.getElementById("memoTextarea");
if (enable) {
  memoPad.style.background = "#2c2c34";
  memoTextarea.style.background = "#1f1f25";
  memoTextarea.style.color = "#fff";
} else {
  memoPad.style.background = "#f8f9fb";
  memoTextarea.style.background = "#fff";
  memoTextarea.style.color = "#000";
}
//メモ帳にも追加End

if (enable) {
	if (rainbow) {
	body.style.background =
		"linear-gradient(135deg, #ff0080, #7928ca, #2afadf, #00f2fe)";
	body.style.backgroundSize = "400% 400%";
	body.style.animation = "darkRainbow 12s ease infinite";
	} else {
	body.style.background = bgColor;
	body.style.animation = "";
	}

	body.style.color = textColor;
} else {
	body.style.background = "#fafafa";
	body.style.color = "#000000";
	body.style.animation = "";
}
}

// =====================
// 虹色ホバー
// =====================
function applyRainbowHover(enable) {
	const buttonsEl = document.getElementById("buttons");
	if (!buttonsEl) return;

	buttonsEl.querySelectorAll("button").forEach((btn) => {
		if (
			btn.classList.contains("close-extension-btn") ||
			btn.classList.contains("setting-btn") ||
			btn.classList.contains("edit-set-btn")
		) return;

		//  まず必ずイベント解除
		btn.onmouseenter = null;
		btn.onmouseleave = null;

		// 元の色に戻す
		if (btn.dataset.color) {
		btn.style.background = btn.dataset.color;
		}
		btn.style.animation = "";

		// ONのときだけ再登録
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
	}

// 初期反映
applyDarkMode(AppState.settings?.darkMode ?? false);
applyRainbowHover(AppState.settings?.rainbowHover ?? false);
