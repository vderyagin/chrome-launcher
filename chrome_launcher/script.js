/* global chrome */

var port = chrome.runtime.connectNative('com.vderyagin.testapp');

var menus = {
  'mpv-link': {
    props: {
      title: 'play with mpv',
      contexts: ['link'],
      targetUrlPatterns: [
        'https://*.youtube.com/watch*'
      ],
    },
    urlKey: 'linkUrl'
  },
  'mpv-page': {
    props: {
      title: 'play with mpv',
      contexts: ['page'],
      documentUrlPatterns: [
        'https://*.youtube.com/watch*'
      ],
    },
    urlKey: 'pageUrl'
  },
};

var extend = function (base, obj) {
  Object.keys(obj).forEach(function (key) {
    base[key] = obj[key];
  });

  return base;
};

chrome.contextMenus.onClicked.addListener(function (info) {
  var id = info.menuItemId;

  if (menus.hasOwnProperty(id)) {
    port.postMessage({url: info[menus[id].urlKey]});
  } else {
    throw 'unknown context menu id';
  }
});

chrome.runtime.onInstalled.addListener(function () {
  Object.keys(menus).forEach(function (id) {
    chrome.contextMenus.create(extend({id: id}, menus[id].props));
  });
});
