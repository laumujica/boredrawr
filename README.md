# Boredrawr

[Open Boredrawr](https://boredrawr.web.app/)

## Project structure

- `index.html`: page structure and content.
- `css/styles.css`: branding, layout and responsive styles.
- `js/app.js`: mode selection, random prompts, timer, dialog and local completion count.
- `data/prompts.json`: adjectives, nouns and mode templates. Use `{adjective}` and `{noun}` as placeholders.
- `img/`: hero image, favicon and social sharing card.
- `fonts/`: local font files. The stylesheet expects `Author-Regular.otf`, `Author-Semibold.otf` and `Author-Bold.otf`. All three font files are included.
- `firebase.json` and `.firebaserc`: Firebase Hosting configuration.
- `.github/workflows/`: automatic Firebase deployments.

## Local preview

Use VS Code Live Server to open `index.html`, or serve this folder with:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Opening the HTML directly with `file://` does not support loading the prompt JSON reliably.

## Prompt content

The existing 14 adjectives, 16 nouns and 4 mode templates produce 896 combinations across all modes. Edit the JSON to add content without changing the app logic. Keep it valid JSON: double quotes and no trailing commas.

## Deployment

No build step is needed. Push to `main` to publish to Firebase Hosting through GitHub Actions. Pull requests get a preview deployment.

## Search and sharing

The homepage includes an English title and description focused on drawing and doodling, canonical URL, Open Graph and Twitter card metadata, and WebSite/WebApplication structured data. `robots.txt` references the one-page `sitemap.xml`. The error page has `noindex`.

Google Search Console verification and indexing requests are managed separately from Analytics. The Google Analytics measurement ID is `G-VSSH24MEQZ`.

## Brand wording

Use “Start searching for inspo. Start making.” consistently in the homepage and social sharing materials. Drawing and doodling remain the primary focus.
