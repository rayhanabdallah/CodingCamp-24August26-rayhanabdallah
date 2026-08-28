# Implementation Plan: To-Do List Live Dashboard

## Overview

Build a fully client-side dashboard as three files: `index.html`, `css/style.css`, and `js/app.js`. All logic is Vanilla JavaScript organised into six comment-banner modules (Storage, Theme, Greeting, Timer, Task, QuickLinks) plus an INIT section. Data is persisted to `localStorage`. No build tools or dependencies are required to run the app.

Tasks 1–14 cover the original dashboard (Requirements 1–15). Tasks 15–20 extend the dashboard with five new features: light/dark theme (Req 16), a custom greeting name (Req 17), a configurable Focus Timer duration (Req 18), duplicate-task prevention (Req 19), and to-do list sorting (Req 20). Property-based tests for the new work validate design Properties 18–28.

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

- [ ] 15. Light / Dark Mode (Req 16)
  - [ ] 15.1 Add the theme toggle top bar and inline theme-bootstrap script to `index.html`
    - Add the `<header class="top-bar">` above `.dashboard-grid` containing `<button id="theme-toggle" aria-label="Toggle light and dark theme">`
    - Add the inline `<script>` in `<head>` that reads `todo_dashboard_theme` from `localStorage` (wrapped in `try/catch`) and sets `data-theme` (`'dark'` or `'light'`) on `document.documentElement` synchronously before CSS paints, defaulting to `'light'` on any error
    - _Requirements: 16.1, 16.3, 16.4_

  - [ ] 15.2 Add dark-theme CSS token overrides, document-root background wiring, and `.top-bar` styles to `css/style.css`
    - Add the `[data-theme="dark"]` selector that overrides the colour tokens (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-danger`, `--color-done`)
    - Set `html` and `body` `background`/`color` from the tokens so the theme covers the whole viewport
    - Add `.top-bar` (flex, right-aligned, padded, centred max-width) and style `#theme-toggle` as a compact secondary button
    - _Requirements: 16.1_

  - [ ] 15.3 Add the `// === THEME MODULE ===` section to `js/app.js`
    - Add `const STORAGE_KEY_THEME = 'todo_dashboard_theme'` to the STORAGE MODULE key constants
    - Implement `applyTheme(theme)`: set the `data-theme` attribute on `document.documentElement` to the given theme
    - Implement `toggleTheme()`: read the current `data-theme`, switch to the other value, call `applyTheme`, and `storageSave(STORAGE_KEY_THEME, ...)` the new value
    - Implement `initTheme()`: `storageLoad(STORAGE_KEY_THEME, 'light')`, `applyTheme` the result, and wire the `#theme-toggle` click handler to `toggleTheme`
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ] 15.4 Wire `initTheme()` first in the `DOMContentLoaded` sequence
    - Update the `DOMContentLoaded` handler in the INIT section so `initTheme()` is called before `initGreeting()`, `initTimer()`, `initTasks()`, and `initQuickLinks()` (theme applied before widgets render)
    - _Requirements: 16.3_

  - [ ]* 15.5 Write unit tests for the Theme module in `theme.test.js`
    - Test `applyTheme('dark')` / `applyTheme('light')` set the correct `data-theme` on the document root
    - Test `toggleTheme()` flips the theme and persists the new value
    - _Requirements: 16.1, 16.2_

