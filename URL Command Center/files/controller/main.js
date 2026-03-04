// 初期化
initStorage(() => {
	getStorage(data => {
		// データがない場合は DEFAULT_CONFIG で埋める
		if (!data || !data.sets) {
		AppState.sets = window.DEFAULT_CONFIG.sets;
		AppState.active = window.DEFAULT_CONFIG.activeSet;
		AppState.settings = window.DEFAULT_CONFIG.settings;
		AppState.tabOrder = Object.keys(AppState.sets);
		AppState.backlogTemplates = AppState.backlogTemplates || DEFAULT_CONFIG.backlogTemplates;
		saveStorage({ sets: AppState.sets, activeSet: AppState.active, settings: AppState.settings, tabOrder: AppState.tabOrder });
		} else {
		AppState.sets = data.sets;
		AppState.active = data.activeSet || "default";
		AppState.settings = data.settings || window.DEFAULT_CONFIG.settings;
		
		AppState.tabOrder = data.tabOrder || Object.keys(AppState.sets);
		}

		Tab.renderTabs();
		ButtonRenderer.renderButtons();
		startAutoSave();
	});
});

