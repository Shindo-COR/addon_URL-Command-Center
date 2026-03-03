document.addEventListener("DOMContentLoaded", () => {
const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("sidebarToggle");

//   手動折りたたみ
toggle.addEventListener("click", () => {
	sidebar.classList.toggle("collapsed");
});

// ホバーで自動表示
sidebar.addEventListener("mouseenter", () => {
	sidebar.classList.remove("collapsed");
});

sidebar.addEventListener("mouseleave", () => {
	sidebar.classList.add("collapsed");
});

});
