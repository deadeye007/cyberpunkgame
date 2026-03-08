# Neon Divide (Cyberpunk CYOA)

A lightweight, mobile-first Choose Your Own Adventure prototype with a futuristic cyberpunk style.

## Features
- Branching story with 10 scenes and 6 endings
- Stats system: Cred, Heat, Humanity
- Back and Restart controls
- Auto-save via localStorage
- Responsive, touch-friendly UI

## Run Locally
Open `index.html` in your browser.

For a local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Content Structure
Story data is in `app.js` inside `STORY`.

Each scene includes:
- `id`
- `title`
- `text`
- `choices` with `label`, `nextSceneId`, and optional `effects`
- optional `ending: true`
