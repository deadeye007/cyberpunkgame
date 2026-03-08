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

## Run With Docker
Build the image:

```bash
docker build -t neon-divide .
```

Run the container:

```bash
docker run --rm -p 8080:80 --name neon-divide neon-divide
```

Then visit `http://localhost:8080`.

Stop it:

```bash
docker stop neon-divide
```

## Content Structure
Story data is in `app.js` inside `STORY`.

Each scene includes:
- `id`
- `title`
- `text`
- `choices` with `label`, `nextSceneId`, and optional `effects`
- optional `ending: true`
