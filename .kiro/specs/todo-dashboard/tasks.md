# Implementation Plan: To-Do List Live Dashboard

## Overview

Build a fully client-side dashboard as three files: `index.html`, `css/style.css`, and `js/app.js`. All logic is Vanilla JavaScript organised into five comment-banner modules (Storage, Greeting, Timer, Task, QuickLinks) plus an INIT section. Data is persisted to `localStorage`. No build tools or dependencies are required to run the app.

---

## Tasks

- [x] 1. Project scaffolding
  - [x] 1.1 Create the `css/` and `js/` directories and their empty entry-point files
    - Create `css/style.css` (empty)
    - Create `js/app.js` (empty)
    - Create `index.html` (empty placeholder)
    - _Requirements: TC-1, TC-4_

- [x] 2. HTML structure (`index.html`)
  - [x] 2.1 Write the full `index.html` document
    - `<!DOCTYPE html>`, `<html lang="en">`, `<head>` with charset, viewport, title, `<link>` to `css/style.css`
    - `<body>` contains a single `<div class="dashboard-grid">` with four `<section>` widgets
    - Widget 1 `#greeting-widget`: `<h1 id="greeting-text">`, `<p id="clock-display">`, `<p id="date-display">`
    - Widget 2 `#timer-widget`: `<p id="timer-display">25:00</p>`, three buttons (`#timer-start`, `#timer-stop` disabled, `#timer-reset`), `<div id="timer-notification" hidden>`
    - Widget 3 `#task-widget`: `#task-input`, `#task-add-btn`, `<ul id="task-list">`, `<p id="task-empty-msg">`
    - Widget 4 `#quicklinks-widget`: `#link-label-input`, `#link-url-input`, `#link-add-btn`, `<ul id="link-list">`, `<p id="link-empty-msg">`
    - `<script src="js/app.js" defer>` before `</body>`
    - _Requirements: TC-4, 1.1, 2.1, 4.1, 7.1, 10.3, 12.1, 14.3_

- [x] 3. Checkpoint — open `index.html` in a browser and confirm the four widget sections render with correct IDs before adding any styles or JS.

- [x] 4. CSS styles (`css/style.css`)
  - [x] 4.1 Define CSS custom properties (design tokens)
    - Colour palette variables: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-danger`, `--color-done`
    - Typography variables: `--font-family`, `--font-size-base`, `--font-size-clock`, `--font-size-timer`
    - Spacing variables: `--space-xs` through `--space-xl`
    - Border-radius variables: `--radius-sm`, `--radius-md`, `--radius-lg`
    - _Requirements: TC-1_

  - [x] 4.2 Implement global reset, body background, and `.dashboard-grid` CSS Grid layout
    - `box-sizing: border-box` reset
    - `body` background `var(--color-bg)`, font family, base font size
    - `.dashboard-grid`: `display:grid`, `grid-template-columns: repeat(2, 1fr)`, gap, max-width, centered margin
    - Responsive breakpoint `@media (max-width: 768px)`: collapse to `grid-template-columns: 1fr`
    - _Requirements: TC-3_

  - [x] 4.3 Style the `.widget` base class and Greeting widget
    - `.widget`: surface colour, border, `border-radius: var(--radius-lg)`, padding, subtle box-shadow
    - `#greeting-text`: large light-weight heading
    - `#clock-display`: monospace, `var(--font-size-clock)`, centred
    - `#date-display`: muted colour, smaller size
    - _Requirements: 1.1, 2.1_

  - [x] 4.4 Style the Focus Timer widget
    - `#timer-display`: monospace, `var(--font-size-timer)`, centred
    - `.timer-controls`: flex row, `gap: var(--space-sm)`, centred
    - Buttons: uniform padding, `var(--radius-sm)`; active/primary button gets `var(--color-primary)` background
    - `#timer-notification`: hidden by default; shown as highlighted banner with `var(--color-primary)` border
    - _Requirements: 4.1, 6.1_

  - [x] 4.5 Style the To-Do List widget
    - `.task-input-row`: flex row, `<input>` grows via `flex:1`, button fixed width
    - `#task-list`: `list-style:none`, `padding:0`
    - Each `<li>`: flex row, `align-items:center`, border-bottom separator
    - `.task-text.completed`: `text-decoration: line-through; color: var(--color-done)`
    - Edit/Delete buttons: small, right-aligned via `margin-left:auto`
    - _Requirements: 7.1, 8.2, 8.3, 9.1_

  - [x] 4.6 Style the Quick Links widget
    - `.link-input-row`: flex row; label and URL inputs share space, button fixed width; wraps on narrow viewports
    - Each link `<li>`: flex row, link text grows, delete button right-aligned
    - `a.quick-link`: `color: var(--color-primary)`, no underline at rest, underline on hover
    - _Requirements: 12.1, 13.2_

