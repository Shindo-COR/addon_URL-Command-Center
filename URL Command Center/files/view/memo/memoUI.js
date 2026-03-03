Memo.renderSelect = function () {
	Memo.select.innerHTML = "";
	Object.keys(Memo.data.memos).forEach(key => {
		const opt = document.createElement("option");
		opt.value = key;
		opt.textContent = key;
		Memo.select.appendChild(opt);
	});
	Memo.select.value = Memo.data.activeMemo;
};

Memo.loadActive = function () {
	Memo.textarea.value = Memo.data.memos[Memo.data.activeMemo] || "";
};