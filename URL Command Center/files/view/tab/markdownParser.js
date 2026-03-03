window.Tab = window.Tab || {};
Tab.Markdown = {};

Tab.Markdown.parse = function (md) {
	if (!md) return {};

	const cfg = window.DEFAULT_CONFIG;
	const map = {};

	const rules = cfg.markdownLinkRules.sort(
		(a, b) => (b.priority || 0) - (a.priority || 0)
	);
	
	// =========================
	// 1: セクション解析
	// =========================
	const sections = md.split(/(?:^|\n)#{2,}\s+/);

	for (const sec of sections) {
		const title = sec.split("\n")[0]?.trim() || "";
		const urls = sec.match(/https?:\/\/[^\s)]+/g);
		if (!urls) continue;

		Tab.Markdown.applyRules(title, urls, rules, map);
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

		const context = prev || prev2;
		if (!context) continue;

		Tab.Markdown.applyRules(context, [url], rules, map);
	}

	return map;
};

Tab.Markdown.applyRules = function (title, urls, rules, map) {
	for (const rule of rules) {
		const matchRegex = new RegExp(rule.matchTitle);
		if (!matchRegex.test(title)) continue;
		if (rule.exclude && rule.exclude.test(title)) continue;

		let url = urls[0];
		if (rule.pickUrl) {
			url = urls.find(u => rule.pickUrl.test(u)) || url;
		}

		if (!map[rule.label]) {
			map[rule.label] = url;
		}
	}
};