- [x] 5. Checkpoint — reload `index.html` and confirm the 2×2 grid layout, widget card styling, and responsive single-column collapse at ≤768 px work as expected.

- [x] 6. JS — Storage module (`js/app.js`)
  - [x] 6.1 Add the `// === STORAGE MODULE ===` section with storage key constants and two functions
    - Define `const STORAGE_KEY_TASKS = 'todo_dashboard_tasks'` and `const STORAGE_KEY_LINKS = 'todo_dashboard_links'`
    - Implement `storageSave(key, value)`: `JSON.stringify` + `localStorage.setItem` wrapped in `try/catch`
    - Implement `storageLoad(key, defaultValue)`: `localStorage.getItem` + `JSON.parse` wrapped in `try/catch`; return `defaultValue` on missing key or parse error
    - _Requirements: TC-2, 7.4, 8.4, 9.4, 11.1, 12.3, 15.1_

- [x] 7. JS — Greeting module (`js/app.js`)
  - [x] 7.1 Implement `getGreeting(hour)` and `generateId()`
    - `getGreeting`: return `"Good Morning"` for hours 5–11, `"Good Afternoon"` for 12–17, `"Good Evening"` for 18–21, `"Good Night"` for 22–23 and 0–4
    - `generateId`: `Date.now() + '_' + Math.random().toString(36).slice(2, 9)`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 7.2 Implement `formatTime(date)` and `formatDate(date)`
    - `formatTime`: extract hours, minutes, seconds; zero-pad each to 2 digits; return `"HH:MM:SS"`
    - `formatDate`: use `Date` methods to build `"DayName, DD MonthName YYYY"` string using day/month name arrays
    - _Requirements: 1.1, 1.3, 2.1, 2.2_

  - [x] 7.3 Implement `tickClock()` and `initGreeting()`
    - `tickClock`: create `new Date()`, call `getGreeting`, `formatTime`, `formatDate`; set `textContent` on `#greeting-text`, `#clock-display`, `#date-display`
    - `initGreeting`: call `tickClock()` immediately, then `setInterval(tickClock, 1000)`
    - _Requirements: 1.2, 2.3, 3.5_

- [x] 8. JS — Timer module (`js/app.js`)
  - [x] 8.1 Implement `formatTimer(seconds)`, module-level state variables, and `renderTimer()`
    - Declare `let timerSeconds = 25 * 60` and `let timerInterval = null`
    - `formatTimer`: compute minutes and remaining seconds, zero-pad both, return `"MM:SS"`
    - `renderTimer`: set `#timer-display` textContent to `formatTimer(timerSeconds)`
    - _Requirements: 4.1_

  - [x] 8.2 Implement `startTimer()`, `stopTimer()`, and `resetTimer()`
    - `startTimer`: guard if `timerInterval` already set; set interval calling `timerTick` every 1000 ms; disable `#timer-start`, enable `#timer-stop`
    - `stopTimer`: `clearInterval(timerInterval)`, set `timerInterval = null`; enable `#timer-start`, disable `#timer-stop`
    - `resetTimer`: call `stopTimer()`, set `timerSeconds = 1500`, call `renderTimer()`; ensure Start enabled, Stop disabled
    - _Requirements: 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4_

  - [x] 8.3 Implement `timerTick()` and `onTimerComplete()`
    - `timerTick`: decrement `timerSeconds`; call `renderTimer()`; if `timerSeconds <= 0` call `onTimerComplete()`
    - `onTimerComplete`: unhide `#timer-notification`; fire `Notification` API only if `Notification.permission === 'granted'`; call `resetTimer()`
    - _Requirements: 4.3, 6.1, 6.2, 6.3_

  - [x] 8.4 Implement `initTimer()`
    - Wire click listeners on `#timer-start` → `startTimer`, `#timer-stop` → `stopTimer`, `#timer-reset` → `resetTimer`
    - Call `renderTimer()` to show initial `25:00`
    - _Requirements: 4.2, 5.1, 5.3_

