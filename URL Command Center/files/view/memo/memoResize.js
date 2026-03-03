Memo.initResize = function () {
	const key = "memoPadHeight";
	const saved = localStorage.getItem(key);
	if (saved) Memo.pad.style.height = saved + "px";

	let startY, startHeight;

	Memo.resizeHandle.onmousedown = e => {
		startY = e.clientY;
		startHeight = Memo.pad.offsetHeight;

		document.onmousemove = move;
		document.onmouseup = stop;
	};

	function move(e) {
		const h = Math.max(160, startHeight + (e.clientY - startY));
		Memo.pad.style.height = h + "px";
	}

	function stop() {
		document.onmousemove = null;
		document.onmouseup = null;
		localStorage.setItem(key, Memo.pad.offsetHeight);
	}
};