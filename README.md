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

## Files

- `index.html`: page content, source links, and search/sharing metadata.
- `styles.css`: responsive layout and accessibility styles.
- `site.js`: menu, header offsets, article links, membership enquiry, and contact feedback.
- `assets/`: optimized images served by the website.
- Root JPG files: original image sources; retain them when rebuilding images.
- `tools/optimize_images.py`: regenerates optimized images from those originals.

## Add a news update

1. Copy an existing `.news-card` article inside `.news-grid` in `index.html`.
2. Insert it before older updates so the list remains newest first.
3. Give the article heading and its `.news-details` element unique IDs. Match
   `aria-labelledby` to the heading ID and the permalink to the details ID.
   Preserve IDs of existing articles so shared links keep working.
4. Add the publication date using `<time datetime="YYYY-MM-DD">`, a short summary,
   and the full article inside `.news-article`. Describe the image in its `alt` text.
5. For a new image, add its original JPG, extend the source list in the image tool,
   regenerate assets, and set `src`, `srcset`, `width`, and `height` to the generated
   paths and dimensions. Keep `loading="lazy"` on images below the header.

Articles expand without JavaScript. With JavaScript, opening a link such as
`/#news-kke` also expands the matching article automatically.

## Update the progress summary

Edit `#progress` when a new, confirmed development is published. Update its
visible date and `datetime` together, and link each summary card to supporting
news or a source. The date describes the information summarized, not the day
the website code was edited. Do not infer a pending response or an outcome from
silence; describe what has actually been published.

## Maintain legal sources and membership information

Each `.timeline-item` has a `.source-note`. Prefer original documents or official
publications. Keep missing-original notices until copies are available. The four
ministry documents dated 27/06/1995, 30/09/2009, 19/01/2012, and 15/06/2012 still
need original copies or public links. Use descriptive link text; say when a link
opens a PDF. Recheck summaries against the source before changing legal claims.

Membership eligibility and required documents must come from the association.
The contact form sends an enquiry; it does not register a member or issue a
professional registration. Keep the FAQ consistent with any updated process.

## Rebuild image assets

The development-only tool requires Python and Pillow:

```sh
python3 -m pip install Pillow
python3 tools/optimize_images.py
```

The tool preserves aspect ratios, corrects EXIF orientation, removes unnecessary
metadata, and exports WebP images plus a JPEG sharing image. Root originals are
unchanged. If the logo changes, update the social-image dimensions in the page
metadata to match the generated `assets/social.jpg`.

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

## Check an update

- Preview at phone, tablet, and desktop widths, including 1280px and 1281px
  around the navigation breakpoint; check for horizontal scrolling.
- Use Tab, Enter, Space, and Escape to check the skip link, menu, FAQs, and articles.
- Open article permalinks directly and check that the header does not cover them.
- Check news/FAQ disclosures and navigation with JavaScript disabled.
- Confirm images load and source links point to the intended documents.
- Check contact validation and simulate success, failure, and retry responses.
  Do not send test enquiries to the association without authorization.