- [x] 9. Checkpoint — reload and manually test the Focus Timer: Start begins countdown, Stop pauses, Reset returns to 25:00, and the notification banner appears at 00:00.

- [x] 10. JS — Task module (`js/app.js`)
  - [x] 10.1 Implement `createTask(description)`, module state `let tasks = []`, and `addTask(description)`
    - `createTask`: return `{ id: generateId(), description: description.trim(), completed: false }`
    - `addTask`: trim input; return `false` if empty/whitespace; push `createTask(description)` onto `tasks`; call `storageSave`; call `renderTasks()`; return `true`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 10.2 Implement `toggleTask(id)` and `deleteTask(id)`
    - `toggleTask`: find task by id, flip `completed`; `storageSave`; `renderTasks()`
    - `deleteTask`: filter out task with matching id; `storageSave`; `renderTasks()`
    - _Requirements: 8.1, 8.4, 10.1, 10.2_

  - [x] 10.3 Implement `editTask(id, newDescription)`, `enterEditMode(id)`, and `exitEditMode(id, save)`
    - `editTask`: trim `newDescription`; return `false` if empty; update matching task's `description`; `storageSave`; return `true`
    - `enterEditMode`: find the `<li>` with `data-id`, replace the `<span class="task-text">` with `<input class="task-edit-input">` pre-filled with current description and a `<button class="task-save-btn">Save</button>`
    - `exitEditMode(id, save)`: if `save`, call `editTask`; replace edit input back with `<span>`; if `editTask` returned `false`, restore original text
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 10.4 Implement `renderTasks()`
    - Clear `#task-list`; if `tasks` is empty, show `#task-empty-msg` and return
    - For each task, build `<li data-id="{id}">` with checkbox, `<span class="task-text">` (add `.completed` class when done), Edit button, Delete button
    - Hide `#task-empty-msg` when list is non-empty
    - Use event delegation on `#task-list` via `closest()` to handle checkbox change, edit click, delete click — attach only once inside `initTasks`, not on every render
    - _Requirements: 7.1, 8.2, 8.3, 10.2, 10.3_

  - [x] 10.5 Implement `initTasks()`
    - Load tasks: `const loaded = storageLoad(STORAGE_KEY_TASKS, [])` then `tasks = Array.isArray(loaded) ? loaded : []`
    - Wire `#task-add-btn` click → call `addTask(#task-input.value)`, clear input on success, keep focus on failure
    - Wire `keydown` on `#task-input` for `Enter` key → same logic
    - Attach one delegated listener on `#task-list` for checkbox, edit, delete interactions
    - Call `renderTasks()`
    - _Requirements: 7.1, 7.2, 7.3, 11.1, 11.2, 11.3_

- [x] 11. Checkpoint — reload and test full task CRUD: add tasks (empty input rejected), check/uncheck, edit and save (empty save rejected, restores original), delete, verify persistence across page reload.

