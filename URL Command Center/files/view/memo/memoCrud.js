Memo.add = function () {
	const name = prompt("メモ名を入力");
	if (!name) return;
	Memo.data.memos[name] = "";
	Memo.data.activeMemo = name;
	Memo.renderSelect();
	Memo.loadActive();
	Memo.save();
};

Memo.rename = function () {
	const oldName = Memo.data.activeMemo;
	if (oldName === "memo1") return alert("memo1は変更不可");

	const newName = prompt("新しい名前", oldName)?.trim();
	if (!newName) return;
	if (Memo.data.memos[newName]) return alert("既に存在");

	Memo.data.memos[newName] = Memo.data.memos[oldName];
	delete Memo.data.memos[oldName];
	Memo.data.activeMemo = newName;

	Memo.save();
	Memo.renderSelect();
	Memo.loadActive();
};

Memo.delete = function () {
	if (Memo.data.activeMemo === "memo1") return alert("memo1は削除不可");
	delete Memo.data.memos[Memo.data.activeMemo];
	Memo.data.activeMemo = "memo1";
	Memo.renderSelect();
	Memo.loadActive();
	Memo.save();
};

Memo.copy = function () {
	Memo.textarea.select();
	document.execCommand("copy");
	Memo.copyBtn.textContent = "✓ コピー完了";
	setTimeout(() => Memo.copyBtn.textContent = "コピー (Ctrl+Aでも可)", 1500);
};

Memo.clear = function () {
	Memo.textarea.value = "";
	Memo.save();
};

