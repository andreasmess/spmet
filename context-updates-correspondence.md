# ΣΠΜΕΤ — June 2025 correspondence implementation

Date: 20 October 2026 (Europe/Athens).
Scope: section 5, “Document the 2025 correspondence more precisely”, of [context-updates-plan.md](context-updates-plan.md). The earlier execution plan's Phase 7 is outside this follow-up.

## Instructions and evidence

The user clarified that the original correspondence files will not be uploaded yet and confirmed that no reply had been given as of 20/10/2026. The page therefore uses a dated, association-attributed status statement; it does not describe an independent ministry audit.

The supplied dossier, `docs/context.md` §3, records three separate events: the Education Ministry letter dated 23/06/2025, email dispatch on 28/06/2025, and registration / routing number 5297/30-06-2025. These dates are published as the association's account, not as independently checked originals.

Re-examined the scanned attachment in `assets/epistoli.pdf`, PDF pages 2–4. Reference (ε) on page 2 explicitly identifies the association's letter 5297/30.06.2025 to the Education Ministry. The attachment is the association's decision dated 09/06/2026, transmitted with the parliamentary report of 07/10/2026. It corroborates the association's reference to the earlier letter; it does not contain the original letter or its email trail.

The decision also describes no official replies as of its own date. The new page statement instead uses the user's explicit 20/10/2026 confirmation for the later status. Neither the June decision nor the February 2026 ministry reply is represented as evidence of today's ministerial reply history.

`assets/epistoles.webp` was inspected and contains institutional logos, not images of the letters. Public searches did not identify matching original correspondence; unrelated identifier matches were discarded. No private file, new PDF or new public document was created.

## Implemented content

- Added `#legal-association-2025` between the 2025 precedent and February 2026 reply. The entry distinguishes the letter date, dispatch date and registration date, attributes them to the association, and links to the published 2026 reference.
- The entry states that the number belongs to the Education Ministry correspondence and does not establish receipt of the separate Development Ministry letter.
- Linked the timeline entry to `#news-letters` for the full account and reply-status update.
- Preserved the original letters announcement and appended the chronology, a precisely labelled source link and the association's no-substantive-reply statement dated 20/10/2026.
- Updated README maintenance guidance and the plan's section 5 status to reflect this attributed-publication approach and the user's decision to withhold the original files.
- Kept the historical clarification omitted. No committee, other Phase 7, ASEP-case, court or regulatory-status additions were made in this follow-up.

## Outstanding originals

The following remain outstanding even though the association-attributed account is now implemented:

1. The original letter dated 23/06/2025 and its exact original requests.
2. The 28/06/2025 email and the ministry's receipt / routing record for 5297/30-06-2025.
3. The separate acknowledgement / protocol evidence for the Development Ministry submission.

Obtain and check these before presenting their contents or routing as independently verified. No placeholder link or invented date of a future reply is shown publicly. Future reply-status updates require a fresh dated confirmation.

## Verification

- Static checks passed for unique IDs, preservation of existing IDs, fragment targets, local assets and Markdown links.
- Compared the original letters article text with the pre-change version and confirmed it is preserved before the appended paragraphs. The ministry update, other meeting articles, recruitment example and contact section remain unchanged.
- Confirmed `assets/epistoli.pdf` is byte-identical to the committed copy. Its page 2 reference was visually read from the scanned attachment; the new source labels identify that later reference accurately.
- Isolated Chrome over local HTTP passed at 360, 390, 1280, 1281 and 1440 px with no horizontal overflow. The new timeline anchor remains visible below the fixed header.
- At 390 and 1440 px, the letters article opens in the reader with JavaScript, closes with Escape, and opens as a native disclosure with Enter when JavaScript is disabled.
- Confirmed that the article contains the two reported letter / dispatch dates, protocol 5297/30-06-2025 and the dated 20/10/2026 no-substantive-reply statement in both modes.
- Confirmed the timeline's article link opens the correct reader and the source links target `assets/epistoli.pdf#page=2`.
- No runtime exceptions were recorded. Visually inspected the appended chronology and status at mobile and desktop sizes.
- Temporary browser scripts, screenshots and results are under `/private/tmp/spmet-correspondence-*`. No testing dependency, CSS or JavaScript change was needed.

## Commit scope

`index.html`, `README.md`, `context-updates-plan.md` and this record. No deployment or form submission. The existing PDF remains unchanged and is linked as a later reference, not relabelled as the original 2025 correspondence.