- [ ] 16. Custom Greeting Name (Req 17)
  - [ ] 16.1 Add the name entry controls to the greeting widget in `index.html` and CSS
    - Add `<div class="name-input-row">` inside `#greeting-widget` containing `#name-input` (text) and `#name-save-btn`
    - Add `.name-input-row` styles to `css/style.css` (flex row, `#name-input` grows via `flex:1`, button fixed width)
    - _Requirements: 17.1_

  - [ ] 16.2 Add `composeGreeting` and `setPersonalName` and personal-name state to the GREETING MODULE
    - Add `const STORAGE_KEY_NAME = 'todo_dashboard_name'` to the STORAGE MODULE key constants and `let personalName = ''` module state
    - Implement `composeGreeting(hour, name)`: return `getGreeting(hour) + ', ' + name.trim()` when `name` is non-empty after trim, otherwise return `getGreeting(hour)` unchanged
    - Implement `setPersonalName(name)`: reject empty/whitespace (return `false`, leave `personalName` unchanged); on success trim and store `personalName`, `storageSave(STORAGE_KEY_NAME, ...)`, re-render greeting, return `true`
    - _Requirements: 17.1, 17.2, 17.5_

  - [ ] 16.3 Update `tickClock` and `initGreeting` to load, use, and persist the personal name
    - Update `tickClock` to set `#greeting-text` via `composeGreeting(hour, personalName)` instead of `getGreeting(hour)`
    - Update `initGreeting` to `storageLoad(STORAGE_KEY_NAME, '')` into `personalName`, pre-fill `#name-input`, and wire `#name-save-btn` click and `#name-input` Enter key to `setPersonalName`
    - _Requirements: 17.1, 17.3, 17.4_

  - [ ]* 16.4 Write property test for `composeGreeting` with a valid name in `greeting.test.js`
    - **Property 18: composeGreeting appends a valid personal name**
    - **Validates: Requirements 17.1**

  - [ ]* 16.5 Write property test for `composeGreeting` with an empty name in `greeting.test.js`
    - **Property 19: composeGreeting omits an empty personal name**
    - **Validates: Requirements 17.4**

  - [ ]* 16.6 Write property test for `setPersonalName` rejection in `greeting.test.js`
    - **Property 20: setPersonalName rejects empty or whitespace-only names**
    - **Validates: Requirements 17.5**

- [ ] 17. Configurable Focus Timer Duration (Req 18)
  - [ ] 17.1 Add the duration controls to the timer widget in `index.html` and CSS
    - Add `<div class="timer-duration-row">` inside `#timer-widget` containing a `<label>`, `#timer-duration-input` (`type="number"`, `min="1"`, `step="1"`, `value="25"`), and `#timer-duration-save-btn`
    - Add `.timer-duration-row` styles to `css/style.css` (flex row, narrow fixed-width input, Set button)
    - _Requirements: 18.1_

  - [ ] 17.2 Add `durationMinutes` state and `setDuration` to the TIMER MODULE
    - Add `const STORAGE_KEY_TIMER_DURATION = 'todo_dashboard_timer_duration'` to the STORAGE MODULE key constants
    - Change module state to `let durationMinutes = 25` with `let timerSeconds = durationMinutes * 60` derived from it
    - Implement `setDuration(minutes)`: reject any value that is not a positive whole number (zero, negative, non-integer, `NaN`, non-numeric) by returning `false` and leaving `durationMinutes` unchanged; on success set `durationMinutes`, derive `timerSeconds = durationMinutes * 60`, `storageSave(STORAGE_KEY_TIMER_DURATION, ...)`, re-render, return `true`
    - _Requirements: 18.1, 18.2, 18.3_

  - [ ] 17.3 Update `resetTimer` and `initTimer` to use the configured duration
    - Update `resetTimer` to set `timerSeconds = durationMinutes * 60` instead of a fixed `1500`
    - Update `initTimer` to `storageLoad(STORAGE_KEY_TIMER_DURATION, 25)` into `durationMinutes` (default 25), derive `timerSeconds`, pre-fill `#timer-duration-input`, and wire `#timer-duration-save-btn` click and `#timer-duration-input` Enter key to `setDuration`
    - _Requirements: 18.4, 18.5, 18.6_

  - [ ]* 17.4 Write property test for `setDuration` configuring the timer in `timer.test.js`
    - **Property 21: setDuration configures the timer to the given minutes**
    - **Validates: Requirements 18.1**

  - [ ]* 17.5 Write property test for `setDuration` rejecting invalid durations in `timer.test.js`
    - **Property 22: setDuration rejects non-positive or non-whole-number durations**
    - **Validates: Requirements 18.2**

  - [ ]* 17.6 Write property test for `resetTimer` restoring the configured duration in `timer.test.js`
    - **Property 23: resetTimer restores the configured duration**
    - **Validates: Requirements 18.4**

