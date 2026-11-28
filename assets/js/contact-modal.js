/* Contact Us popup
   Clicking any [data-contact-open] element opens the popup. Submitting the form
   opens WhatsApp with the visitor's message pre-filled for the number in
   data-wa-number. Without <dialog> support (or JS) the triggers still fall back to
   their href (#contact, or WhatsApp for the footer number). */
(function () {
  'use strict';

  var dialog = document.getElementById('contact-modal');
  var form = document.getElementById('cm-form');
  if (!dialog || !form || typeof dialog.showModal !== 'function') return;

  var number = dialog.getAttribute('data-wa-number');

  document.querySelectorAll('[data-contact-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });

  dialog.querySelector('[data-cm-close]').addEventListener('click', function () {
    dialog.close();
  });

  /* Close when clicking the dimmed backdrop (but not when a text selection
     that started inside the popup ends outside it) */
  var downOnBackdrop = false;
  dialog.addEventListener('mousedown', function (e) { downOnBackdrop = e.target === dialog; });
  dialog.addEventListener('click', function (e) {
    if (downOnBackdrop && e.target === dialog) dialog.close();
  });

  var nameField = document.getElementById('cm-name');
  var reachField = document.getElementById('cm-reach');
  var subjectField = document.getElementById('cm-subject');
  var messageField = document.getElementById('cm-message');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameField.value.trim();
    var reach = reachField.value.trim();
    var subject = subjectField.value;
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
    if (reach) lines.push('*Contact:* ' + reach);
    lines.push('*Subject:* ' + subject);
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
