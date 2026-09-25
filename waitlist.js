// Progressive enhancement for the waitlist form. The form works without JS:
// it posts to its own action. With JS it collapses behind a button and submits in place.
(() => {
  const form = document.querySelector('#waitlist-form');
  if (!form) return;
  const toggle = document.querySelector('#waitlist-toggle');
  const errorNote = document.querySelector('#waitlist-error');
  const status = document.querySelector('#waitlist-status');
  const variant = document.body.dataset.variant || 'default';
  let joined = false;

  form.hidden = true;
  if (toggle) toggle.hidden = false;

  const revealWaitlist = () => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    form.hidden = false;
    if (toggle) toggle.hidden = true;
    if (!joined) form.querySelector('input')?.focus();
    form.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
  };

  document.querySelectorAll('#waitlist-toggle, [data-waitlist-trigger]')
    .forEach((trigger) => trigger.addEventListener('click', revealWaitlist));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = new FormData(form).get('email');
    const submit = form.querySelector('button[type=submit]');
    submit.disabled = true;
    submit.textContent = 'Joining…';
    if (errorNote) errorNote.hidden = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, variant })
      });
      if (!response.ok) throw new Error('signup failed');
      joined = true;
      form.querySelector('.waitlist-row')?.remove();
      form.querySelector('label')?.remove();
      status.innerHTML = 'You’re on the list — we’ll email ' + String(email).replace(/[<>&"]/g, '') +
        ' when Sparky is available. <a class="inline-link" href="/privacy">How we handle your data</a>.';
    } catch (error) {
      submit.disabled = false;
      submit.textContent = 'Join →';
      if (errorNote) {
        errorNote.hidden = false;
        errorNote.textContent = 'We couldn’t reach the waitlist. Check your connection and try again — your email is still here.';
      }
    }
  });
})();
