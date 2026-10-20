# ΣΠΜΕΤ website

Static Greek-language website for the association, hosted at https://spmet.gr/.
There is no build step or production JavaScript dependency.

## Preview locally

From the repository directory, run:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. Publishing is separate from local editing; use the
repository's existing hosting workflow when the changes are ready.

Do not test contact submissions by opening `index.html` as a `file://` URL;
the JavaScript handler preserves the draft and asks you to use the local server.

Preview the YouTube player through the local HTTP URL above, rather than a
`file://` URL or an IDE's embedded preview. YouTube requires an HTTP `Referer`
to identify the embedding page; a missing referrer can cause player error 153.
The iframe explicitly uses `referrerpolicy="strict-origin-when-cross-origin"`,
as recommended by YouTube. If error 153 persists over HTTP, check whether a
browser extension or privacy setting is stripping the referrer.

## Maintain the video series

`#intro-video` contains one player and four episode buttons. Episode IDs
`#video-1` through `#video-4` are shareable and used by contextual links from the
requests, official update, recruitment example, document explanation and FAQ.
Keep each episode button's `data-video-id`, number and title consistent.
The script switches the existing player, title, active episode and YouTube link
without autoplay or scrolling when an episode button is pressed. Preserve the privacy-enhanced embed domain and referrer policy.
Without JavaScript, explicit fallback links open the corresponding YouTube videos and
contextual anchors lead to those cards. Verify direct links and Back/Forward
navigation after changing the series. The episode choices use four columns on
desktop and two columns at 700 px and below.

## Files

- `index.html`: page content, source links, and search/sharing metadata.
- `styles.css`: responsive layout and accessibility styles.
- `site.js`: menu, header offsets, article links, membership enquiry, and contact feedback.
- `assets/`: WebP images served by the website and the JPEG sharing card.
- `tools/optimize_images.py`: rebuilds the JPEG sharing card from `assets/logo.webp`.

## Add a news update

1. Copy an existing `.news-card` article inside `.news-grid` in `index.html`.
2. Insert it before older updates so the list remains newest first.
3. Give the article heading and its `.news-details` element unique IDs. Match
   `aria-labelledby` to the heading ID and the permalink to the details ID.
   Preserve IDs of existing articles so shared links keep working.
4. Add the publication date using `<time datetime="YYYY-MM-DD">`, a short summary,
   and the full article inside `.news-article`. Describe the image in its `alt` text.
5. For a new image, add optimized WebP files in `assets/` for the required display
   sizes, then set `src`, `srcset`, `width`, and `height` to those paths and dimensions.
   Keep `loading="lazy"` on images below the header.

Articles expand without JavaScript. With JavaScript, opening a link such as
`/#news-kke` also expands the matching article automatically.

## Update the official process information

Keep the dated official information in `#official-update` separate from the
association's news in `#news`. Cite the source and its information date; do not
present an old reply as proof of today's status. Meetings, press coverage and
parliamentary interventions do not by themselves establish regulatory progress.

## Maintain legal sources and membership information

The legal timeline is inside `.timeline-scroll`, a labelled, keyboard-focusable
region with a viewport-relative maximum height. Keep the scroll hint, native
touch / keyboard scrolling, existing entry IDs and print override: printing must
show the full timeline. When adding entries, check direct links into the scroller
and Tab access to source links with JavaScript enabled and disabled.

Each `.timeline-item` has a `.source-note`. Prefer original documents or official
publications. The four ministry documents dated 27/06/1995, 30/09/2009,
07/02/2012, and 15/06/2012 are linked to scanned PDFs in `assets/`.
Use filenames in the form `ministry-YYYY-MM-DD-document-number.pdf` and
descriptive link text that identifies PDFs as scanned copies. The 07/02/2012
document includes 19/01/2012 in its protocol reference; use its printed document
date in the timeline. Recheck summaries against the source before changing legal claims.