- [ ] 12. JS — Quick Links module (`js/app.js`)
  - [x] 12.1 Implement `normaliseUrl(url)`, `createQuickLink(label, url)`, module state `let quickLinks = []`
    - `normaliseUrl`: if `url` does not start with `"http://"` or `"https://"`, prepend `"https://"`
    - `createQuickLink`: return `{ id: generateId(), label: label.trim(), url: normaliseUrl(url.trim()) }`
    - _Requirements: 12.4, 13.1_

  - [~] 12.2 Implement `addQuickLink(label, url)` and `deleteQuickLink(id)`
    - `addQuickLink`: trim both; return `false` (and apply error class to the relevant input) if either is empty/whitespace; push `createQuickLink`; `storageSave`; `renderQuickLinks()`; return `true`
    - `deleteQuickLink`: filter out matching id; `storageSave`; `renderQuickLinks()`
    - _Requirements: 12.1, 12.2, 12.3, 14.1, 14.2_

  - [~] 12.3 Implement `renderQuickLinks()`
    - Clear `#link-list`; if `quickLinks` is empty, show `#link-empty-msg` and return
    - For each link, build `<li data-id="{id}">` containing `<a class="quick-link" href="{url}" target="_blank" rel="noopener noreferrer">{label}</a>` and a `<button class="link-delete-btn">Delete</button>`
    - Hide `#link-empty-msg` when list is non-empty
    - _Requirements: 13.1, 13.2, 13.3, 14.2, 14.3_

  - [~] 12.4 Implement `initQuickLinks()`
    - Load links: `const loaded = storageLoad(STORAGE_KEY_LINKS, [])` then `quickLinks = Array.isArray(loaded) ? loaded : []`
    - Wire `#link-add-btn` click → call `addQuickLink(labelInput.value, urlInput.value)`, clear both inputs on success
    - Attach delegated listener on `#link-list` for delete button clicks
    - Call `renderQuickLinks()`
    - _Requirements: 12.1, 14.1, 15.1, 15.2, 15.3_

- [ ] 13. JS — INIT section (`js/app.js`)
  - [~] 13.1 Add the `module.exports` guard for test-environment compatibility, then wire the `DOMContentLoaded` init call
    - Add at the very bottom of `app.js` the `if (typeof module !== 'undefined') { module.exports = { ... } }` guard exporting all pure functions
    - Wire: `document.addEventListener('DOMContentLoaded', () => { initGreeting(); initTimer(); initTasks(); initQuickLinks(); })`
    - _Requirements: TC-1, TC-4_

- [~] 14. Final checkpoint — full end-to-end verification
  - Open `index.html` in Chrome, Firefox, Edge, and Safari (or at minimum Chrome and Firefox)
  - Verify: clock ticks every second, date updates at midnight boundary logic, greeting changes by hour
  - Verify: timer counts down, Stop/Reset work, notification banner appears at 00:00
  - Verify: tasks add/toggle/edit/delete with `localStorage` persistence across reload
  - Verify: quick links add/delete with correct `target="_blank"` and `rel="noopener noreferrer"`, `localStorage` persistence
  - Verify: 2×2 grid on wide viewport, single-column on ≤768 px
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- All tasks are coding tasks only; no test setup or deployment steps are included per explicit instruction
- The single `js/app.js` file uses comment-banner sections — not ES modules — so it works when opened via `file://` protocol without a local server
- `generateId()` must be defined before any module that calls it (place it at the top of `app.js` or in the Storage module section)
- The `module.exports` guard at the bottom of `app.js` lets the same file be required by Jest without modifying any runtime behaviour in the browser
- Delegated event listeners on `#task-list` and `#link-list` must be attached once (in `initTasks` / `initQuickLinks`) not re-attached on every `renderTasks` / `renderQuickLinks` call

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4", "4.5", "4.6"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["7.1"] },
    { "id": 6, "tasks": ["7.2"] },
    { "id": 7, "tasks": ["7.3", "8.1"] },
    { "id": 8, "tasks": ["8.2"] },
    { "id": 9, "tasks": ["8.3", "8.4"] },
    { "id": 10, "tasks": ["10.1"] },
    { "id": 11, "tasks": ["10.2", "10.3"] },
    { "id": 12, "tasks": ["10.4"] },
    { "id": 13, "tasks": ["10.5"] },
    { "id": 14, "tasks": ["12.1"] },
    { "id": 15, "tasks": ["12.2"] },
    { "id": 16, "tasks": ["12.3"] },
    { "id": 17, "tasks": ["12.4", "13.1"] }
  ]
}
```
