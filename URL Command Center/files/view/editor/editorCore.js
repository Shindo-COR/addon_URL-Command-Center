window.Editor = {}; // 名前空間
window.EditorCore = {};

window.openEditor = function(key) {
	Editor.key = key;
	Editor.set = AppState.sets[key];
	Editor.panel = document.getElementById("editorPanel");
	Editor.content = document.getElementById("editorContent");

	Editor.panel.classList.add("open");

	EditorUI.renderLayout();
	EditorButton.drawRows();
	EditorBacklog.render(key);

	EditorUI.bindMenu(); 

	EditorButton.bindAddButton();

	EditorTabActions.bind(key);
	EditorCore.bindClose();
};

window.closeEditorPanel = function() {
	document.getElementById("editorPanel").classList.remove("open");
};


EditorCore.bindClose = function() {
	const closeBtn = document.getElementById("close-btn");

	closeBtn.onclick = () => {
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

	// Enterキーで「保存して閉じる」
	document.addEventListener("keydown", (e) => {

		// editorが開いていない場合は無視
		if (!Editor.panel.classList.contains("open")) return;

		// textareaではEnter許可
		if (e.target.tagName === "TEXTAREA") return;

		if (e.key === "Enter") {
			e.preventDefault();
			closeBtn.click();
		}

	});
};