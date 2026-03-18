window.EditorTabActions = {};

EditorTabActions.bind = function(key) {
	const set = Editor.set;

	// 複製
	document.getElementById("duplicateTab").onclick = () => {

		const keys = Object.keys(AppState.sets);

		if (keys.length >= AppState.MAX_TABS) {
			alert(`タブは最大${AppState.MAX_TABS}件までです`);
			return;
		}

		const newKey = "set" + Date.now();
		const cloned = JSON.parse(JSON.stringify(Editor.set));

		cloned.title += " (copy)";

		AppState.sets[newKey] = cloned;
		AppState.tabOrder.push(newKey);
		AppState.active = newKey;

		saveStorage({ sets: AppState.sets, activeSet: AppState.active });

		closeEditorPanel();

		Tab.renderTabs();
		
		ButtonRenderer.renderButtons();

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

};