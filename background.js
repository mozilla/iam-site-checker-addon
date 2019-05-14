const TRUSTED_DOMAINS = new Set([
  "auth.mozilla.auth0.com",
  "login.mozilla.com",
]);

(async () => {
  for (const tab of await browser.tabs.query({ discarded: false })) {
    if (isTrustedUrl(tab.url)) {
      markAsTrusted(tab.id);
    } else {
      markAsUntrusted(tab.id);
    }
  }
})();

function isTrustedUrl(urlString) {
  if (!urlString) {
    return false;
  }
  const parsedUrl = new URL(urlString);
  let trusted = TRUSTED_DOMAINS.has(parsedUrl.hostname);
  return trusted;
}

browser.webNavigation.onBeforeNavigate.addListener(({ frameId, tabId }) => {
  if (frameId !== 0) {
    // Not a top level frame, so take no action
    return;
  }
  markAsUnknown(tabId);
});

browser.webNavigation.onCompleted.addListener(({ frameId, tabId, url }) => {
  if (frameId !== 0) {
    // Not a top level frame, so take no action
    return;
  }
  if (isTrustedUrl(url)) {
    markAsTrusted(tabId);
  } else {
    markAsUntrusted(tabId);
  }
});

function markAsTrusted(tabId) {
  browser.pageAction.setIcon({
    path: "imgs/trusted.png",
    tabId,
  });
  browser.pageAction.setTitle({
    title: "It is SAFE to use your Mozilla credentials on this site",
    tabId,
  })
  browser.pageAction.show(tabId);
}

function markAsUntrusted(tabId) {
  browser.pageAction.setIcon({
    path: "imgs/untrusted.png",
    tabId,
  });
  browser.pageAction.setTitle({
    title: "It is UNSAFE to use your Mozilla credentials on this site",
    tabId,
  })
  browser.pageAction.hide(tabId);
}

function markAsUnknown(tabId) {
  browser.pageAction.setIcon({
    path: "imgs/unknown.png",
    tabId,
  });
  browser.pageAction.setTitle({
    title: "It is UNKNOWN if it is safe to use Mozilla credentials on this site",
    tabId,
  })
  browser.pageAction.hide(tabId);
}