// =====================
// メモ帳定型文機能
// =====================
Memo.TEMPLATE_STORAGE_KEY = "memoTemplates";

// 初期読み込み
Memo.templates = JSON.parse(localStorage.getItem(Memo.TEMPLATE_STORAGE_KEY));

// localStorage になければ defaultconfig を初期値に
if (!Memo.templates || Memo.templates.length === 0) {
	Memo.templates = [...(window.DEFAULT_CONFIG.memoTemplates || [])];
	localStorage.setItem(Memo.TEMPLATE_STORAGE_KEY, JSON.stringify(Memo.templates));
}

// 保存
Memo.saveTemplates = function () {
	localStorage.setItem(Memo.TEMPLATE_STORAGE_KEY, JSON.stringify(Memo.templates));
	Memo.renderTemplates();
};

// 描画
Memo.renderTemplates = function () {
	Memo.templateContainer.innerHTML = "";

	Memo.templates.forEach((tpl, index) => {
		const btn = document.createElement("button");
		btn.className = "memo-template-btn";

		const span = document.createElement("span");
		span.textContent = tpl.name;
		btn.appendChild(span);

		// 削除ボタン
		const del = document.createElement("span");
		del.className = "delete-template-btn";
		del.textContent = "✖";
		del.onclick = (e) => {
			e.stopPropagation();
			Memo.templates.splice(index, 1);
			Memo.saveTemplates();
		};
		btn.appendChild(del);

		// クリックでメモ挿入
		btn.onclick = () => {
			Memo.textarea.value = tpl.text;
			Memo.save();
		};

		Memo.templateContainer.appendChild(btn);
	});
};