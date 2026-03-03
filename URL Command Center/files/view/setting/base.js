window.initSettings = function () {
	const settingsPanel = document.getElementById("settingsPanel");
	const settingsContent = document.getElementById("settingContent");
	if (!settingsPanel || !settingsContent) return;

	settingsContent.innerHTML = "";

	// 初期値
	AppState.settings = AppState.settings || {};
	if (AppState.settings.buttonsOnTop === undefined) AppState.settings.buttonsOnTop = true;
	if (AppState.settings.darkMode === undefined) AppState.settings.darkMode = false;
	if (!AppState.settings.darkBgColor) AppState.settings.darkBgColor = "#1a1a2e";
	if (!AppState.settings.darkTextColor) AppState.settings.darkTextColor = "#ffffff";
	if (AppState.settings.darkRainbowBg === undefined) AppState.settings.darkRainbowBg = false;
	if (AppState.settings.rainbowHover === undefined) AppState.settings.rainbowHover = false;

	// =====================
	// UI ヘルパー関数
	// =====================
	const createGroup = (title) => {
		const group = document.createElement("div");
		group.className = "setting-group";
		const t = document.createElement("div");
		t.className = "setting-group-title";
		t.textContent = title;
		group.appendChild(t);
		settingsContent.appendChild(group);
		return group;
	};

	const createRow = (labelText) => {
		const row = document.createElement("div");
		row.className = "setting-row";
		const span = document.createElement("span");
		span.textContent = labelText;
		row.appendChild(span);
		return { row, span };
	};

	// =====================
	// 1: UI配置
	// =====================
	const uiGroup = createGroup("UI配置");

	const posRow = createRow("閉じる/設定ボタンを上に表示");
	const posCheck = document.createElement("input");
	posCheck.type = "checkbox";
	posCheck.checked = AppState.settings.buttonsOnTop;
	posCheck.onchange = () => {
		AppState.settings.buttonsOnTop = posCheck.checked;
		saveStorage({ settings: AppState.settings });
		// renderButtons();
		ButtonRenderer.renderButtons();
	};
	posRow.row.appendChild(posCheck);
	uiGroup.appendChild(posRow.row);

	// =====================
	// 2: ダークモード
	// =====================
	const darkGroup = createGroup("ダークモード設定");

	const darkRow = createRow("ダークモード");
	const darkCheck = document.createElement("input");
	darkCheck.type = "checkbox";
	darkCheck.checked = AppState.settings.darkMode;
	darkCheck.onchange = () => {
		AppState.settings.darkMode = darkCheck.checked;
		saveStorage({ settings: AppState.settings });
		// applyDarkMode(darkCheck.checked);
		DarkMode.applyDarkMode(darkCheck.checked);
	};
	darkRow.row.appendChild(darkCheck);
	darkGroup.appendChild(darkRow.row);

	const bgRow = createRow("背景色");
	const bgPicker = document.createElement("input");
	bgPicker.type = "color";
	bgPicker.value = AppState.settings.darkBgColor;
	bgPicker.oninput = () => {
		AppState.settings.darkBgColor = bgPicker.value;
		saveStorage({ settings: AppState.settings });
		// applyDarkMode(true);
		DarkMode.applyDarkMode(true);
	};
	bgRow.row.appendChild(bgPicker);
	darkGroup.appendChild(bgRow.row);

	const textRow = createRow("文字色");
	const textPicker = document.createElement("input");
	textPicker.type = "color";
	textPicker.value = AppState.settings.darkTextColor;
	textPicker.oninput = () => {
		AppState.settings.darkTextColor = textPicker.value;
		saveStorage({ settings: AppState.settings });
		// applyDarkMode(true);
		DarkMode.applyDarkMode(true);
	};
	textRow.row.appendChild(textPicker);
	darkGroup.appendChild(textRow.row);

	// =====================
	// 3: エフェクト
	// =====================
	const effectGroup = createGroup("エフェクト");

	const hoverRow = createRow("ボタンホバー虹色");
	const hoverCheck = document.createElement("input");
	hoverCheck.type = "checkbox";
	hoverCheck.checked = AppState.settings.rainbowHover;
	hoverCheck.onchange = () => {
		AppState.settings.rainbowHover = hoverCheck.checked;
		saveStorage({ settings: AppState.settings });
		// applyRainbowHover(hoverCheck.checked);
		RainbowHover.applyRainbowHover(hoverCheck.checked);
	};
	hoverRow.row.appendChild(hoverCheck);
	effectGroup.appendChild(hoverRow.row);

	// =====================
	// 4: データ操作
	// =====================
	const dataGroup = createGroup("設定データ");

	const actions = document.createElement("div");
	actions.className = "setting-actions";

	const resetBtn = document.createElement("button");
	resetBtn.textContent = "初期設定にリセット";
	resetBtn.onclick = () => {
		if (!confirm("本当に完全初期設定に戻しますか？すべて消えます。")) return;
		// deep clone
		AppState.sets = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.sets));
		AppState.active = window.DEFAULT_CONFIG.activeSet;
		AppState.settings = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.settings));

		// storage も完全上書き
		saveStorage({
			sets: AppState.sets,
			activeSet: AppState.active,
			settings: AppState.settings
		});

		// renderTabs();
		Tab.renderTabs();
		// renderButtons();
		ButtonRenderer.renderButtons();
		initSettings();
		// applyDarkMode(AppState.settings.darkMode);
		DarkMode.applyDarkMode(AppState.settings.darkMode);

		alert("完全に初期設定にリセットしました");
	};

	actions.appendChild(resetBtn);

		const exportBtn = document.createElement("button");
		exportBtn.textContent = "設定をエクスポート";
		exportBtn.onclick = () => {

		// すべて含める
		const exportData = {
			sets: AppState.sets,
			activeSet: AppState.active,
			settings: AppState.settings
		};

		const dataStr = JSON.stringify(exportData, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "QuickAccessURL_config.json";
		a.click();
		URL.revokeObjectURL(url);
		};

	actions.appendChild(exportBtn);

	const importBtn = document.createElement("button");
	importBtn.textContent = "設定をインポート";
	importBtn.onclick = () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json";

	input.onchange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (ev) => {
		try {
			const imported = JSON.parse(ev.target.result);

			// 新フォーマット対応
			if (imported.sets) {
			AppState.sets = imported.sets;
			AppState.active = imported.activeSet || "default";
			AppState.settings = imported.settings || AppState.settings;
			} 
			// 旧フォーマット互換
			else {
			AppState.sets = imported;
			}

			saveStorage({
			sets: AppState.sets,
			activeSet: AppState.active,
			settings: AppState.settings
			});

			// renderTabs();
			Tab.renderTabs();
			// renderButtons();
			ButtonRenderer.renderButtons();
			initSettings();

			alert("設定ファイルをロードしました");
		} catch (err) {
			alert("設定ファイルの読み込みに失敗しました");
			console.error(err);
		}
		};

		reader.readAsText(file);
	};

	input.click();
	};

	actions.appendChild(importBtn);

	dataGroup.appendChild(actions);

	// パネル表示
	settingsPanel.classList.add("open");

	const closeBtn = document.getElementById("closeSettingsBtn");
	if (closeBtn) closeBtn.onclick = () => settingsPanel.classList.remove("open");

	// 初期反映
	// applyDarkMode(AppState.settings.darkMode);
	DarkMode.applyDarkMode(AppState.settings.darkMode);
};
