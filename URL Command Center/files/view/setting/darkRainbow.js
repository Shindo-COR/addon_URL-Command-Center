// ダークモード適用 / 解除
window.applyDarkMode = function(enable) {
const body = document.body;
if (enable) {
	body.style.backgroundColor = "#1a1a2e"; // 紺色ベース
	body.style.color = "#f0f0f0";
} else {
	body.style.backgroundColor = "";
	body.style.color = "";
}

// ボタン背景は renderButtons 側で反映されるのでここでは不要
};

// 虹色ホバー適用 / 解除
window.applyRainbowHover = function(enable) {
// 既存のボタンに hover イベントを追加
const buttonsEl = document.getElementById("buttons");
Array.from(buttonsEl.children).forEach(btn => {
	if (btn.classList.contains("close-extension-btn") || btn.classList.contains("settings-btn")) return;

	// 元の hover 削除
	btn.onmouseenter = btn.onmousemove = btn.onmouseleave = null;

	if (enable) {
	// 虹色アニメーション用
	btn.onmouseenter = () => {
		let hue = 0;
		btn._rainbowInterval = setInterval(() => {
		hue = (hue + 10) % 360;
		btn.style.background = `hsl(${hue}, 70%, 50%)`;
		}, 50);
	};
	btn.onmouseleave = () => {
		clearInterval(btn._rainbowInterval);
		btn.style.background = btn.dataset.color || "#607d8b";
	};
	} else {
	// 通常ボタン色
	btn.style.background = btn.dataset.color || "#607d8b";
	}
});
};
