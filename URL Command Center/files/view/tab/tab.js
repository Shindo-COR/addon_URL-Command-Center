// タブ描画
// ============================
window.renderTabs = function () {
	const tabsEl = document.getElementById("tabs");
	tabsEl.innerHTML = "";

	const keys = Object.keys(AppState.sets);

	keys.forEach((key) => {
		const tab = document.createElement("div");
		tab.className = "tab";
		tab.draggable = true;
		if (key === AppState.active) tab.classList.add("active");

		// タイトル
		const title = document.createElement("span");
		title.className = "tab-title";
		title.textContent = AppState.sets[key].title;
		title.ondblclick = () => openEditor(key);

		// -----------------------
		// tooltip（省略時のみ）
		// -----------------------
		requestAnimationFrame(() => {
			if (title.scrollWidth > title.clientWidth) {
				tab.title = AppState.sets[key].title;
			} else {
				tab.removeAttribute("title");
			}
		});


		// タブクリック
		tab.onclick = () => {
			AppState.active = key;
			saveStorage({ activeSet: key });
			renderTabs();
			// renderButtons();
			ButtonRenderer.renderButtons();
		};

		// 削除ボタン
		const editBtn = document.createElement("button");
		editBtn.className = "edit-tab-btn";
		editBtn.textContent = "✖";

		editBtn.onclick = (e) => {
			e.stopPropagation();

			const setName = AppState.sets[key]?.title || key;
			if (!confirm(`マイセット「${setName}」を削除しますか？\nこの操作は元に戻せません。`)) return;

			delete AppState.sets[key];

			if (AppState.active === key) {
				const remainKeys = Object.keys(AppState.sets);
				AppState.active = remainKeys[0] || null;
			}

			saveStorage({ sets: AppState.sets, activeSet: AppState.active });
			renderTabs();
			// renderButtons();
			ButtonRenderer.renderButtons();
		};

		tab.appendChild(title);
		tab.appendChild(editBtn);
		tabsEl.appendChild(tab);

		// -----------------------
		// ドラッグ処理
		// -----------------------
		tab.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("text/plain", key);
			tab.classList.add("dragging");
		});

		tab.addEventListener("dragend", () => {
			tab.classList.remove("dragging");
		});

		tab.addEventListener("dragover", (e) => {
			e.preventDefault();
		});

		tab.addEventListener("drop", (e) => {
			e.preventDefault();
			const draggedKey = e.dataTransfer.getData("text/plain");
			if (draggedKey === key) return;

			reorderTabs(draggedKey, key);
			saveStorage({ sets: AppState.sets });
			renderTabs();
		});
	});

	// ＋追加ボタン
	const addBtn = document.createElement("button");
	addBtn.id = "addTabBtn";
	addBtn.textContent = "＋";
	addBtn.onclick = createTabPrompt;
	tabsEl.appendChild(addBtn);
};

