Memo.MemoTxt = (function () {

	async function downloadTxt() {
		const text = Memo.textarea.value || "";

		if (!text.trim()) {
			alert("メモが空です");
			return;
		}

		try {
			const suggestedName = `${Memo.data.activeMemo || "memo"}.txt`;

			const handle = await window.showSaveFilePicker({
				suggestedName,
				types: [
					{
						description: "Text Files",
						accept: { "text/plain": [".txt"] }
					}
				]
			});

			const writable = await handle.createWritable();
			await writable.write(text);
			await writable.close();

		} catch (err) {
			// キャンセル時は何もしない
			if (err.name !== "AbortError") {
				console.error(err);
				alert("保存に失敗しました");
			}
		}
	}

	return {
		download: downloadTxt
	};

})();