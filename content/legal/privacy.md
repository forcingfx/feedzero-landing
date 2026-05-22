---
title: Privacy Policy
description: FeedZero privacy policy. We do not read your feeds or articles. Local-only by default. Sync is zero-knowledge encrypted.
canonical: /legal/privacy
updated: 2026-05-15
---
## The short version

FeedZero is built to know as little about you as possible. Your subscriptions and reading history live in your browser, encrypted. If you turn on sync, the data is encrypted on your device before it leaves. Our server stores it and has no way to read it. We do not use any third-party analytics or trackers.

## Who we are

Operator details and contact information are in our [Impressum](/legal/impressum).

## Applicable law

This policy is governed by the **revised Federal Act on Data Protection (FADP / Datenschutzgesetz, DSG)**, effective 1 September 2023, and the corresponding Data Protection Ordinance. For users resident in the European Union or European Economic Area, the **EU General Data Protection Regulation (GDPR)** applies in parallel due to its extraterritorial scope (Art. 3(2) GDPR). Where the two regimes diverge, we apply whichever offers the data subject the greater protection.

## What we collect

### Free tier (local-only)

The Free tier runs entirely in your browser. We do not have an account for you. Your feeds, articles, read state, and folders never leave your device unless you choose to enable sync.

When the app fetches feeds and pages on your behalf (RSS sources do not allow direct cross-origin browser fetches), our server logs the standard fields any HTTP server logs: the URL fetched, your IP address (briefly, for rate limiting), and a request timestamp. Logs are retained for at most 30 days and are not joined with any other identifier.

### Personal tier (sync)

For paying customers, we additionally collect:

- A Stripe customer ID and subscription ID (from Stripe). We do not store your credit card information. Stripe does.
- Your encrypted vault blob, identified only by a derived vault ID. We cannot read the contents: encryption keys are derived from your passphrase or from material generated in your browser and never sent to us.
- An anonymous license token (a short signed string) that authorizes sync requests. The token contains your customer ID and tier. No email, no name.

We do not store your email address or name on our servers. Stripe stores them as part of normal billing flow. See Stripe's privacy policy.

## Legal bases for processing (GDPR Art. 6 / FADP Art. 31)

- **Contract performance.** Processing necessary to deliver the FeedZero service you subscribed to: sync, license verification, billing via Stripe.
- **Legitimate interest.** Short-lived server logs for security, abuse prevention, and rate limiting.
- **Legal obligation.** Invoice retention under commercial-law rules and the Code of Obligations.

## Who we share with (processors)

We use a small number of processors to operate the service:

- **Stripe Payments Europe Ltd. (Ireland).** Payment processing and customer billing portal. EU SCCs apply for any onward transfer outside the EEA.
- **Vercel, Inc. (United States).** Application hosting, serverless functions, CDN. Cross-border transfers governed by EU SCCs and the Swiss-US Data Privacy Framework.
- **Upstash, Inc. (United States).** Encrypted vault storage and license records. Same SCC / DPF basis.

None of these processors receive any unencrypted personal content from you. Vercel and Upstash see opaque ciphertext; Stripe sees billing data only.

## International transfers

Personal data may be transferred to processors in the EU (Stripe Ireland) and the United States (Vercel, Upstash). For transfers from the operator's jurisdiction to the United States, we rely on the **Swiss-US Data Privacy Framework** where the receiving processor is certified, or on Standard Contractual Clauses (SCCs) issued by the Federal Data Protection and Information Commissioner (FDPIC). For transfers from the EEA to the US, EU SCCs apply.

## Cookies and analytics

We do not use third-party analytics. We do not use any non-essential cookies. The app uses browser local storage (IndexedDB) to keep your data on your device. That is not a cookie and does not leave your device.

## Your rights

### Under FADP (Art. 25–28 DSG)

- **Right of access.** Request a copy of personal data we hold about you.
- **Right to rectification.** Correct inaccurate data.
- **Right to erasure or restriction.** Request deletion or restriction of processing.
- **Right to data portability.** Receive your data in a structured, commonly used format.
- **Right to lodge a complaint** with the **Federal Data Protection and Information Commissioner (FDPIC / EDÖB)**. See [edoeb.admin.ch](https://www.edoeb.admin.ch/).

### Under EU GDPR (Art. 15–22), for EU/EEA residents

- The same access, rectification, erasure, restriction, portability, and objection rights as above.
- **Right to lodge a complaint** with a supervisory authority in your EU/EEA member state of habitual residence. See the [EDPB member list](https://edpb.europa.eu/about-edpb/about-edpb/members_en).

### Practical exercise

- **Access and portability.** Most of your data lives in your browser. Use OPML export to take it with you. Your encrypted vault can be retrieved via the Stripe Customer Portal under FeedZero sync settings.
- **Deletion.** Cancel your subscription via the Customer Portal. We delete the encrypted vault 90 days after the subscription ends. To request immediate deletion, email [support@feedzero.app](mailto:support@feedzero.app).

## Retention

Encrypted vault data is retained for the duration of your subscription plus 90 days (a grace period in case of accidental cancellation). Billing records are retained for 10 years per Code of Obligations Art. 958f. Short-lived server logs are retained for 30 days.

## Changes to this policy

We will update this page and bump the "Last updated" date above. Material changes will additionally be announced in the app's "What's new" feed.

## Contact

Privacy questions: [support@feedzero.app](mailto:support@feedzero.app). We do not currently appoint a separate Data Protection Officer (DPO) as we are below the FADP threshold requiring one (Art. 10 DSG) and below the GDPR threshold (Art. 37). If that changes, we will publish DPO contact details on this page.
