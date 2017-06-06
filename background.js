chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name == 'screenshot') {
        chrome.tabs.captureVisibleTab(null, null, function(dataUrl) {
            sendResponse({ screenshotUrl: dataUrl });
        });
    }
    return true;
});

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase() == 'x-frame-options') {
        details.responseHeaders.splice(i, 1);
        return {
          responseHeaders: details.responseHeaders
        };
      }
    }
  }, {
    urls: ["<all_urls>"]
  }, ["blocking", "responseHeaders"]);


var opened = false;
var panel = 0;
chrome.browserAction.onClicked.addListener(function() {
	if (opened === false) {
	opened = true;

	/*chrome.windows.create({
	  url: "http://www.naver.com/",
	  type: "panel",
	  focused: true,
	  width: 150,
	  height: 162
	},
	  function(window) {panel = window.id}*/


	)}
	else if (opened === true) { chrome.windows.update(panel, {focused: true}) }
	chrome.windows.onRemoved.addListener(function(windowId) {
	if (windowId == panel) {
	  panel = 0;
	  opened = false
	}});
});

