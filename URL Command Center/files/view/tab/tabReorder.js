window.Tab = window.Tab || {};
Tab.Reorder = {};

Tab.Reorder.reorder = function(fromKey, toKey) {
	const arr = AppState.tabOrder;

	const fromIndex = arr.indexOf(fromKey);
	const toIndex = arr.indexOf(toKey);

	if (fromIndex < 0 || toIndex < 0) return;

	arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
};