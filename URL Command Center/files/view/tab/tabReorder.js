window.Tab = window.Tab || {};
Tab.Reorder = {};

Tab.Reorder.reorder = function (fromKey, toKey) {
    const keys = Object.keys(AppState.sets);
    const fromIndex = keys.indexOf(fromKey);
    const toIndex = keys.indexOf(toKey);
    if (fromIndex < 0 || toIndex < 0) return;

    keys.splice(toIndex, 0, keys.splice(fromIndex, 1)[0]);

    const newSets = {};
    keys.forEach(k => newSets[k] = AppState.sets[k]);
    AppState.sets = newSets;
};