// The site is static, with one exception: /buy has to state the price, and it
// has to state it even when JavaScript never runs.
//
// /terms says "The buy page states the price you pay, including delivery,
// before you commit." The offer itself lives in the cloud (price, stock, the
// included period) so it can change without a site deploy, which left the
// static page with nothing true to say until a fetch came back. So the worker
// fetches the offer and fills the page in before it is sent.
//
// The markup ships in its closed state: no price, ordering disabled. Opening it
// is something only a successful offer lookup does, here or in buy.js. If the
// cloud is unreachable the page stays closed, which is the honest answer.

const OFFER_TTL = 60; // seconds; the price moves rarely, stock can move fast

const money = (pence, currency) => {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency', currency: currency || 'GBP',
      minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
    }).format(pence / 100);
  } catch (e) {
    return '£' + (pence / 100).toFixed(pence % 100 === 0 ? 0 : 2);
  }
};

const OPEN_NOTE =
  'Payment is handled by Stripe. You’ll give your delivery address there.';
const CLOSED_NOTES = {
  soldout: 'This batch has gone. Reply to the email and we’ll hold you a place in the next one.',
  unavailable: 'Ordering isn’t open yet. You’re on the list, and we’ll email you the moment it is.',
};

const setText = (value) => ({ element: (el) => el.setInnerContent(value) });
const unhide = () => ({ element: (el) => el.removeAttribute('hidden') });
const hide = () => ({ element: (el) => el.setAttribute('hidden', '') });
const enable = () => ({ element: (el) => el.removeAttribute('disabled') });
const setAttr = (name, value) => ({ element: (el) => el.setAttribute(name, value) });

async function renderBuy(request, env, ctx) {
  const page = await env.ASSETS.fetch(new Request(new URL('/buy', request.url), {
    headers: request.headers,
  }));
  if (!page.ok) return page;

  const base = env.OFFER_URL || 'https://dashboard.sparky-box.com/offer';
  let offer = null;
  try {
    const res = await fetch(base, {
      headers: { Accept: 'application/json' },
      cf: { cacheTtl: OFFER_TTL, cacheEverything: true },
    });
    if (res.ok) offer = await res.json();
  } catch (e) {
    // Leave `offer` null: the page stays in its shipped, closed state.
  }

  const html = new HTMLRewriter();
  // Headers first: a page whose body depends on a live lookup must not be
  // cached as though it were a static asset.
  const headers = new Headers(page.headers);
  headers.set('Cache-Control', 'no-cache');
  headers.delete('Content-Length');
  headers.delete('ETag');

  if (!offer) return new Response(page.body, { status: page.status, headers });

  if (offer.included_months > 0) {
    html.on('[data-offer-months]', setText(String(offer.included_months)));
    html.on('[data-offer-row]', unhide());
  }
  if (offer.price_pence > 0) {
    html.on('#offer-figure', setText(money(offer.price_pence, offer.currency)));
    html.on('#offer-price', unhide());
  }

  const closed = !offer.available ? 'unavailable'
    : offer.units_left <= 0 ? 'soldout'
    : null;

  if (closed) {
    html.on('#offer-state', setText(closed === 'soldout' ? 'Sold out' : 'Not on sale yet'));
    html.on('#order-status-text', setText(CLOSED_NOTES[closed]));
  } else {
    html.on('#offer', setAttr('data-state', 'open'));
    html.on('#offer-state', hide());
    html.on('#order-email', enable());
    html.on('#order-submit', enable());
    html.on('#order-status-text', setText(OPEN_NOTE));
  }

  return html.transform(new Response(page.body, { status: page.status, headers }));
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/buy') {
      return renderBuy(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
