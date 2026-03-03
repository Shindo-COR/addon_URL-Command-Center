window.EditorTabActions = {};

EditorTabActions.bind = function(key) {
	const set = Editor.set;

	// 複製
	document.getElementById("duplicateTab").onclick = () => {
		const keys = Object.keys(AppState.sets);
		if (keys.length >= AppState.MAX_TABS) return;

		const newKey = "set" + Date.now();
		const cloned = JSON.parse(JSON.stringify(set));
		cloned.title += " (copy)";

		AppState.sets[newKey] = cloned;
		AppState.active = newKey;
		saveStorage({ sets: AppState.sets, activeSet: AppState.active });

		closeEditorPanel();
		// renderTabs();
		Tab.renderTabs();
		renderButtons();
	};

	// 削除
	document.getElementById("deleteTab").onclick = () => {
		const keys = Object.keys(AppState.sets);
		if (keys.length <= AppState.MIN_TABS) {
			alert("最低1つのタブが必要です");
			return;
		}

		const tabTitle = AppState.sets[key]?.title || key;
		if (!confirm(`タブ「${tabTitle}」を削除しますか？`)) return;

		delete AppState.sets[key];
		AppState.active = Object.keys(AppState.sets)[0];
		saveStorage({ sets: AppState.sets, activeSet: AppState.active });

		closeEditorPanel();
		// renderTabs();
		Tab.renderTabs();
		// renderButtons();
		ButtonRenderer.renderButtons();
	};

	// リセット
	document.getElementById("resetTab").onclick = () => {
		if (!confirm("全タブを初期状態に戻しますか？")) return;

		AppState.sets = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.sets));
		AppState.active = window.DEFAULT_CONFIG.activeSet || Object.keys(AppState.sets)[0];

		// renderTabs();
		Tab.renderTabs();
		// renderButtons();
		ButtonRenderer.renderButtons();
		closeEditorPanel();
		saveStorage({ sets: AppState.sets, activeSet: AppState.active });
	};
};