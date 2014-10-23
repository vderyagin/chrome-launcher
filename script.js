/* global chrome */

var port = chrome.runtime.connectNative('com.vderyagin.testapp');

chrome.contextMenus.onClicked.addListener(function (info) {
  var url;

  switch (info.menuItemId) {
  case 'mpv-link':
    url = info.linkUrl;
    break;
  case 'mpv-page':
    url = info.pageUrl;
    break;
  default:
    throw 'unknown context menu id';
  }

  port.postMessage({url: url});
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'mpv-link',
    title: 'play with mpv',
    contexts: ['link'],
    targetUrlPatterns: [
      'https://*.youtube.com/watch*'
    ]
  });

  chrome.contextMenus.create({
    id: 'mpv-page',
    title: 'play with mpv',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://*.youtube.com/watch*'
    ]
  });
});
