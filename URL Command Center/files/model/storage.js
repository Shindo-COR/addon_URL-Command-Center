window.initStorage = function(callback) {
chrome.storage.local.get(null, data => {
	if (!data.sets) {
	chrome.storage.local.set(window.DEFAULT_CONFIG, callback);
	} else {
	callback();
	}
});
};

window.getStorage = function(callback) {
chrome.storage.local.get(null, callback);
};

window.saveStorage = function(data) {
chrome.storage.local.set(data);
};