The requests and FAQ link to `#legal-2019` for Article 257. Keep its Gazette
publication date distinct from the date of the ministry account and from the
date a source was checked. The original Gazette is not a consolidated amendment
history. Keep requests for current information separate from dated status reports.

The `#legal-ste-2025` entry links to a published Athens Bar Association summary
of ΣτΕ 903/2025. Identify it as a summary of a case about another specialty;
do not describe it as a full judgment or automatic recognition for our graduates.

The `#legal-asep-2026` entry establishes recruitment requirements. Add an
individual case outcome only after checking the original decision and relevant
regional response, using redacted copies for publication where necessary. Check
document identifiers, dates, issuing services and PDF page references. Keep the
June 2025 correspondence separate from `assets/epistoli.pdf`, which contains
the October 2026 parliamentary submission and its June 2026 attachment. Any
non-response statement needs a dated confirmation from the association.

The `#legal-association-2025` timeline entry and `#news-letters` article separate
the reported letter, email and registration dates. These are attributed to the
association's records. Reference (ε) on PDF page 2 of `assets/epistoli.pdf`
corroborates the number of the Education Ministry letter; it is not its original
or a ministry acknowledgement. The no-substantive-reply statement is an
association update dated 20/10/2026. Change that status only with a new dated
confirmation, and do not transfer the protocol number to the separate
Development Ministry submission.

Track missing evidence in `context-updates-plan.md` and the associated stage
records. The historical clarification was omitted at the user's request; do
not reintroduce it as part of these updates.

Membership eligibility and required documents must come from the association.
The contact form sends an enquiry; it does not register a member or issue a
professional registration. Keep the FAQ consistent with any updated process.

## Rebuild image assets

The development-only sharing-card tool requires Python and Pillow:

```sh
python3 -m pip install Pillow
python3 tools/optimize_images.py
```

The tool creates the 1200×630 JPEG sharing card. Its composition and Greek text are
defined in `tools/optimize_images.py`; it uses `assets/logo.webp` in the logo area
and does not resize the logo into a sharing card.

The tool uses Arial on macOS or DejaVu Sans on Linux. For another system, or to
reproduce a card with specific fonts, provide Greek-capable TTF files with
`--social-font /path/to/regular.ttf --social-bold-font /path/to/bold.ttf`.
For identical pixels across machines, use the same font files and Pillow version.
Keep the image dimensions and alternative text in page metadata consistent with
the generated `assets/social.jpg`.

## Search and sharing

Maintain the title, description, Open Graph, and Twitter metadata in the page
head. Canonical, Open Graph URL, and sharing-image URL use `https://spmet.gr/`.
If the domain changes, update them together with `CNAME`. Sharing previews need
the deployed image and may remain cached by the receiving platform.

## Contact and privacy

The form posts to the existing Formspree endpoint in `index.html`. `site.js`
shows pending, success, and failure feedback; without JavaScript the standard
Formspree submission remains available. Keep the contact-data explanation and
email address accurate. Confirm any retention or privacy-policy commitments
with the association before publishing them.

If Formspree returns HTTP 403 when using an HTTP/HTTPS page, inspect the failed
POST request's Response in browser DevTools → Network. The status alone does
not identify the rejection reason. Check the form endpoint and its configuration
in the Formspree dashboard before changing the integration. Use mocked responses
for automated tests so they do not send real messages.

## Check an update

- Preview at phone, tablet, and desktop widths, including 1280px and 1281px
  around the navigation breakpoint; check for horizontal scrolling.
- Use Tab, Enter, Space, and Escape to check the skip link, menu, FAQs, and articles.
- Open article permalinks directly and check that the header does not cover them.
- Check news/FAQ disclosures and navigation with JavaScript disabled.
- Confirm images load and source links point to the intended documents.
- Check contact validation and simulate success, failure, and retry responses.
  Do not send test enquiries to the association without authorization.
