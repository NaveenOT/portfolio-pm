# Terminal Portfolio

A keyboard-first product manager portfolio with a landing page and full-screen terminal.

## Run locally

Requires Node.js. No dependency installation or build is needed.

```sh
node server.js
```

Open http://127.0.0.1:4173/.

## Features

- Continuous command output and scrollback
- Keyboard-navigable project lists and inline case studies
- Command history, autofill toggle, and theme preferences
- `clear` resets the screen; `exit` returns to the landing page
- `resume` displays extracted text and opens the original PDF

## Content

Edit `dist/content.js` for profile, projects, and experience. Projects and experience currently contain clearly labelled placeholders. `dist/resume.pdf` is the supplied resume; `dist/resume.js` holds its extracted text.

The resume contains personal contact details. This repository is intended to start private.

## Checks

```sh
node --check dist/app.js
node --check dist/content.js
node --check dist/resume.js
node --check server.js
```

Theme and autofill preferences are stored in the browser. Command history is kept in memory for the current page session.
