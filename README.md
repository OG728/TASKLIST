# TaskList App

This project is a simple two-page task management web app.

## What it does
- Add tasks to your to-do list.
- Mark tasks as complete or incomplete.
- Remove tasks you no longer need.
- Save tasks in browser `localStorage` so they persist between refreshes.
- View a calendar page that shows daily completion performance with a red-to-green color gradient:
  - **Red** means low completion for that day.
  - **Green** means high completion for that day.
  - Each day also displays `completed/total` task counts.

## Pages
- `index.html`: Main to-do list interface.
- `calendar.html`: Calendar view with daily completion heatmap.

## Files
- `app.js`: Task creation, completion toggle, deletion, persistence, and rendering logic.
- `calendar.js`: Calendar generation, task aggregation by day, and gradient coloring logic.
- `styles.css`: Shared styling for both pages.

## Running locally
Because this is a static app, you can run it with any simple web server.

Example:

```bash
python3 -m http.server 4173
```

Then open:
- `http://127.0.0.1:4173/index.html`
- `http://127.0.0.1:4173/calendar.html`
