(function () {
    'use strict';

    var endpoint = 'https://script.google.com/macros/s/AKfycbzaGCi1EpM56jZfqrxMOLHgvtWb449qXw6qY3RF9F0xR-G0zdPAJ3FZ2f01XjBnlGv_hA/exec';
    var timer = null;
    var sent = false;

    function recordRead() {
        if (sent || document.visibilityState !== 'visible') {
            return;
        }

        sent = true;

        fetch(endpoint, {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            keepalive: true,
            body: new URLSearchParams({ path: window.location.pathname })
        }).catch(function () {
            // Analytics should never interfere with reading the article.
        });
    }

    function startTimer() {
        if (!sent && timer === null && document.visibilityState === 'visible') {
            timer = window.setTimeout(function () {
                timer = null;
                recordRead();
            }, 10000);
        }
    }

    function stopTimer() {
        if (timer !== null) {
            window.clearTimeout(timer);
            timer = null;
        }
    }

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            startTimer();
        } else {
            stopTimer();
        }
    });

    startTimer();
})();
