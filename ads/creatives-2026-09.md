# Instagram creatives — positioning test, September 2026

Six creatives: three per arc. The arcs are the test; within an arm the three creatives exist so we
measure the **message**, not one image. Do not mix arcs inside an ad set.

| | Arc A — assistant | Arc B — managed home lab |
|---|---|---|
| Landing page | `https://sparky-box.com/` | `https://sparky-box.com/homelab` |
| Ad set name | `assistant` | `homelab` |
| Promise | an assistant that lives in your house and can actually do things | a home server that installs and maintains itself |

**Link tags.** There is no Meta pixel, so the link carries the attribution:
`https://sparky-box.com/?utm_source=instagram&utm_medium=paid&utm_campaign=positioning-2026-09&utm_content=a1`
(`utm_content` = creative id below). The page records its own arc automatically; the tags tell you
which creative did the work.

**Truth constraints.** No price, no launch date, no customer counts, no invented metrics, no
testimonials. True and usable: it is a small computer that sits in your home; you talk to it in
Telegram; it installs and maintains real services (media library, house-wide ad blocking, documents,
home automation); it updates and backs itself up; your files stay on the device you own; the UK
waitlist is open.

---

## Arc A — assistant

### a1 · "Ask it like a person"
- **Primary text:** Most assistants can only answer. Sparky is a small computer in your house, so it
  can actually do things — set up the film library, block ads on every device, keep what you told it.
- **Headline:** The assistant that lives in your house
- **Description:** Join the UK waitlist
- **Visual:** a Telegram exchange. "Also set up a film library for the family" → "Installing it now —
  I'll message you when it's on the TV."

### a2 · "It remembers"
- **Primary text:** Send it a thought, a link, a voice note. Ask for it back weeks later. It runs on a
  box on your shelf, not on someone else's account.
- **Headline:** Remembers what you tell it
- **Description:** Join the UK waitlist
- **Visual:** the exchange about the boiler guy — a question, then the answer from months ago.

### a3 · "One chat, the whole house"
- **Primary text:** One conversation for the plans, the meals, the films and the admin. You ask;
  Sparky does the technical part.
- **Headline:** One chat for the whole house
- **Description:** Join the UK waitlist
- **Visual:** three short exchanges stacked, each a different domain.

## Arc B — managed home lab

### b1 · "The second job you can stop doing"
- **Primary text:** Self-hosting gives you your own services. It usually also gives you a second job.
  Sparky does that job: installs, updates, backs up, restarts what falls over.
- **Headline:** A home server that looks after itself
- **Description:** Join the UK waitlist
- **Visual:** "set up plex with sonarr and radarr" → "Done. Media is on the second disk." with the
  monospace status line underneath.

### b2 · "No compose files"
- **Primary text:** No compose files, no reverse proxy, no 2am disk alert. Ask in plain English and it
  wires the whole stack up properly.
- **Headline:** Your homelab, without the admin
- **Description:** Join the UK waitlist
- **Visual:** the ruled status strip — film library, ad blocking house-wide, documents, backup nightly.

### b3 · "It tells you before it breaks"
- **Primary text:** It watches the parts that rot — updates, disk space, backups, dead containers —
  and asks you only when something needs a decision.
- **Headline:** It maintains itself, and tells you why
- **Description:** Join the UK waitlist
- **Visual:** the proactive exchange: "the media disk is nearly full. Want me to clear watched films?"

---

## Format and delivery

Feed 4:5 (1080×1350) as the primary, 1:1 (1080×1080) as the secondary, 9:16 (1080×1920) for
stories/reels. Meta truncates primary text around 125 characters on mobile, so the first sentence has
to stand alone. Headline about 40 characters, description about 30.

## Reading the result

Primary metric is click-through rate per **arc** (all three creatives pooled). Creative-level numbers
are for spotting a dud, not for picking a winner — at this budget a single creative's numbers are noise.
Secondary: cost per landing-page view, then signups per arc from `/dashboard/waitlist`, which are
directional only at £300.
