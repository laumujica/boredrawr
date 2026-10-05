![Boredrawr — Stop searching for inspo. Start making.](img/boredrawr-social.png)

# Boredrawr

**From a visual identity to a working web app: design, scripting and AI-assisted development.**

Boredrawr is a free drawing and doodle prompt generator for short creative exercises. Choose a mode, set a timer and make something from an unexpected prompt. Writing and free-form modes offer other ways to respond.

**[Open the web app](https://boredrawr.web.app/)** · **[Explore the naming and visual identity on Behance](https://www.behance.net/gallery/223417035/Boredrawr-Naming-Visual-Identity)** · **[My portfolio](https://lauramujica.com/)**

![Boredrawr homepage with creative modes, time limits and the prompt generator.](docs/images/boredrawr-home.jpg)

## Why I made it

Searching for inspiration can become another way to postpone creating. Boredrawr gives people a small starting point: one prompt, a short time limit and room to interpret it in their own way.

**Stop searching for inspo. Start making.**

## My role

I developed the concept, naming and visual identity manually, and directed the project through presentation, web implementation, publication and iteration. I made the visual and product decisions, reviewed the AI-assisted outputs and used feedback to refine the result.

This project brings together my design practice and my interest in improving creative workflows through scripting, automation and AI.

## How the project came together

| Stage | My approach | Output |
| --- | --- | --- |
| Concept and identity | I developed the naming, visual language and brand assets through my established design process. | A visual identity to guide the project. |
| Presentation automation | I created a script to generate the presentation boards for the Behance project. | A way to assemble the visual presentation with less repetitive layout work. |
| First web implementation | I used that presentation as the visual reference for Claude, then reviewed and approved the resulting website. | A working, branded web app. |
| Repository and publication | I used ChatGPT to help configure GitHub and Firebase Hosting, including automatic publication from the repository. | A live site at `boredrawr.web.app` and a repeatable deployment process. |
| Iteration and maintenance | I used ChatGPT to help separate the code and assets, organize the prompts as JSON, and refine copy, layout and the FAQ through GitHub changes. | A clearer project structure and an evolving product. |
| Search and measurement | I added Google Analytics, registered the site in Google Search Console, and worked on page metadata, a sitemap and social sharing previews. | The foundation for measuring use and monitoring search visibility. |

### How I used AI

Claude helped translate an existing visual direction into the first web implementation. ChatGPT helped with code organization, repository and hosting setup, troubleshooting and subsequent improvements. I supplied the direction, evaluated the results and decided which changes to keep.

The app generates prompts by combining words and templates from a local JSON file. It does not call an AI model during use.

## What works today

- Four creative modes: Draw, Doodle, Write and Free.
- Time limits of 15, 30 or 45 seconds, 1 minute or 3 minutes.
- 896 possible prompt combinations across the four modes.
- A completion count stored locally in the user's browser.
- Responsive layout, an explanation of the experience and a separate FAQ.
- Automatic Firebase Hosting deployments through GitHub Actions.

The current version is live and in English. It does not store drawings or writing.

## Next steps

- Refine visual legibility.
- Expand and curate the prompt vocabulary.
- Add a Spanish experience, including grammatically coherent prompts.
- Gather user feedback to guide further improvements.

## Technical notes

Built with **HTML, CSS and vanilla JavaScript**, with **JSON** for prompt content. Hosted on **Firebase Hosting**, with **GitHub Actions** for deployment.

### Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure, content and metadata. |
| `css/styles.css` | Branding, layout and responsive styles. |
| `js/app.js` | Mode selection, prompts, timer, dialogs and completion count. |
| `data/prompts.json` | Adjectives, nouns and mode templates. |
| `img/` | Hero image, favicon and social sharing card. |
| `fonts/` | Included Author Regular, Semibold and Bold font files. |
| `docs/images/` | Screenshots used in this README. |
| `firebase.json` and `.firebaserc` | Firebase Hosting configuration. |
| `.github/workflows/` | Automatic deployments and pull request previews. |

### Local preview

Use VS Code Live Server, or run this command from the project folder:

```bash
python -m http.server 8000
```

Then open [localhost:8000](http://localhost:8000). Serve the files over HTTP so the app can fetch its prompt JSON.

### Editing prompts

`data/prompts.json` contains 14 adjectives, 16 nouns and four mode templates. Templates use `{adjective}` and `{noun}` as placeholders. Add vocabulary without changing the app logic, keep the JSON valid and review the resulting combinations for clarity.

### Deployment, search and sharing

No build step is required. Pushes to `main` trigger publication to Firebase Hosting; pull requests receive preview deployments.

The homepage includes a canonical URL, Open Graph and Twitter card metadata, and WebSite/WebApplication structured data. `robots.txt` references the sitemap, and the error page uses `noindex`. Google Analytics measures site usage; Search Console is managed separately for search visibility.

Use **“Stop searching for inspo. Start making.”** consistently, with drawing and doodling as the primary focus. When replacing the social sharing image, update its version in the metadata to help avoid stale cached previews.

---

**Laura Mujica · 2026 ⚡**  
[lauramujica.com](https://lauramujica.com/)
