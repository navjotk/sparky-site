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

  // One optional question after signing up. It is the only way to learn how the
  // page was understood, rather than just how many people clicked.
  const askWhatItIs = (email) => {
    const box = document.createElement('div');
    box.className = 'answer-box';
    box.innerHTML =
      '<label for="waitlist-answer">One question, if you have a moment: in your own words, what do you think Sparky is?</label>' +
      '<textarea id="waitlist-answer" name="answer" rows="3" maxlength="1000" ' +
      'placeholder="No wrong answers \u2014 whatever it sounds like to you."></textarea>' +
      '<div class="answer-actions"><button class="button button-ghost" type="button" id="waitlist-answer-send">Send</button>' +
      '<span class="form-note" id="waitlist-answer-note">Optional. It helps us explain Sparky better.</span></div>';
    form.appendChild(box);
    const note = box.querySelector('#waitlist-answer-note');
    const field = box.querySelector('#waitlist-answer');
    const send = box.querySelector('#waitlist-answer-send');
    send.addEventListener('click', async () => {
      const answer = field.value.trim();
      if (!answer) { field.focus(); return; }
      send.disabled = true;
      send.textContent = 'Sending\u2026';
      try {
        const r = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, variant, answer })
        });
        if (!r.ok) throw new Error('answer failed');
        box.innerHTML = '<p class="form-note">Thank you \u2014 that is genuinely useful.</p>';
      } catch (err) {
        send.disabled = false;
        send.textContent = 'Send';
        note.textContent = 'That did not send. Try again, or ignore it \u2014 you are still on the list.';
        note.classList.add('form-error');
      }
    });
  };

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
      askWhatItIs(email);
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

// The reply lands after you ask: start each thread when it scrolls into view.
(() => {
  const threads = document.querySelectorAll('.thread-animate');
  if (!threads.length) return;
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // messages stay visible; nothing to animate
  }
  // Only hide them once we know we can bring them back.
  threads.forEach((t) => t.classList.add('js-armed'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-live'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.25 });
  threads.forEach((t) => io.observe(t));
})();
