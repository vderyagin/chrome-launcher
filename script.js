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

chrome.contextMenus.onClicked.addListener(function (info) {
  var id = info.menuItemId;

  if (menus.hasOwnProperty(id)) {
    port.postMessage({url: info[menus[id].urlKey]});
  } else {
    throw 'unknown context menu id';
  }
});

chrome.runtime.onInstalled.addListener(function () {
  var props;

  for (var id in menus) {
    if (menus.hasOwnProperty(id)) {
      props = menus[id].props;
      props.id = id;
      chrome.contextMenus.create(props);
    }
  }
});
