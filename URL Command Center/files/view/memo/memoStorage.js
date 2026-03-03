Memo.save = function () {
	localStorage.setItem(Memo.STORAGE_KEY, JSON.stringify(Memo.data));
};