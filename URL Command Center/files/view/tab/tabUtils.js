// ============================
// prefix 抽出
// ============================
window.Tab = window.Tab || {};
Tab.Utils = {};

Tab.Utils.extractPrefix = function (pattern) {
	const cfg = window.DEFAULT_CONFIG;
	if (!cfg?.tabPrefixRegex || !cfg?.tabPrefixPathHint) return null;

	const idx = pattern.indexOf(cfg.tabPrefixPathHint);
	if (idx === -1) return null;

	const sub = pattern.slice(idx);
	const regex = new RegExp(cfg.tabPrefixRegex);
	const m = sub.match(regex);
	return m ? m[1] : null;
}