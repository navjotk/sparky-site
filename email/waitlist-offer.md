# Waitlist offer email

Approved by the owner 2026-10-04. Send to the waitlist when the Stripe price
object exists and `SPARKY_UNITS_AVAILABLE` is above zero — until both are true
the buy page shows "not on sale" and checkout refuses.

**Voice, as specified:** homelab-led with the term explained for someone who has
never heard it, about 15% assistant. Do not rewrite into either landing-page arc
wholesale.

**Deliberately not in the email:**

- **How many are in the batch.** No manufactured scarcity.
- **Dispatch time.** The 14-day commitment lives in `/terms`, which is the right
  place for it.
- **Any hardware specification.** No public copy names a make, model, processor
  or memory, which leaves the configuration free to change between batches
  without anything having been mis-sold. Keep it that way.

**Deliberately in it:** the line about adding a hard drive. The email leads with
a film and TV library and the box ships without storage for one, so without that
sentence a buyer could reasonably feel the first item on the list is not
delivered.

---

```
Subject: Your Sparky is ready to order


Hi,

You joined the Sparky waitlist. The first batch is built, and you're
seeing it before anyone else.


What it actually is

Sparky is a small computer that lives in your house. You plug it in, and
it runs the things you'd otherwise pay a subscription for, or never quite
get round to setting up:

  - your own film and TV library
  - ad blocking across every device on your wifi
  - home automation, with every smart device in one app instead of five,
    running on your box rather than through someone else's cloud
  - private file storage, with backups that happen nightly
  - your expenses, your recipes and your bookmarks, kept on your machine
    instead of scattered across apps that read them

People call this a home lab. The name makes it sound like a hobby, and
usually it is one. Config files, reverse proxies, a disk quietly filling
up at 2am, an update that breaks everything the week you're away. That's
the part that puts most people off, and it's the part Sparky takes over.
It installs what you ask for, wires it together, keeps it updated, backs
it up, and restarts whatever falls over.

You ask it in Telegram, in plain English. "Set up Plex." "What did I
spend on the car last month?" It answers like an assistant would, except
it can actually do the thing, because the machine is yours and it's
sitting in your hallway.


What comes with it

  - The Sparky box, set up and ready to plug in
  - 12 months of the built-in AI, with nothing to sign up for or configure
  - 12 months of support from us, over email

For a large film library you'll want to add a hard drive. Sparky will
tell you what it needs and set it up when you plug it in.

£200, delivered.

    [ Order your Sparky ]

Not ready? Do nothing. You'll stay on the list.

Joint Effort
```

---

## Before sending

- The "Order your Sparky" button links to `https://sparky-box.com/buy`.
- Add a UTM so orders can be traced back: `?utm_source=email&utm_medium=waitlist&utm_campaign=first-batch`.
- Send from the verified sender, `feedback@sparky-box.com` or a `hello@` equivalent.
  The Resend domain is verified, so a custom sender works.
- Sending to a list is not the same as the single operator notifications Resend
  currently does. A list send needs an unsubscribe link to comply with PECR, even
  though these people opted in.
