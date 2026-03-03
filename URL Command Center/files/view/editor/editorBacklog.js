window.EditorBacklog = {};

EditorBacklog.render = function(key) {
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
			// drawRows();
			EditorButton.drawRows();
			// renderButtons();
			ButtonRenderer.renderButtons();

			input.value = "";
			updatePreview();
		};

		editorPanel.prepend(wrap);
};


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