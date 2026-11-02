# Naveen — Terminal Portfolio

A product-manager portfolio with two ways to explore: a scrollable product notebook and a full-screen, keyboard-first terminal with continuous scrollback.

## Run locally

Requires Node.js 22. No dependency installation required.

```sh
node scripts/build-projects.mjs
node server.js
```

Open http://127.0.0.1:4173/.

## Add a project by committing one file

1. Copy `content/projects/billing-system.json` to `content/projects/your-project.json`.
2. Fill in the fields below with your own evidence and project details.
3. Commit the new file to `main`. No application or index changes are needed.
4. GitHub Actions validates the files, generates the catalogue, and deploys `dist` to GitHub Pages once hosting is configured.

```json
{
  "id": "your-project",
  "title": "Your project name",
  "description": "The problem and what you built.",
  "status": "Prototype",
  "type": "PRODUCT CATEGORY",
  "stack": ["React"],
  "order": 6,
  "url": "https://github.com/your-account/your-project",
  "sections": [
    ["Problem", "Who needs this, and why?"],
    ["Decisions", "What did you choose, and what did it cost?"],
    ["Evidence", "What can you substantiate?"]
  ]
}
```

`id` must be unique and use lowercase letters, digits, and hyphens. `url` and `order` are optional; all other fields shown are required. Sections are heading/text pairs. Keep unverified outcomes out of claims. Invalid files fail the build and prevent deployment.

The landing-page index, terminal `/projects`, search, and expanded resume supplement all use the same generated catalogue. For local updates, run `node scripts/build-projects.mjs` and refresh. Never edit `dist/projects.generated.js` by hand.

## One-time GitHub setup

This checkout has no GitHub remote yet. Connect a repository, push `main`, then choose **Settings → Pages → Build and deployment → Source: GitHub Actions**. `.github/workflows/pages.yml` handles subsequent pushes. Pages availability for private repositories depends on the GitHub plan; repository privacy and website visibility are separate settings. The site includes the supplied resume and its contact details.

Until this setup is complete, a local commit does not publish a live website.

## Other content

- `dist/content.js`: profile, socials, Appian experience, and themes.
- `dist/resume.pdf`: the original supplied PDF, unchanged.
- `dist/resume.js`: text extracted from that PDF. The terminal adds the current project catalogue as a clearly labelled supplement.

## Terminal commands

`help`, `projects`, `experience`, `about`, `contact`, `resume`, `theme`, `autofill on`, `autofill off`, `clear`, `history`, and `exit`.

Linux-style commands operate on virtual portfolio content:

- `cd projects`, `ls`, `cd ..`, `pwd`, `tree`
- `cat about`, `cat projects/billing-system`
- `find checkout`, `grep adoption`, `man cat`
- `head`, `tail`, `wc` operate on resume text
- `echo hello`, `date`, `uname`

No operating-system commands are executed. Outputs accumulate until `clear`; `exit` returns to the landing page. Tab accepts autocomplete; arrow keys navigate history or project lists. Theme and autofill preferences persist in the browser.

## Validation

```sh
node scripts/build-projects.mjs
node --check dist/app.js
node --check dist/content.js
node --check dist/projects.generated.js
node --check server.js
```