- [ ] 18. Prevent Duplicate Tasks (Req 19)
  - [ ] 18.1 Add the duplicate-task notification banner to the task widget in `index.html` and CSS
    - Add `<div id="task-notification" hidden>` inside `#task-widget`
    - Add `#task-notification` styles to `css/style.css` (`display:none` by default; shown as a highlighted banner using `--color-danger` when a duplicate is rejected)
    - _Requirements: 19.2_

  - [ ] 18.2 Add `isDuplicateTask` and update `addTask` to reject duplicates in the TASK MODULE
    - Implement `isDuplicateTask(description)`: return `true` if `description.trim()` matches (case-insensitively) the trimmed description of any task already in `tasks`
    - Update `addTask` so that, after the empty/whitespace check, a duplicate (per `isDuplicateTask`) returns `false`, unhides `#task-notification`, and leaves the `tasks` array and Local Storage unchanged
    - _Requirements: 19.1, 19.2, 19.3_

  - [ ]* 18.3 Write property test for `addTask` duplicate rejection in `tasks.test.js`
    - **Property 24: addTask rejects case-insensitive duplicate descriptions**
    - **Validates: Requirements 19.1, 19.3**

- [ ] 19. Sort To-Do List (Req 20)
  - [ ] 19.1 Add the sort control to the task widget in `index.html` and CSS
    - Add `<div class="task-sort-row">` inside `#task-widget` containing a `<label>` and `#task-sort-select` with options `creation`, `status`, and `alphabetical`
    - Add `.task-sort-row` styles to `css/style.css` (flex row aligning the label and select)
    - _Requirements: 20.1_

  - [ ] 19.2 Add sort state, `createdAt`, `sortTasks`, and `setSortPreference` to the TASK MODULE
    - Add `const STORAGE_KEY_SORT = 'todo_dashboard_sort'` to the STORAGE MODULE key constants and `let sortPreference = 'creation'` module state
    - Update `createTask` to include a `createdAt: Date.now()` field
    - Implement `sortTasks(taskArray, preference)`: pure, non-mutating; return a new array that is a permutation of the input ordered by `'status'` (incomplete grouped before completed), `'alphabetical'` (ascending `description.toLowerCase()`), or `'creation'` (ascending `createdAt`)
    - Implement `setSortPreference(preference)`: set `sortPreference`, `storageSave(STORAGE_KEY_SORT, ...)`, re-render
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

  - [ ] 19.3 Update `renderTasks` and `initTasks` to apply the sort preference
    - Update `renderTasks` to render `sortTasks(tasks, sortPreference)` rather than `tasks` directly
    - Update `initTasks` to `storageLoad(STORAGE_KEY_SORT, 'creation')` into `sortPreference`, pre-select `#task-sort-select`, and wire its `change` handler to `setSortPreference`
    - _Requirements: 20.1, 20.5, 20.6_

  - [ ]* 19.4 Write property test for `sortTasks` permutation invariant in `tasks.test.js`
    - **Property 25: sortTasks is a permutation of its input**
    - **Validates: Requirements 20.1**

  - [ ]* 19.5 Write property test for `sortTasks` by status in `tasks.test.js`
    - **Property 26: sortTasks by status groups tasks by completed state**
    - **Validates: Requirements 20.2**

  - [ ]* 19.6 Write property test for `sortTasks` alphabetical in `tasks.test.js`
    - **Property 27: sortTasks alphabetical yields case-insensitive ascending order**
    - **Validates: Requirements 20.3**

  - [ ]* 19.7 Write property test for `sortTasks` by creation order in `tasks.test.js`
    - **Property 28: sortTasks by creation order yields ascending createdAt**
    - **Validates: Requirements 20.4**

