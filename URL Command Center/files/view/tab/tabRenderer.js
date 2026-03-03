window.Tab = window.Tab || {};
Tab.Renderer = {};

Tab.Renderer.render = function () {
	const tabsEl = document.getElementById("tabs");
	tabsEl.innerHTML = "";

	const keys = Object.keys(AppState.sets);

	keys.forEach((key) => {
		const tab = document.createElement("div");
		tab.className = "tab";
		tab.draggable = true;
		if (key === AppState.active) tab.classList.add("active");

		const title = document.createElement("span");
		title.className = "tab-title";
		title.textContent = AppState.sets[key].title;
		title.ondblclick = () => openEditor(key);

		requestAnimationFrame(() => {
			if (title.scrollWidth > title.clientWidth) {
				tab.title = AppState.sets[key].title;
			} else {
				tab.removeAttribute("title");
			}
		});

		tab.onclick = () => {
			AppState.active = key;
			saveStorage({ activeSet: key });
			Tab.renderTabs();
			ButtonRenderer.renderButtons();
		};

		const editBtn = document.createElement("button");
		editBtn.className = "edit-tab-btn";
		editBtn.textContent = "✖";

		editBtn.onclick = (e) => {
			e.stopPropagation();

			const setName = AppState.sets[key]?.title || key;
			if (!confirm(`マイセット「${setName}」を削除しますか？\nこの操作は元に戻せません。`)) return;

			delete AppState.sets[key];

			if (AppState.active === key) {
				const remainKeys = Object.keys(AppState.sets);
				AppState.active = remainKeys[0] || null;
			}

			saveStorage({ sets: AppState.sets, activeSet: AppState.active });
			Tab.renderTabs();
			ButtonRenderer.renderButtons();
		};

		// // drag
		// tab.addEventListener("dragstart", (e) => {
		// 	e.dataTransfer.setData("text/plain", key);
		// });

		// tab.addEventListener("drop", (e) => {
		// 	e.preventDefault();
		// 	const draggedKey = e.dataTransfer.getData("text/plain");
		// 	Tab.Reorder.reorder(draggedKey, key);
		// 	saveStorage({ sets: AppState.sets });
		// 	Tab.Renderer.render();
		// });

		// -----------------------
		// ドラッグ処理
		// -----------------------
		tab.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("text/plain", key);
			tab.classList.add("dragging");
		});

		tab.addEventListener("dragend", () => {
			tab.classList.remove("dragging");
		});

		tab.addEventListener("dragover", (e) => {
			e.preventDefault();
		});

		tab.addEventListener("drop", (e) => {
			e.preventDefault();
			const draggedKey = e.dataTransfer.getData("text/plain");
			if (draggedKey === key) return;

			Tab.Reorder.reorder(draggedKey, key);
			saveStorage({ sets: AppState.sets });
			Tab.Renderer.render();
		});

		tab.appendChild(title);
		tab.appendChild(editBtn);
		tabsEl.appendChild(tab);
	});

	const addBtn = document.createElement("button");
	addBtn.id = "addTabBtn";
	addBtn.textContent = "＋";
	addBtn.onclick = Tab.Creator.createPrompt;
	tabsEl.appendChild(addBtn);
};