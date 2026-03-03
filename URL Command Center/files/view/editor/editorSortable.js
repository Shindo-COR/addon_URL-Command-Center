window.EditorSortable = {};

EditorSortable.init = function() {
	const btnEditor = document.getElementById("btnEditor");
	const set = Editor.set;

	new Sortable(btnEditor, {
		handle: ".drag-handle",
		animation: 150,
		ghostClass: "drag-ghost",
		onEnd: function(evt) {
			const moved = set.buttons.splice(evt.oldIndex, 1)[0];
			set.buttons.splice(evt.newIndex, 0, moved);
			EditorButton.drawRows();
		}
	});
};