// The offer page, in the browser.
//
// The page is shipped closed and the worker opens it from GET /offer before
// sending it (see worker.js). This does the same again here, because the
// worker's answer can be up to a minute old and stock can move inside a minute,
// and because the submit handler wants to keep the buyer on the page.
//
// Nothing here invents a price or an availability. If the lookup fails, the
// page stays exactly as it arrived.
(() => {
  const API = 'https://dashboard.sparky-box.com';
  const offer = document.querySelector('#offer');
  const form = document.querySelector('#order-form');
  if (!offer || !form) return;

  const figure = document.querySelector('#offer-figure');
  const price = document.querySelector('#offer-price');
  const state = document.querySelector('#offer-state');
  const statusText = document.querySelector('#order-status-text');
  const errorNote = document.querySelector('#order-error');
  const submit = document.querySelector('#order-submit');
  const input = document.querySelector('#order-email');

  const CLOSED_NOTES = {
    soldout: 'This batch has gone. Reply to the email and we’ll hold you a place in the next one.',
    unavailable: 'Ordering isn’t open yet. You’re on the list, and we’ll email you the moment it is.',
    unreachable: 'We can’t show today’s price just now. Reload in a moment, or reply to the email and we’ll take your order by hand.'
  };
  const CLOSED_LABELS = {
    soldout: 'Sold out',
    unavailable: 'Not on sale yet',
    unreachable: 'Temporarily unavailable'
  };

  const money = (pence, currency) => {
    try {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency', currency: currency || 'GBP',
        minimumFractionDigits: pence % 100 === 0 ? 0 : 2
      }).format(pence / 100);
    } catch (e) {
      return '£' + (pence / 100).toFixed(pence % 100 === 0 ? 0 : 2);
    }
  };

  const close = (reason) => {
    offer.dataset.state = 'closed';
    state.hidden = false;
    state.textContent = CLOSED_LABELS[reason];
    // Closing can happen mid-submit, when the button still says it is on its
    // way to Stripe. It is not.
    submit.textContent = 'Order →';
    submit.disabled = true;
    input.disabled = true;
    statusText.textContent = CLOSED_NOTES[reason];
  };

  const open = () => {
    offer.dataset.state = 'open';
    state.hidden = true;
    submit.disabled = false;
    input.disabled = false;
    statusText.textContent = 'Payment is handled by Stripe. You’ll give your delivery address there.';
  };

  const render = (data) => {
    if (data.included_months > 0) {
      document.querySelectorAll('[data-offer-months]').forEach((el) => {
        el.textContent = String(data.included_months);
      });
      document.querySelectorAll('[data-offer-row]').forEach((el) => { el.hidden = false; });
    }
    if (data.price_pence > 0) {
      figure.textContent = money(data.price_pence, data.currency);
      price.hidden = false;
    }
    if (!data.available) close('unavailable');
    else if (data.units_left <= 0) close('soldout');
    else if (data.price_pence > 0) open();
    else close('unreachable'); // priced at nothing is not an offer we can state
  };

  fetch(API + '/offer', { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('offer ' + r.status))))
    .then(render)
    .catch(() => {
      // The worker may already have opened the page from its own lookup, and it
      // is no less true for this one having failed. Only close a page that was
      // still waiting.
      if (offer.dataset.state !== 'open') close('unreachable');
    });

  const showError = (message) => {
    errorNote.hidden = false;
    errorNote.textContent = message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = String(new FormData(form).get('email') || '').trim();
    if (!email) { input.focus(); return; }
    errorNote.hidden = true;
    submit.disabled = true;
    submit.textContent = 'Taking you to Stripe…';
    try {
      const response = await fetch(API + '/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        let detail = '';
        try { detail = (await response.json()).detail || ''; } catch (e) {}
        // 409 is the batch selling out between loading the page and ordering.
        if (response.status === 409) { close('soldout'); return; }
        if (response.status === 503) { close('unavailable'); return; }
        throw new Error(detail || '');
      }
      const { checkout_url: url } = await response.json();
      if (!url) throw new Error('');
      // Nothing after this point: the browser is leaving for Stripe.
      location.assign(url);
    } catch (error) {
      submit.disabled = false;
      submit.textContent = 'Order →';
      showError(error.message ||
        'We couldn’t start checkout. Try again in a moment — nothing has been charged.');
    }
  });
})();