// ============================
// タブ並び替え（順序保持）
// ============================
function reorderTabs(fromKey, toKey) {
	const keys = Object.keys(AppState.sets);
	const fromIndex = keys.indexOf(fromKey);
	const toIndex = keys.indexOf(toKey);
	if (fromIndex < 0 || toIndex < 0) return;

	keys.splice(toIndex, 0, keys.splice(fromIndex, 1)[0]);

	const newSets = {};
	keys.forEach(k => newSets[k] = AppState.sets[k]);
	AppState.sets = newSets;
}
// ============================
// タブ追加処理
// ============================
async function createTabPrompt() {
	const input = prompt("新しいマイセット名を入力（例: CCA-1728 / cca1728）");
	if (!input) return;

	const raw = input.trim();
	const upper = raw.toUpperCase();
	const templates = window.DEFAULT_CONFIG.backlogTemplates;

	let matchedTpl = null;
	let issueNumber = null;
	let normalizedKey = null;

	// =========================
	// 入力正規化
	// =========================
	const m = upper.match(/^([A-Z_]+)-(\d+)$/);
	if (m) {
	normalizedKey = `${m[1]}-${m[2]}`;
	issueNumber = m[2];
	}

	// =========================
	// テンプレ判定（labelPrefix 優先）
	// =========================
	if (normalizedKey) {
	for (const tpl of Object.values(templates)) {
		if (normalizedKey.startsWith(tpl.labelPrefix)) {
		matchedTpl = tpl;
		break;
		}
	}
	}

	// =========================
	// 通常タブ
	// =========================
	if (!matchedTpl || !normalizedKey) {
		AppState.sets[raw] = { title: raw, buttons: [] };
		AppState.active = raw;
		saveStorage({ sets: AppState.sets, activeSet: raw });
		renderTabs();
		return;
	}

  // =========================
  // Backlog案件モード
  // =========================
	const issueKey = normalizedKey;
	const issueData = await fetchBacklogIssue(issueKey);
	const buttons = [];

	// Backlog本体ボタン
	buttons.push({
		label: issueKey + (issueData?.summary ? " " + issueData.summary : ""),
		url: matchedTpl.pattern.replace(/X+/g, issueNumber),
		color: matchedTpl.color || "#2B8269",
	});

	// Markdown解析
	const extracted = parseIssueMarkdown(issueData?.description ?? "");

	// テンプレ自動ボタン
	window.DEFAULT_CONFIG.autoMysetTemplate.baseButtons.forEach(b => {
		buttons.push({
		label: b.label,
		url: extracted[b.label] || "",
		color: b.color,
		});
	});

	AppState.sets[issueKey] = {
		title: issueKey,
		buttons,
	};

	AppState.active = issueKey;
	saveStorage({ sets: AppState.sets, activeSet: issueKey });
	renderTabs();
}

// ============================
// Backlog API
// ============================
async function fetchBacklogIssue(issueKey) {
	try {
		const cfg = window.DEFAULT_CONFIG.backlogApi;
		if (!cfg?.apiKey) return null;

		const url = `https://${cfg.space}.backlog.com/api/v2/issues/${issueKey}?apiKey=${cfg.apiKey}`;
		const res = await fetch(url);
		if (!res.ok) return null;
		return await res.json();
	} catch (e) {
		console.error("Backlog fetch error", e);
		return null;
	}
}

// ============================
// prefix 抽出
// ============================
function extractPrefix(pattern) {
	const cfg = window.DEFAULT_CONFIG;
	if (!cfg?.tabPrefixRegex || !cfg?.tabPrefixPathHint) return null;

	const idx = pattern.indexOf(cfg.tabPrefixPathHint);
	if (idx === -1) return null;

	const sub = pattern.slice(idx);
	const regex = new RegExp(cfg.tabPrefixRegex);
	const m = sub.match(regex);
	return m ? m[1] : null;
}

// ============================
// マークダウンから URL抽出
// ============================
function parseIssueMarkdown(md) {
	if (!md) return {};
	const cfg = window.DEFAULT_CONFIG;
	const map = {};

	const rules = cfg.markdownLinkRules.sort(
		(a, b) => (b.priority || 0) - (a.priority || 0)
	);

	// =========================
	// 1: セクション解析
	// =========================
	const sections = md.split(/\n#{2,}\s+/);

	for (const sec of sections) {
		const title = sec.split("\n")[0]?.trim() || "";
		const urls = sec.match(/https?:\/\/[^\s)]+/g);
		if (!urls) continue;

		applyRules(title, urls, rules, map);
	}

	// =========================
	// 2: URL直前行解析
	// =========================
	const lines = md.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const urlMatch = line.match(/https?:\/\/[^\s)]+/);
		if (!urlMatch) continue;

		const url = urlMatch[0];
		const prev = (lines[i - 1] || "").trim();
		const prev2 = (lines[i - 2] || "").trim();

		// context候補（前行→前々行）
		const context = prev || prev2;
		if (!context) continue;

		applyRules(context, [url], rules, map);
	}

	return map;
}


// =========================
// ルール適用共通関数
// =========================
function applyRules(title, urls, rules, map) {
	for (const rule of rules) {
		if (!rule.matchTitle.test(title)) continue;
		if (rule.exclude && rule.exclude.test(title)) continue;

		let url = urls[0];
		if (rule.pickUrl) {
		url = urls.find(u => rule.pickUrl.test(u)) || url;
		}

		// 既存ラベルが無い場合のみセット（priority制御）
		if (!map[rule.label]) {
		map[rule.label] = url;
		}
	}
}
