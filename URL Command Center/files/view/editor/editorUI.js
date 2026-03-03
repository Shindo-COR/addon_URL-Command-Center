window.EditorUI = {};

EditorUI.renderLayout = function() {
	const set = Editor.set;
	Editor.content.innerHTML = `
	<label>タブ名</label><br>
	<input id="tabTitle" value="${set.title}">
	<button id="duplicateTab">タブの複製</button>
	<button id="deleteTab">タブの削除</button>
	<button id="resetTab">初期化</button>
	<hr>
	<div style="font-weight:bold">アクセスURLリスト</div>
	<div id="btnEditor"></div>
	<button id="addBtn">＋ URL追加</button>
	`;
};