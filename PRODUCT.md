# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two candidate audiences, deliberately undecided — the point of the positioning test:

- **Homelab-aware people** who already know what self-hosting is (or own a Pi/NAS) and want it to stop
  being a chore.
- **Curious but non-technical households** who want the outcomes (own media library, ad blocking,
  private assistant) and never the admin.

Traffic for the test comes from Instagram ads, UK targeting, mostly on phones.

## Product Purpose

Sparky is a small computer (currently an off-the-shelf NUC) that ships to a customer's home. It runs a
private AI agent plus the self-hosted services the customer asks for, and maintains them. The customer
talks to it in Telegram, in plain English. Pre-launch: a waitlist, no public pricing, no customers, no
reviews, nothing to quote.

## Positioning

**Undecided by design.** Two arcs are live and are being tested against each other:

- `/` — **the assistant**: an assistant that lives in your house and can actually do things because a
  machine you own sits behind it.
- `/homelab` — **the managed home lab**: a home server that installs, updates and backs up the
  services you ask for.

Both are true. The test decides which leads. Neither page may drift from the shared product truth.

## Operating Context

Customer plugs the box in at home, opens `http://sparky.local`, picks a name (which becomes
`<name>.sparky-box.com` with a real certificate), connects Telegram, and from then on talks to it.
Operator provisions and ships devices with `sparky provision`; the cloud handles claim, DNS, certs,
releases, telemetry and optional billing.

## Capabilities and Constraints

- Installs and manages real open-source services: Plex/Jellyfin and the *arr stack, Pi-hole,
  Home Assistant, Paperless-ngx, Tandoor, n8n, Karakeep, Portainer, Watchtower (see
  `sparky-brain/catalogue/`).
- Maintains itself: nightly backups, self-update, watchdog restarts, image GC, disk guards.
- Chat channel is Telegram. Agent backend is OpenClaw today, Hermes being rolled in.
- Data stays on the device. Only the optional managed-AI path sends messages through Sparky Cloud.
- Hardware floor: 2 cores, 4 GB RAM, 8 GB free disk (32 GB+ recommended).
- Billing exists (Stripe, 14-day trial) but **no price is public** — do not put one on the site.
- **Never invent** metrics, customer counts, testimonials, reviews, timings or prices. An earlier
  draft had blocked-domain counts and reclaimed gigabytes in sample chats; they were removed.

## Brand Commitments

Name "sparky", four-point spark mark, wordmark lockups in `assets/`. Voice is plain, concrete,
unhurried; it names things rather than selling them. Copy is British English.

## Evidence on Hand

Real: the service catalogue, the device's own behaviour, the privacy page. Assets: wordmark lockups,
spark SVGs, a generated social card. **Absent:** product photography (the current NUC is not visually
distinctive; a small shoot is a P3 backlog item), screenshots of real Telegram threads, any customer
or usage figure.

## Product Principles

1. Show the product doing something before arguing about it.
2. Claim only what the repo can back. Absent evidence is stated, never invented.
3. The customer asks; Sparky does the technical part. That asymmetry is the product.
4. Ownership is the uncommoditisable claim: the machine and the data are in their house.
5. Both positioning arcs stay honest to the same product truth.

## Accessibility & Inclusion

WCAG AA is a floor, not a goal: every text/background pair is measured on the rendered page, motion
respects `prefers-reduced-motion`, and the signup path works without JavaScript.
