window.initSortableMainButtons = function (container) {
	if (typeof Sortable === "undefined") return;
	if (container._sortable) container._sortable.destroy();

	container._sortable = Sortable.create(container, {
		animation: 150,
		ghostClass: "dragging",
		draggable: ".main-url-btn",

		onStart: () => {
			Tooltip.hide(); 
		},

		onEnd: (evt) => {
			Tooltip.hide(); 

			const buttons = AppState.sets[AppState.active].buttons;
			const moved = buttons.splice(evt.oldIndex, 1)[0];
			buttons.splice(evt.newIndex, 0, moved);

			saveStorage({ sets: AppState.sets });
			ButtonRenderer.renderButtons();
		},
	});
};