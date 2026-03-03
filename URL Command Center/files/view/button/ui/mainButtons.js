window.MainButtons = {};

MainButtons.createMainButtonsContainer = function() {
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
			ButtonRenderer.renderButtons();
		};

		// click URL
		btn.onclick = () => b.url && chrome.tabs.create({ url: b.url });

		// Tooltip
		btn.addEventListener("mouseenter", (e) => {
			Tooltip.show(btn.dataset.url, e.pageX, e.pageY);
		});

		btn.addEventListener("mousemove", (e) => {
			Tooltip.move(e.pageX, e.pageY);
		});

		btn.addEventListener("mouseleave", () => {
			Tooltip.hide();
		});

		btn.appendChild(labelSpan);
		btn.appendChild(deleteBtn);
		mainContainer.appendChild(btn);
	});

	return mainContainer;
};