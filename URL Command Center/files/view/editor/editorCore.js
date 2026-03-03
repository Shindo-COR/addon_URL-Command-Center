window.Editor = {}; // 名前空間

window.openEditor = function(key) {
	Editor.key = key;
	Editor.set = AppState.sets[key];
	Editor.panel = document.getElementById("editorPanel");
	Editor.content = document.getElementById("editorContent");

	Editor.panel.classList.add("open");

	EditorUI.renderLayout();
	EditorButton.drawRows();
	EditorBacklog.render(key);
	EditorTabActions.bind(key);
	EditorButton.bindAddButton();
	EditorCore.bindClose();
};

window.closeEditorPanel = function() {
	document.getElementById("editorPanel").classList.remove("open");
};

window.EditorCore = {};

EditorCore.bindClose = function() {
	document.getElementById("close-btn").onclick = () => {
		const set = Editor.set;
		set.title = document.getElementById("tabTitle").value;

		const rows = document.querySelectorAll("#btnEditor .row");
		set.buttons = [...rows].map(r => ({
			label: r.querySelector(".label").value,
			url: r.querySelector(".url").value,
			color: r.querySelector(".color").value
		}));

		saveStorage({ sets: AppState.sets });
		// renderTabs();
		Tab.renderTabs();
		// renderButtons();
		ButtonRenderer.renderButtons();
		closeEditorPanel();
	};
};