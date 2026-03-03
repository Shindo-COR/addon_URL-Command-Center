const memoSelect = document.getElementById("memoSelect");
const memoTextarea = document.getElementById("memoTextarea");
const addMemoBtn = document.getElementById("addMemoBtn");
const deleteMemoBtn = document.getElementById("deleteMemoBtn");
const copyMemoBtn = document.getElementById("copyMemoBtn");
const clearMemoBtn = document.getElementById("clearMemoBtn");
const memoToButtonBtn = document.getElementById("memoToButtonBtn");

// 初期データ 
const STORAGE_KEY = "urlCommandCenterMemoMulti";
let memoData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
	memos: { "memo1": "" },
	activeMemo: "memo1"
};

// UI再描画 
function renderMemoSelect() {
	memoSelect.innerHTML = "";
	Object.keys(memoData.memos).forEach(key => {
		const opt = document.createElement("option");
		opt.value = key;
		opt.textContent = key;
		memoSelect.appendChild(opt);
	});
	memoSelect.value = memoData.activeMemo;
}

//  メモロード 
function loadActiveMemo() {
	memoTextarea.value = memoData.memos[memoData.activeMemo] || "";
}

//  保存 
function saveMemo() {
	memoData.memos[memoData.activeMemo] = memoTextarea.value;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(memoData));
}

// 初期表示
renderMemoSelect();
loadActiveMemo();

// 切替
memoSelect.onchange = () => {
	memoData.activeMemo = memoSelect.value;
	loadActiveMemo();
};

// 入力保存（debounce）
let memoTimer;
memoTextarea.oninput = () => {
	clearTimeout(memoTimer);
	memoTimer = setTimeout(saveMemo, 300);
};

// ===============================
// メモ帳とテキストエリアのリサイズ
// ===============================
const memoPad = document.getElementById("memoPad");
const resizeHandle = document.getElementById("memoResizeHandle");

// 保存キー
const MEMO_HEIGHT_KEY = "memoPadHeight";

// 初期高さ復元
const savedHeight = localStorage.getItem(MEMO_HEIGHT_KEY);
if (savedHeight) {
	memoPad.style.height = savedHeight + "px";
}

let startY = 0;
let startHeight = 0;

resizeHandle.addEventListener("mousedown", e => {
	startY = e.clientY;
	startHeight = memoPad.offsetHeight;

	document.addEventListener("mousemove", resizeMemoPad);
	document.addEventListener("mouseup", stopResize);
});

function resizeMemoPad(e) {
	const diff = e.clientY - startY;
	const newHeight = Math.max(160, startHeight + diff);
	memoPad.style.height = newHeight + "px";
}

function stopResize() {
	document.removeEventListener("mousemove", resizeMemoPad);
	document.removeEventListener("mouseup", stopResize);
		// 高さ保存
	localStorage.setItem(MEMO_HEIGHT_KEY, memoPad.offsetHeight);
}


// ===============================
// メモ帳とテキストエリアリサイズ End
// ===============================

// 追加
addMemoBtn.onclick = () => {
	const name = prompt("メモ名を入力");
	if (!name) return;
	memoData.memos[name] = "";
	memoData.activeMemo = name;
	renderMemoSelect();
	loadActiveMemo();
	saveMemo();
};

//メモ名の変更
memoSelect.ondblclick = () => {
	const oldName = memoData.activeMemo;
	if (oldName === "memo1") {
		alert("memo1 は名前変更できません");
		return;
	}

	const newName = prompt("新しいメモ名を入力", oldName);
	if (!newName) return;

	const trimmed = newName.trim();
	if (!trimmed) return alert("空の名前は使えません");

	if (memoData.memos[trimmed]) {
		return alert("同じ名前のメモが既に存在します");
	}

	// データキー変更
	memoData.memos[trimmed] = memoData.memos[oldName];
	delete memoData.memos[oldName];

	// active 更新
	memoData.activeMemo = trimmed;


	saveMemo();
	renderMemoSelect();
	loadActiveMemo();
};

// 削除
deleteMemoBtn.onclick = () => {
	if (memoData.activeMemo === "memo1") return alert("memo1は削除できません");
	delete memoData.memos[memoData.activeMemo];
	memoData.activeMemo = "memo1";
	renderMemoSelect();
	loadActiveMemo();
	saveMemo();
};

// コピー
copyMemoBtn.onclick = () => {
	memoTextarea.select();
	document.execCommand("copy");
	copyMemoBtn.textContent = "✅ コピーしました";
	setTimeout(() => copyMemoBtn.textContent = "コピー(Ctrl+Cでも可)", 1500);
};

// クリア
clearMemoBtn.onclick = () => {
	memoTextarea.value = "";
	saveMemo();
};

