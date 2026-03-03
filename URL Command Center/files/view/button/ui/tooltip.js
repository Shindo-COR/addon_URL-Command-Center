window.Tooltip = {};

Tooltip.init = function() {
	if (Tooltip.el) return; // 二重生成防止

	Tooltip.el = document.createElement("div");
	Tooltip.el.className = "url-tooltip";
	document.body.appendChild(Tooltip.el);
};

Tooltip.show = (text, x, y) => {
	Tooltip.init();
	Tooltip.el.textContent = text;
	Tooltip.el.style.opacity = 1;
	Tooltip.move(x, y);
};

Tooltip.move = (x, y) => {
	Tooltip.el.style.left = x + 10 + "px";
	Tooltip.el.style.top = y + 10 + "px";
};

Tooltip.hide = () => {
	if (!Tooltip.el) return;
	Tooltip.el.style.opacity = 0;
};