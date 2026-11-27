/* WhatsApp message popup
   Clicking a [data-wa-popup] link opens the form; submitting it opens WhatsApp
   with the visitor's message pre-filled for the number in data-wa-number.
   Without <dialog> support (or JS) the link still opens WhatsApp directly. */
(function () {
  'use strict';

  var dialog = document.getElementById('wa-modal');
  var form = document.getElementById('wa-form');
  if (!dialog || !form || typeof dialog.showModal !== 'function') return;

  var number = dialog.getAttribute('data-wa-number');

  document.querySelectorAll('[data-wa-popup]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-wa-close]').addEventListener('click', function () {
    dialog.close();
  });

  /* Close when clicking the dimmed backdrop (but not when a text selection
     that started inside the form ends outside it) */
  var downOnBackdrop = false;
  dialog.addEventListener('mousedown', function (e) { downOnBackdrop = e.target === dialog; });
  dialog.addEventListener('click', function (e) {
    if (downOnBackdrop && e.target === dialog) dialog.close();
  });

  var nameField = document.getElementById('wa-name');
  var emailField = document.getElementById('wa-email');
  var classField = document.getElementById('wa-class');
  var messageField = document.getElementById('wa-message');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameField.value.trim();
    var email = emailField.value.trim();
    var className = classField.value;
    var message = messageField.value.trim();

    /* fields filled with spaces only pass the browser's "required" check */
    if (!name || !message) {
      (name ? messageField : nameField).focus();
      return;
    }

    var lines = [
      '*New message from VSigmaBond website*',
      '',
      '*Name:* ' + name
    ];
    if (email) lines.push('*Email:* ' + email);
    lines.push('*Class:* ' + className);
    lines.push('*Message:* ' + message);

    var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n'));
    var win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
    } else {
      window.location.href = url; /* pop-up blocked: open WhatsApp in this tab */
    }

    form.reset();
    dialog.close();
  });
})();