// Ctrl+A shortcut
memoTextarea.addEventListener("keydown", e => {
	if (e.ctrlKey && e.key === "a") copyMemoBtn.click();
});

// ===============================
// メモから複数ボタン一括追加
// ===============================
// ボタン or myset 両対応
function parseMemoSmart(text) {
	const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
	if (!lines.length) return null;

	const first = lines[0];
	const mysetMatch = first.match(/^myset\s+(.+)/i);

	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const buttons = [];

	const startIndex = mysetMatch ? 1 : 0;
	const setName = mysetMatch ? mysetMatch[1].trim() : null;

	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i];
		const urls = line.match(urlRegex);
		if (!urls) continue;

		const url = urls[0];
		let label = line.replace(url, "").trim();
		if (!label) label = url.replace(/^https?:\/\//, "").split("/")[0];

		buttons.push({
		label,
		url,
		color: "#6b7cff"
		});
	}

	return { isMyset: !!mysetMatch, setName, buttons };
}

// メモ変換実行関数
function executeMemo() {
	const memo = memoTextarea.value;
	const parsed = parseMemoSmart(memo);
	if (!parsed) {
		alert("メモが空です");
		return;
	}

	// =====================
	// MySet生成モード（ボタンなしでもOK）
	// =====================
	if (parsed.isMyset) {
		const name = parsed.setName;

		if (!name) {
		alert("myset 名が指定されていません");
		return;
		}

		if (AppState.sets[name]) {
		if (!confirm(`"${name}" は既に存在します。上書きしますか？`)) return;
		}

		AppState.sets[name] = {
		title: name,
		buttons: parsed.buttons || []
		};

		AppState.active = name;
		saveStorage({ sets: AppState.sets, activeSet: name });
		// renderTabs();
		Tab.renderTabs();
		// renderButtons();
		ButtonRenderer.renderButtons();

		alert(`マイセット "${name}" を生成しました（ボタン ${parsed.buttons.length} 件）`);
		return;
	}

	// =====================
	// 通常ボタン追加モード
	// =====================
	if (!parsed.buttons.length) {
		alert("有効なURLが見つかりません");
		return;
	}

	const currentSet = AppState.sets[AppState.active];
	currentSet.buttons.push(...parsed.buttons);

	saveStorage({ sets: AppState.sets });
	// renderButtons();
	ButtonRenderer.renderButtons();

	// alert(`${parsed.buttons.length} 件のボタンを追加しました`);
}


// =====================
// メモ帳定型文機能
// =====================
const templateBtn = document.getElementById("templateBtn");
const templateContainer = document.getElementById("memoTemplateContainer");

// localStorage用 key
const TEMPLATE_STORAGE_KEY = "memoTemplates";

// 初期読み込み
let memoTemplates = JSON.parse(localStorage.getItem("memoTemplates"));
// localStorage になければ defaultconfig を初期値として反映
if (!memoTemplates || memoTemplates.length === 0) {
	memoTemplates = [...(window.DEFAULT_CONFIG.memoTemplates || [])];
	localStorage.setItem("memoTemplates", JSON.stringify(memoTemplates));
}

function saveTemplates() {
	localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(memoTemplates));
	renderTemplates();
}

// 描画関数
function renderTemplates() {
	templateContainer.innerHTML = "";

	memoTemplates.forEach((tpl, index) => {
		const btn = document.createElement("button");
		btn.className = "memo-template-btn";

		// ボタンラベルは name を表示
		const span = document.createElement("span");
		span.textContent = tpl.name; 
		btn.appendChild(span);

		// 削除ボタン
		const del = document.createElement("span");
		del.className = "delete-template-btn";
		del.textContent = "✖";
		del.onclick = (e) => {
		e.stopPropagation();
		memoTemplates.splice(index, 1);
		saveTemplates();
		renderTemplates();
		};
		btn.appendChild(del);

		// クリックでメモに挿入
		btn.onclick = () => {
		memoTextarea.value = tpl.text;
		saveMemo();
		};

		templateContainer.appendChild(btn);
	});
	}

// 「定型文としてセット」ボタン
templateBtn.onclick = () => {
	const name = prompt("ボタン名を入力（最大5文字）")?.trim().substring(0, 5);
	if (!name) return;

	// 名前の重複チェック
	if (memoTemplates.some(t => t.name === name)) {
		return alert("同じ名前のボタンがあります");
	}

	// 定型文の数制限
	if (memoTemplates.length >= 3) return alert("定型文は3つまでです");

	const text = memoTextarea.value; // 実際のメモの内容
	memoTemplates.push({ name, text });
	saveTemplates();
	renderTemplates();
};
// 初期描画
renderTemplates();

// ボタンイベント登録
const memoExecuteBtn = document.getElementById("memoExecuteBtn");
memoExecuteBtn.onclick = executeMemo;