/* Open email links in Gmail
   Links marked <a href="mailto:x" data-gmail="x"> open a Gmail compose window
   addressed to x, using the best route for the visitor's device:
   - Android: the Gmail app (falls back to Gmail in the browser if not installed)
   - iPhone / iPad: the Gmail app (falls back to the phone's mail app)
   - Computers: Gmail's compose page in a new tab
   Without JS the plain mailto: link still works. */
(function () {
  'use strict';

  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); /* iPadOS */

  function webCompose(to) {
    return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to);
  }

  document.querySelectorAll('a[data-gmail]').forEach(function (link) {
    var to = link.getAttribute('data-gmail');

    if (isAndroid) {
      /* Chrome "intent:" link: mailto handled by the Gmail app package only */
      link.href = 'intent:' + to + '#Intent;scheme=mailto;package=com.google.android.gm;' +
        'S.browser_fallback_url=' + encodeURIComponent(webCompose(to)) + ';end';
      link.removeAttribute('target');
      return;
    }

    if (isIOS) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        /* If the Gmail app opens, the page goes to the background; if not,
           fall back to the default mail app after a short wait */
        var fallback = setTimeout(function () {
          if (!document.hidden) window.location.href = 'mailto:' + to;
        }, 1500);
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) clearTimeout(fallback);
        }, { once: true });
        window.location.href = 'googlegmail:///co?to=' + encodeURIComponent(to);
      });
      return;
    }

    link.href = webCompose(to);
    link.target = '_blank';
    link.rel = 'noopener';
  });
})();
