// ============================
// Backlog API
// ============================
window.Tab = window.Tab || {};
Tab.Api = {};

Tab.Api.fetchIssue = async function (issueKey) {
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