window.Tab = window.Tab || {};
Tab.Renderer = {};

Tab.Renderer.render = function () {
	const tabsEl = document.getElementById("tabs");
	tabsEl.innerHTML = "";

	const keys = AppState.tabOrder || [];

	keys.forEach((key) => {
		// 万が一 sets に存在しないキーがあればスキップ
		if (!AppState.sets[key]) return;

		const tab = document.createElement("div");
		tab.className = "tab";
		tab.draggable = true;

		if (key === AppState.active) {
			tab.classList.add("active");
		}

		// =====================
		// タイトル
		// =====================
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

		// =====================
		// タブクリック
		// =====================
		tab.onclick = () => {
			AppState.active = key;

			saveStorage({
				activeSet: key
			});

			Tab.renderTabs();
			ButtonRenderer.renderButtons();
		};

		// =====================
		// 削除ボタン
		// =====================
		const editBtn = document.createElement("button");
		editBtn.className = "edit-tab-btn";
		editBtn.textContent = "✖";

		editBtn.onclick = (e) => {
			e.stopPropagation();

			const setName = AppState.sets[key]?.title || key;
			if (!confirm(`マイセット「${setName}」を削除しますか？\nこの操作は元に戻せません。`)) return;

			delete AppState.sets[key];

			// tabOrderから削除
			AppState.tabOrder = AppState.tabOrder.filter(k => k !== key);

			// active調整（tabOrder基準にする）
			if (AppState.active === key) {
				AppState.active = AppState.tabOrder[0] || null;
			}

			saveStorage({
				sets: AppState.sets,
				activeSet: AppState.active,
				tabOrder: AppState.tabOrder
			});

			Tab.renderTabs();
			ButtonRenderer.renderButtons();
		};

		// =====================
		// ドラッグ処理
		// =====================
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
			saveStorage({
				sets: AppState.sets,
				tabOrder: AppState.tabOrder
			});

			Tab.renderTabs();
		});

		tab.appendChild(title);
		tab.appendChild(editBtn);
		tabsEl.appendChild(tab);
	});

	// =====================
	// ＋追加ボタン
	// =====================
	const addBtn = document.createElement("button");
	addBtn.id = "addTabBtn";
	addBtn.textContent = "＋";
	addBtn.onclick = Tab.Creator.createPrompt;
	tabsEl.appendChild(addBtn);
};