- [ ] 20. Update the `module.exports` guard and run final feature verification
  - [ ] 20.1 Extend the `module.exports` guard for the new pure functions
    - Add `applyTheme`, `toggleTheme`, `composeGreeting`, `setPersonalName`, `setDuration`, `isDuplicateTask`, `sortTasks`, and `setSortPreference` to the `module.exports` object at the bottom of `js/app.js`
    - _Requirements: TC-1, TC-4_

  - [ ] 20.2 Final checkpoint — end-to-end verification of the new features
    - Verify: theme toggle switches light/dark, persists across reload, and applies before render (no flash)
    - Verify: a saved personal name appears in the greeting and persists; empty/whitespace names are rejected
    - Verify: configured timer duration updates the display, persists, drives Reset, and defaults to 25; invalid values are rejected
    - Verify: adding a case-insensitive duplicate task is rejected and shows the notification
    - Verify: each sort option reorders the list correctly and the preference persists across reload
    - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- All tasks are coding tasks only; no test setup or deployment steps are included per explicit instruction
- The single `js/app.js` file uses comment-banner sections — not ES modules — so it works when opened via `file://` protocol without a local server
- `generateId()` must be defined before any module that calls it (place it at the top of `app.js` or in the Storage module section)
- The `module.exports` guard at the bottom of `app.js` lets the same file be required by Jest without modifying any runtime behaviour in the browser
- Delegated event listeners on `#task-list` and `#link-list` must be attached once (in `initTasks` / `initQuickLinks`) not re-attached on every `renderTasks` / `renderQuickLinks` call
- Tasks 15–20 add the new features (Req 16–20). `initTheme()` must run first in the `DOMContentLoaded` sequence so the theme applies before widgets render; the inline `<head>` bootstrap script prevents a flash of the default theme
- Property-based tests for the new work (Properties 18–28) are marked optional with `*` and live in per-module test files (`theme.test.js`, `greeting.test.js`, `timer.test.js`, `tasks.test.js`)
- New tasks reuse the existing `module.exports` guard so the new pure functions (`composeGreeting`, `setPersonalName`, `setDuration`, `isDuplicateTask`, `sortTasks`, etc.) are testable under Jest/fast-check without changing browser behaviour

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
    { "id": 17, "tasks": ["12.4", "13.1"] },
    { "id": 18, "tasks": ["15.1"] },
    { "id": 19, "tasks": ["15.2"] },
    { "id": 20, "tasks": ["15.3"] },
    { "id": 21, "tasks": ["15.4", "15.5"] },
    { "id": 22, "tasks": ["16.1"] },
    { "id": 23, "tasks": ["16.2"] },
    { "id": 24, "tasks": ["16.3"] },
    { "id": 25, "tasks": ["16.4"] },
    { "id": 26, "tasks": ["16.5"] },
    { "id": 27, "tasks": ["16.6"] },
    { "id": 28, "tasks": ["17.1"] },
    { "id": 29, "tasks": ["17.2"] },
    { "id": 30, "tasks": ["17.3"] },
    { "id": 31, "tasks": ["17.4"] },
    { "id": 32, "tasks": ["17.5"] },
    { "id": 33, "tasks": ["17.6"] },
    { "id": 34, "tasks": ["18.1"] },
    { "id": 35, "tasks": ["18.2"] },
    { "id": 36, "tasks": ["18.3"] },
    { "id": 37, "tasks": ["19.1"] },
    { "id": 38, "tasks": ["19.2"] },
    { "id": 39, "tasks": ["19.3"] },
    { "id": 40, "tasks": ["19.4"] },
    { "id": 41, "tasks": ["19.5"] },
    { "id": 42, "tasks": ["19.6"] },
    { "id": 43, "tasks": ["19.7"] },
    { "id": 44, "tasks": ["20.1"] }
  ]
}
```
