// ============================
// タブ追加処理
// ============================
window.Tab = window.Tab || {};
Tab.Creator = {};

Tab.Creator.createPrompt = async function () {
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
		Tab.Renderer.render();
		return;
	}

  // =========================
  // Backlog案件モード
  // =========================
	const issueKey = normalizedKey;
	const issueData = await Tab.Api.fetchIssue(issueKey);
	const buttons = [];

	// Backlog本体ボタン
	buttons.push({
		label: issueKey + (issueData?.summary ? " " + issueData.summary : ""),
		url: matchedTpl.pattern.replace(/X+/g, issueNumber),
		color: matchedTpl.color || "#2B8269",
	});

	// Markdown解析
	const extracted = Tab.Markdown.parse(issueData?.description ?? "");

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
	Tab.renderTabs();
}