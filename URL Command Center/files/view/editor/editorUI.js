window.EditorUI = {};
EditorUI.renderLayout = function() {
	const set = Editor.set;

	Editor.content.innerHTML = `
	<div class="tab-header">
		<div class="tab-title-area">
			<label id="tabName">タブ名</label><br>
			<input id="tabTitle" value="${set.title}">
		</div>

		<div class="tab-menu-area">
			<button id="tabMenuBtn" class="tab-menu-btn">⋯</button>

			<div id="tabMenu" class="tab-menu hidden">
				<button id="duplicateTab">タブの複製</button>
				<button id="deleteTab">タブの削除</button>
			</div>
		</div>
	</div>

	<hr>

	<div style="font-weight:bold">アクセスURLリスト</div>
	<div id="btnEditor"></div>
	<button id="addBtn">＋ URL追加</button>
	`;
};

EditorUI.bindMenu = function() {
	const btn = document.getElementById("tabMenuBtn");
	const menu = document.getElementById("tabMenu");

	// 開閉トグル
	btn.onclick = (e) => {
		e.stopPropagation();
		menu.classList.toggle("hidden");
	};

	// メニュー内クリックは伝播させない
	menu.onclick = (e) => {
		e.stopPropagation();
	};

	// 外クリックで閉じる（条件付き）
	document.addEventListener("click", (e) => {
		if (!menu.contains(e.target) && e.target !== btn) {
			menu.classList.add("hidden");
		}
	});
};