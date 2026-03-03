Memo.init = function () {
	// DOM取得
	Memo.select = document.getElementById("memoSelect");
	Memo.textarea = document.getElementById("memoTextarea");
	Memo.addBtn = document.getElementById("addMemoBtn");
	Memo.deleteBtn = document.getElementById("deleteMemoBtn");
	Memo.copyBtn = document.getElementById("copyMemoBtn");
	Memo.clearBtn = document.getElementById("clearMemoBtn");
	Memo.pad = document.getElementById("memoPad");
	Memo.resizeHandle = document.getElementById("memoResizeHandle");
	Memo.templateContainer = document.getElementById("memoTemplateContainer");
	Memo.templateBtn = document.getElementById("templateBtn");

	Memo.memoExecuteBtn  = document.getElementById("memoExecuteBtn");

	// 初期描画
	Memo.renderSelect();
	Memo.loadActive();
	Memo.initResize();
	Memo.renderTemplates();

	// イベント
	Memo.select.onchange = () => {
		Memo.data.activeMemo = Memo.select.value;
		Memo.loadActive();
	};

	let timer;
	Memo.textarea.oninput = () => {
		clearTimeout(timer);
		timer = setTimeout(Memo.save, 300);
	};

	Memo.addBtn.onclick = Memo.add;
	Memo.deleteBtn.onclick = Memo.delete;
	Memo.copyBtn.onclick = Memo.copy;
	Memo.clearBtn.onclick = Memo.clear;
	Memo.select.ondblclick = Memo.rename;

	//memo作成
	Memo.templateBtn.onclick = () => {
		const name = prompt("ボタン名（最大5文字）")?.trim().substring(0, 5);
		if (!name) return;

		if (Memo.templates.some(t => t.name === name)) {
			return alert("同名あり");
		}

		if (Memo.templates.length >= 3) {
			return alert("定型文は3つまで");
		}

		const text = Memo.textarea.value;
		Memo.templates.push({ name, text });
		Memo.saveTemplates();
	};

	// メモ変換実行関数
	Memo.memoExecuteBtn.onclick = () => {
		const memo = Memo.textarea.value;
		const parsed = Memo.parseSmart(memo);

		if (!parsed) {
			alert("メモが空です");
			return;
		}

		// MySet生成モード
		if (parsed.isMyset) {
			const name = parsed.setName;

			if (!name) return alert("myset 名が指定されていません");

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
			ButtonRenderer.renderButtons();

			alert(`マイセット "${name}" を生成しました（ボタン ${parsed.buttons.length} 件）`);
			return;
		}

		// 通常ボタン追加
		if (!parsed.buttons.length) {
			return alert("有効なURLが見つかりません");
		}

		const currentSet = AppState.sets[AppState.active];
		currentSet.buttons.push(...parsed.buttons);

		saveStorage({ sets: AppState.sets });
		ButtonRenderer.renderButtons();
	};

	//memoコピー
	// Ctrl+A shortcut
	Memo.textarea.addEventListener("keydown", e => {
		if (e.ctrlKey && e.key === "a") Memo.copyBtn.click();
	});
	
};

document.addEventListener("DOMContentLoaded", Memo.init);

