window.openEditor = function(key) {
	const panel = document.getElementById("editorPanel");
	const content = document.getElementById("editorContent");
	panel.classList.add("open");

	const set = AppState.sets[key];

	// エディタ画面HTML
	content.innerHTML = `
		<label>タブ名</label>
		<br>
		<input id="tabTitle" value="${set.title}">
		<button id="duplicateTab">タブの複製</button>
		<button id="deleteTab">タブの削除</button>
		<button id="resetTab">初期化</button>
		<hr>
		<div style="font-weight:bold">アクセスURLリスト</div>
		<div id="btnEditor"></div>
		<button id="addBtn">＋ URL追加</button>
	`;

	const btnEditor = document.getElementById("btnEditor");

	//バックログ自動入力
	// ===============================
	// Backlog Auto Generator 
	// ===============================
	function renderBacklogGenerator(key) {
		const editorPanel = document.getElementById("editorPanel");
		if (!editorPanel) return;

		const old = document.getElementById("backlogGenerator");
		if (old) old.remove();

		const wrap = document.createElement("div");
		wrap.id = "backlogGenerator";
		wrap.className = "backlog-generator";

		const title = document.createElement("div");
		title.className = "backlog-title";
		title.textContent = "バックログ自動入力（Enterで追加）";
		wrap.appendChild(title);

		const templates = window.DEFAULT_CONFIG.backlogTemplates;
		let activeTemplateKey = Object.keys(templates)[0];

		// テンプレートボタン
		const templateWrap = document.createElement("div");
		templateWrap.className = "backlog-template-wrap";

		Object.keys(templates).forEach(k => {
			const btn = document.createElement("button");
			btn.textContent = templates[k].labelName;
			btn.className = "backlog-template-btn";
			if (k === activeTemplateKey) btn.classList.add("active");

			btn.onclick = () => {
			activeTemplateKey = k;
			document.querySelectorAll(".backlog-template-btn").forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			updatePreview();
			};

			templateWrap.appendChild(btn);
		});

		wrap.appendChild(templateWrap);

		// 番号入力
		const input = document.createElement("input");
		input.type = "number";
		input.placeholder = "Backlog番号（例: 1728）Enterで追加";
		input.className = "backlog-input";
		wrap.appendChild(input);

		// プレビュー
		const preview = document.createElement("div");
		preview.className = "backlog-preview";
		wrap.appendChild(preview);

		function buildLabel(tpl, num) {
			return `${tpl.labelPrefix}${num}`;
		}

		function buildURL(tpl, num) {
			return tpl.pattern.replace(/X+/g, num);
		}

		function updatePreview() {
			const num = input.value;
			if (!num) return preview.textContent = "";

			const tpl = templates[activeTemplateKey];
			preview.textContent = `${buildLabel(tpl, num)} → ${buildURL(tpl, num)}`;
		}

		input.oninput = updatePreview;

		// Enterで追加
		input.onkeydown = async (e) => {
			if (e.key !== "Enter") return;
			const num = input.value.trim();
			if (!num) return;

			const tpl = templates[activeTemplateKey];
			let label = buildLabel(tpl, num);
			const url = buildURL(tpl, num);
			const color = tpl.color || "#FF8DAB";

			//  Backlogタイトル取得（オプション）
			const title = await fetchBacklogTitle(label);
			if (title) label = `${label} ${title}`;

			AppState.sets[key].buttons.push({ label, url, color });

			saveStorage({ sets: AppState.sets });
			drawRows();
			renderButtons();

			input.value = "";
			updatePreview();
		};

		editorPanel.prepend(wrap);
	}
	// Backlogの課題タイトルをAPIから取得
	async function fetchBacklogTitle(issueKey) {
		try {
			const cfg = window.DEFAULT_CONFIG.backlogApi;
			if (!cfg?.apiKey) return null;

			const url = `https://${cfg.space}.backlog.com/api/v2/issues/${issueKey}?apiKey=${cfg.apiKey}`;
			const res = await fetch(url);
			if (!res.ok) return null;

			const data = await res.json();
			return data.summary;
		} catch (e) {
			console.warn("Backlog API failed", e);
			return null;
		}
	}

	renderBacklogGenerator(key);


	// ボタン行描画
	function drawRows() {
		btnEditor.innerHTML = "";

		set.buttons.forEach((b, i) => {
			const row = document.createElement("div");
			row.className = "row";
			row.dataset.index = i;

			row.innerHTML = `
			<span class="drag-handle">☰</span>
			<input class="label" placeholder="ボタン名" value="${b.label}">
			<input class="url" placeholder="URL" value="${b.url}">
			<input type="color" class="color" value="${b.color}">
			<button class="duplicate">⇩</button>
			<button class="delete">×</button>
			`;

			// 入力反映
			row.querySelector(".label").oninput = e => b.label = e.target.value;
			row.querySelector(".url").oninput = e => b.url = e.target.value;
			row.querySelector(".color").oninput = e => b.color = e.target.value;

			// 削除
			row.querySelector(".delete").onclick = () => {
			if (!confirm("このボタンを削除しますか？")) return;
			set.buttons.splice(i, 1);
			drawRows();
			};

			// 複製
			row.querySelector(".duplicate").onclick = () => {
			const clone = JSON.parse(JSON.stringify(b));
			clone.label += "（コピー）";
			set.buttons.splice(i + 1, 0, clone);
			drawRows();
			};

			btnEditor.appendChild(row);
		});

		initSortable(); // ← 並び替え有効化
	}
	function initSortable() {
		new Sortable(btnEditor, {
			handle: ".drag-handle",
			animation: 150,
			ghostClass: "drag-ghost",
			onEnd: function (evt) {
			const moved = set.buttons.splice(evt.oldIndex, 1)[0];
			set.buttons.splice(evt.newIndex, 0, moved);
			drawRows(); // 再描画してindex更新
			}
		});
	}
	drawRows();

	// URL追加
	document.getElementById("addBtn").onclick = () => {
		set.buttons.push({ label:"", url:"", color:"#f19dc3" });
		drawRows();
	};

	// 複製
	const duplicateBtn = document.getElementById("duplicateTab");
	duplicateBtn.onclick = () => {
		const keys = Object.keys(AppState.sets);
		if (keys.length >= AppState.MAX_TABS) return;
		const newKey = "set" + Date.now();
		const cloned = JSON.parse(JSON.stringify(set));
		cloned.title += " (copy)";
		AppState.sets[newKey] = cloned;
		AppState.active = newKey;
		saveStorage({ sets: AppState.sets, activeSet: AppState.active });
		closeEditorPanel();
		// renderTabs();
		Tab.renderTabs();
		renderButtons();
	};

	// 削除
	const deleteBtn = document.getElementById("deleteTab");
	deleteBtn.onclick = () => {
		const keys = Object.keys(AppState.sets);
		if (keys.length <= AppState.MIN_TABS) {
			alert("最低1つのタブが必要です");
			return;
		}

		const tabTitle = AppState.sets[key]?.title || key;
		const ok = confirm(`タブ「${tabTitle}」を削除しますか？\n中のボタンもすべて消えます。`);

		if (!ok) return;

		delete AppState.sets[key];
		AppState.active = Object.keys(AppState.sets)[0];
		saveStorage({ sets: AppState.sets, activeSet: AppState.active });
		closeEditorPanel();
		// renderTabs();
		Tab.renderTabs();
		renderButtons();
	};

	// 初期化（全タブを defaultConfig の状態に戻す）
		document.getElementById("resetTab").onclick = () => {
		if (!confirm("全タブを初期状態にリセットしますか？\n編集内容は失われます。")) return;

		// DEFAULT_CONFIG の sets を丸ごとコピー
		AppState.sets = JSON.parse(JSON.stringify(window.DEFAULT_CONFIG.sets));
		AppState.active = window.DEFAULT_CONFIG.activeSet || Object.keys(AppState.sets)[0];

		// UI 即時反映
		// renderTabs()
		Tab.renderTabs();
		renderButtons();

		// 編集画面を閉じる
		closeEditorPanel();

		// 保存
		saveStorage({ sets: AppState.sets, activeSet: AppState.active });
		};

	// 編集を閉じる
	document.getElementById("close-btn").onclick = () => {
		set.title = document.getElementById("tabTitle").value;
		const rows = document.querySelectorAll("#btnEditor .row");
		set.buttons = [...rows].map(r => ({
		label: r.querySelector(".label").value,
		url: r.querySelector(".url").value,
		color: r.querySelector(".color").value
		}));
		saveStorage({ sets: AppState.sets });
		// renderTabs();
		Tab.renderTabs();
		renderButtons();
		closeEditorPanel();
	};
};

function closeEditorPanel() {
document.getElementById("editorPanel").classList.remove("open");
}
