window.Memo = {};
Memo.STORAGE_KEY = "urlCommandCenterMemoMulti";

Memo.data = JSON.parse(localStorage.getItem(Memo.STORAGE_KEY)) || {
	memos: { memo1: "" },
	activeMemo: "memo1"
};