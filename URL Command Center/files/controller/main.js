// 初期化
initStorage(() => {
getStorage(data => {
	// データがない場合は DEFAULT_CONFIG で埋める
	if (!data || !data.sets) {
	AppState.sets = window.DEFAULT_CONFIG.sets;
	AppState.active = window.DEFAULT_CONFIG.activeSet;
	AppState.settings = window.DEFAULT_CONFIG.settings;
	AppState.backlogTemplates = AppState.backlogTemplates || DEFAULT_CONFIG.backlogTemplates;
	saveStorage({ sets: AppState.sets, activeSet: AppState.active, settings: AppState.settings });
	} else {
	AppState.sets = data.sets;
	AppState.active = data.activeSet || "default";
	AppState.settings = data.settings || window.DEFAULT_CONFIG.settings;
	}


	Tab.renderTabs();
	ButtonRenderer.renderButtons();
	startAutoSave();
});
});

