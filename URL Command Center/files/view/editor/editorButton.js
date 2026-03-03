window.EditorButton = {};

EditorButton.drawRows = function() {
	const btnEditor = document.getElementById("btnEditor");
	const set = Editor.set;
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

		row.querySelector(".label").oninput = e => b.label = e.target.value;
		row.querySelector(".url").oninput = e => b.url = e.target.value;
		row.querySelector(".color").oninput = e => b.color = e.target.value;

		row.querySelector(".delete").onclick = () => {
			if (!confirm("このボタンを削除しますか？")) return;
			set.buttons.splice(i, 1);
			EditorButton.drawRows();
		};

		row.querySelector(".duplicate").onclick = () => {
			const clone = JSON.parse(JSON.stringify(b));
			clone.label += "（コピー）";
			set.buttons.splice(i + 1, 0, clone);
			EditorButton.drawRows();
		};

		btnEditor.appendChild(row);
	});

	EditorSortable.init();
};

EditorButton.bindAddButton = function() {
	document.getElementById("addBtn").onclick = () => {
		Editor.set.buttons.push({ label:"", url:"", color:"#f19dc3" });
		EditorButton.drawRows();
	};
};