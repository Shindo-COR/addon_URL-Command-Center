window.Memo = {};
Memo.STORAGE_KEY = "urlCommandCenterMemoMulti";

const stored = JSON.parse(localStorage.getItem(Memo.STORAGE_KEY));

Memo.data = stored || {
	memos: { memo1: "" },
	activeMemo: "memo1"
};

if (!Memo.data.memos[Memo.data.activeMemo]) {
	Memo.data.memos[Memo.data.activeMemo] = "";
}