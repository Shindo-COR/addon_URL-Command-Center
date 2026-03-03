window.startAutoSave = function() {
document.addEventListener("input", e => {
	if (!document.getElementById("editorPanel").classList.contains("open")) return;

	const key = AppState.active;
	const set = AppState.sets[key];

	set.title = document.getElementById("tabTitle")?.value || set.title;

	const rows = document.querySelectorAll("#btnEditor .row");
	set.buttons = [...rows].map(r => ({
	label: r.querySelector(".label").value,
	url: r.querySelector(".url").value,
	color: r.querySelector(".color").value
	}));

	saveStorage({ sets: AppState.sets });
});
};
