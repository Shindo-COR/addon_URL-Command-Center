// memo/memoParser.js
Memo.parseSmart = function (text) {
	const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
	if (!lines.length) return null;

	const first = lines[0];
	const mysetMatch = first.match(/^myset\s+(.+)/i);

	// g フラグ必須（複数URL対応）
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
		if (!label) {
			label = url.replace(/^https?:\/\//, "").split("/")[0];
		}

		buttons.push({
			label,
			url,
			color: "#6b7cff"
		});
	}

	return {
		isMyset: !!mysetMatch,
		setName,
		buttons
	};
};