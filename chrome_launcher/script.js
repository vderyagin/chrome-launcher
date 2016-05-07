/*global chrome */

var port = chrome.runtime.connectNative('chrome_launcher');

var menus = {
  'mpv-link': {
    props: {
      title: 'play URL with mpv',
      contexts: ['link']
    },
    urlType: 'youtube',
    urlKey: 'linkUrl'
  },
  'mpv-page': {
    props: {
      title: 'play page with mpv',
      contexts: ['page']
    },
    urlType: 'youtube',
    urlKey: 'pageUrl'
  }
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
