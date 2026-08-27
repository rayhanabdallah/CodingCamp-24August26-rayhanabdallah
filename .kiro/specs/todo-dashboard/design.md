# Design: To-Do List Live Dashboard

## Overview

The To-Do List Live Dashboard is a fully client-side single-page application (SPA) delivered as a single `index.html` file. There is no build step, no framework, and no backend. All logic lives in one JavaScript file (`js/app.js`) and all styling lives in one CSS file (`css/style.css`).

The dashboard is divided into four functional widgets:

1. **Greeting Widget** — live clock, date, and time-based greeting
2. **Focus Timer** — 25-minute Pomodoro countdown with Start / Stop / Reset controls
3. **To-Do List** — CRUD task management persisted to Local Storage
4. **Quick Links** — saved URL shortcuts that open in new tabs, persisted to Local Storage

The design prioritises simplicity: no dependencies to download, instant load, and zero configuration for the end user.

---

## Architecture

### High-Level Structure

```
index.html          ← single HTML entry point
css/
  style.css         ← all styles (variables, layout, widgets, responsive)
js/
  app.js            ← all JavaScript (modules separated by comment banners)
```

### Execution Model

```
Browser loads index.html
  └─ <link> loads css/style.css
  └─ <script defer> loads js/app.js
       └─ DOMContentLoaded fires
            ├─ STORAGE MODULE   — reads localStorage, returns parsed data
            ├─ GREETING MODULE  — starts clock interval, renders greeting
            ├─ TIMER MODULE     — initialises timer display, wires buttons
            ├─ TASK MODULE      — renders saved tasks, wires add/edit/delete
            ├─ QUICKLINKS MODULE — renders saved links, wires add/delete
            └─ INIT             — calls all module init functions
```

Because there is only one JS file, modules are not ES modules — they are plain JavaScript objects / IIFE-style namespaced sections, separated by clearly named comment banners. There is no `import`/`export`.

### Data Flow

```
User interaction
  └─ Event listener (in module)
       ├─ Mutates in-memory state (module-level array/object)
       ├─ Calls STORAGE MODULE to persist to localStorage
       └─ Calls render function to update the DOM
```

---

## Components and Interfaces

### 1. Greeting Widget

**HTML anchor:** `<section id="greeting-widget">`

**Sub-elements:**
| Element | ID | Role |
|---|---|---|
| `<h1>` | `#greeting-text` | Displays "Good Morning / Afternoon / Evening / Night" |
| `<p>` | `#clock-display` | Live HH:MM:SS clock |
| `<p>` | `#date-display` | Full date string |

**Module:** `// === GREETING MODULE ===`

**Key functions:**

```js
/**
 * Returns the greeting string for a given hour (0-23).
 * @param {number} hour - The current hour in 24-hour format.
 * @returns {string} One of "Good Morning", "Good Afternoon", "Good Evening", "Good Night"
 */
function getGreeting(hour) {}

/**
 * Formats a Date object as "HH:MM:SS" (24-hour, zero-padded).
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {}

/**
 * Formats a Date object as "DayName, DD MonthName YYYY".
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {}

/**
 * Updates #greeting-text, #clock-display, and #date-display with current values.
 * Called every second via setInterval.
 */
function tickClock() {}

/**
 * Initialises the greeting widget: calls tickClock() immediately, then sets a
 * 1000 ms interval.
 */
function initGreeting() {}
```

---

### 2. Focus Timer

**HTML anchor:** `<section id="timer-widget">`

**Sub-elements:**
| Element | ID | Role |
|---|---|---|
| `<p>` | `#timer-display` | MM:SS countdown display |
| `<button>` | `#timer-start` | Starts the countdown |
| `<button>` | `#timer-stop` | Pauses the countdown |
| `<button>` | `#timer-reset` | Resets to 25:00 |
| `<div>` | `#timer-notification` | Hidden banner shown on completion |

**Module:** `// === TIMER MODULE ===`

**Internal state (module-level variables):**
```js
let timerSeconds = 25 * 60;   // remaining seconds
let timerInterval = null;      // setInterval handle, null when stopped
```

**Key functions:**

```js
/**
 * Formats a total number of seconds as "MM:SS".
 * @param {number} seconds - Non-negative integer.
 * @returns {string}
 */
function formatTimer(seconds) {}

/**
 * Renders the current timerSeconds value into #timer-display.
 */
function renderTimer() {}

/**
 * Starts the countdown interval. Disables Start, enables Stop.
 */
function startTimer() {}

/**
 * Pauses the countdown by clearing the interval. Enables Start, disables Stop.
 */
function stopTimer() {}

/**
 * Clears the interval, resets timerSeconds to 1500, re-renders, updates buttons.
 */
function resetTimer() {}

/**
 * Called each tick. Decrements timerSeconds; if it reaches 0, calls onTimerComplete().
 */
function timerTick() {}

/**
 * Shows #timer-notification, plays a notification sound or fires the
 * Notifications API if permission is granted, then resets the timer.
 */
function onTimerComplete() {}

/**
 * Wires Start/Stop/Reset button click handlers. Calls renderTimer().
 */
function initTimer() {}
```

---

### 3. To-Do List

**HTML anchor:** `<section id="task-widget">`

**Sub-elements:**
| Element | ID | Role |
|---|---|---|
| `<input>` | `#task-input` | New task description entry |
| `<button>` | `#task-add-btn` | Triggers task addition |
| `<ul>` | `#task-list` | Container for rendered task items |
| `<p>` | `#task-empty-msg` | Shown when task list is empty |

Each task is rendered as an `<li>` with the following internal structure:

```html
<li data-id="{id}">
  <input type="checkbox" class="task-checkbox" />
  <span class="task-text"></span>
  <button class="task-edit-btn">Edit</button>
  <button class="task-delete-btn">Delete</button>
</li>
```

When editing, `<span class="task-text">` is replaced with `<input class="task-edit-input">` + `<button class="task-save-btn">Save</button>`.

**Module:** `// === TASK MODULE ===`

**Internal state:**
```js
let tasks = [];   // Array of Task objects loaded from / synced to localStorage
```

**Key functions:**

```js
/**
 * Creates a new Task object with a generated ID.
 * @param {string} description - Non-empty, trimmed task text.
 * @returns {Task}
 */
function createTask(description) {}

/**
 * Adds a task to the tasks array, persists, and re-renders.
 * Returns false and does nothing if description is empty/whitespace.
 * @param {string} description
 * @returns {boolean}
 */
function addTask(description) {}

/**
 * Toggles the completed state of the task with the given id.
 * @param {string} id
 */
function toggleTask(id) {}

/**
 * Updates the description of the task with the given id.
 * Rejects empty/whitespace values (returns false).
 * @param {string} id
 * @param {string} newDescription
 * @returns {boolean}
 */
function editTask(id, newDescription) {}

/**
 * Removes the task with the given id from the array, persists, re-renders.
 * @param {string} id
 */
function deleteTask(id) {}

/**
 * Renders the full task list into #task-list.
 * Shows #task-empty-msg when tasks array is empty.
 */
function renderTasks() {}

/**
 * Switches a task list item into inline edit mode.
 * @param {string} id
 */
function enterEditMode(id) {}

/**
 * Exits inline edit mode for a task, saving or discarding changes.
 * @param {string} id
 * @param {boolean} save
 */
function exitEditMode(id, save) {}

/**
 * Loads tasks from localStorage, wires the Add button and Enter-key listener.
 */
function initTasks() {}
```

---

### 4. Quick Links

**HTML anchor:** `<section id="quicklinks-widget">`

**Sub-elements:**
| Element | ID | Role |
|---|---|---|
| `<input>` | `#link-label-input` | New link label entry |
| `<input>` | `#link-url-input` | New link URL entry |
| `<button>` | `#link-add-btn` | Triggers link addition |
| `<ul>` | `#link-list` | Container for rendered link items |
| `<p>` | `#link-empty-msg` | Shown when link list is empty |

Each link is rendered as an `<li>` with:

```html
<li data-id="{id}">
  <a class="quick-link" href="{url}" target="_blank" rel="noopener noreferrer">{label}</a>
  <button class="link-delete-btn">Delete</button>
</li>
```

**Module:** `// === QUICKLINKS MODULE ===`

**Internal state:**
```js
let quickLinks = [];   // Array of QuickLink objects loaded from / synced to localStorage
```

**Key functions:**

```js
/**
 * Ensures a URL string has a protocol prefix.
 * If the URL does not start with "http://" or "https://", prepends "https://".
 * @param {string} url
 * @returns {string}
 */
function normaliseUrl(url) {}

/**
 * Creates a new QuickLink object with a generated ID.
 * @param {string} label - Non-empty user-provided label.
 * @param {string} url   - URL (will be normalised).
 * @returns {QuickLink}
 */
function createQuickLink(label, url) {}

/**
 * Validates inputs, creates a link, persists, and re-renders.
 * Returns false if label or url is empty/whitespace.
 * @param {string} label
 * @param {string} url
 * @returns {boolean}
 */
function addQuickLink(label, url) {}

/**
 * Removes the link with the given id, persists, re-renders.
 * @param {string} id
 */
function deleteQuickLink(id) {}

/**
 * Renders the full quick links list into #link-list.
 * Shows #link-empty-msg when quickLinks array is empty.
 */
function renderQuickLinks() {}

/**
 * Loads links from localStorage, wires the Add button.
 */
function initQuickLinks() {}
```

---

### 5. Storage Module

**Module:** `// === STORAGE MODULE ===`

Thin wrapper over `localStorage`. All keys are constants defined at the top.

```js
const STORAGE_KEY_TASKS = 'todo_dashboard_tasks';
const STORAGE_KEY_LINKS = 'todo_dashboard_links';

/**
 * Serialises value as JSON and saves it to localStorage under key.
 * @param {string} key
 * @param {*} value
 */
function storageSave(key, value) {}

/**
 * Reads and JSON-parses the value at key. Returns defaultValue if absent or unparseable.
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
function storageLoad(key, defaultValue) {}
```

---

## Data Models

### Task Object

Stored in `localStorage` under key `todo_dashboard_tasks` as a JSON array of Task objects.

```jsonc
// Task
{
  "id": "string",          // Unique identifier — Date.now() + Math.random() string
  "description": "string", // Non-empty user-provided text
  "completed": false        // boolean — true when task is marked done
}
```

**Example:**
```json
[
  {
    "id": "1724657234512_0.4821",
    "description": "Review pull request #42",
    "completed": false
  },
  {
    "id": "1724657250000_0.1234",
    "description": "Write unit tests",
    "completed": true
  }
]
```

### QuickLink Object

Stored in `localStorage` under key `todo_dashboard_links` as a JSON array of QuickLink objects.

```jsonc
// QuickLink
{
  "id": "string",    // Unique identifier — Date.now() + Math.random() string
  "label": "string", // User-provided display label
  "url": "string"    // Full URL, always including https:// or http:// prefix
}
```

**Example:**
```json
[
  {
    "id": "1724657300000_0.9912",
    "label": "GitHub",
    "url": "https://github.com"
  },
  {
    "id": "1724657310000_0.3345",
    "label": "MDN Docs",
    "url": "https://developer.mozilla.org"
  }
]
```

---

## HTML Layout Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <div class="dashboard-grid">

    <!-- Widget 1: Greeting -->
    <section id="greeting-widget" class="widget">
      <h1 id="greeting-text"></h1>
      <p id="clock-display"></p>
      <p id="date-display"></p>
    </section>

    <!-- Widget 2: Focus Timer -->
    <section id="timer-widget" class="widget">
      <h2>Focus Timer</h2>
      <p id="timer-display">25:00</p>
      <div class="timer-controls">
        <button id="timer-start">Start</button>
        <button id="timer-stop" disabled>Stop</button>
        <button id="timer-reset">Reset</button>
      </div>
      <div id="timer-notification" hidden>Session complete! Take a break.</div>
    </section>

    <!-- Widget 3: To-Do List -->
    <section id="task-widget" class="widget">
      <h2>To-Do</h2>
      <div class="task-input-row">
        <input id="task-input" type="text" placeholder="Add a task..." />
        <button id="task-add-btn">Add</button>
      </div>
      <ul id="task-list"></ul>
      <p id="task-empty-msg">No tasks yet. Add one above!</p>
    </section>

    <!-- Widget 4: Quick Links -->
    <section id="quicklinks-widget" class="widget">
      <h2>Quick Links</h2>
      <div class="link-input-row">
        <input id="link-label-input" type="text" placeholder="Label" />
        <input id="link-url-input" type="url" placeholder="https://..." />
        <button id="link-add-btn">Add</button>
      </div>
      <ul id="link-list"></ul>
      <p id="link-empty-msg">No links saved yet.</p>
    </section>

  </div>

  <script src="js/app.js" defer></script>
</body>
</html>
```

---

## CSS Design Approach

### Custom Properties (Design Tokens)

```css
:root {
  /* Colour Palette */
  --color-bg:        #f5f5f0;
  --color-surface:   #ffffff;
  --color-border:    #e0e0da;
  --color-text:      #2c2c2c;
  --color-text-muted:#888880;
  --color-primary:   #4f7cff;
  --color-danger:    #e05555;
  --color-done:      #aaaaaa;

  /* Typography */
  --font-family:     'Segoe UI', system-ui, sans-serif;
  --font-size-base:  16px;
  --font-size-clock: 2.5rem;
  --font-size-timer: 3rem;

  /* Spacing */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

### Layout

The dashboard uses CSS Grid for the top-level layout. On wide viewports the four widgets are arranged in a 2×2 grid. On narrow viewports (≤768 px) it collapses to a single column.

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  padding: var(--space-xl);
  max-width: 1100px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    padding: var(--space-md);
  }
}
```

### Widget Base Style

```css
.widget {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
```

### Greeting Widget

- `#greeting-text`: Large, light-weight heading, no margin-bottom
- `#clock-display`: Monospace font, `var(--font-size-clock)`, centred
- `#date-display`: Muted colour, smaller size

### Focus Timer Widget

- `#timer-display`: Large monospace display, `var(--font-size-timer)`, centred
- `.timer-controls`: flex row, `gap: var(--space-sm)`, centred
- Buttons: styled uniformly; the active-state button gets `--color-primary` background
- `#timer-notification`: `display:none` by default; shown as a highlighted banner with `--color-primary` border when timer completes

### To-Do List Widget

- `.task-input-row`: flex row with `<input>` growing via `flex:1` and button fixed width
- `#task-list`: unstyled list (`list-style:none`, `padding:0`)
- Each `<li>`: flex row, `align-items:center`, border-bottom separator
- `.task-text.completed`: `text-decoration: line-through; color: var(--color-done)`
- Edit/Delete buttons: small icon-style buttons, right-aligned via `margin-left:auto`

### Quick Links Widget

- `.link-input-row`: flex row; label input and url input share space, button fixed width
- On narrow viewports, input row wraps to two lines
- Each link `<li>`: flex row with link text growing and delete button right-aligned
- `a.quick-link`: `color: var(--color-primary)`, no underline on rest state, underline on hover

---

## JavaScript Architecture — `js/app.js`

The single JS file is organised into clearly named sections using comment banners. Each section is self-contained and communicates with others only through function calls (no global mutable variables except the state arrays for tasks and links).

```
// ================================================================
// === STORAGE MODULE ===
// ================================================================
//   storageSave(key, value)
//   storageLoad(key, defaultValue)

// ================================================================
// === GREETING MODULE ===
// ================================================================
//   getGreeting(hour)     → string
//   formatTime(date)      → "HH:MM:SS"
//   formatDate(date)      → "DayName, DD Month YYYY"
//   tickClock()
//   initGreeting()

// ================================================================
// === TIMER MODULE ===
// ================================================================
//   formatTimer(seconds)  → "MM:SS"
//   renderTimer()
//   startTimer()
//   stopTimer()
//   resetTimer()
//   timerTick()
//   onTimerComplete()
//   initTimer()

// ================================================================
// === TASK MODULE ===
// ================================================================
//   createTask(description) → Task
//   addTask(description)    → boolean
//   toggleTask(id)
//   editTask(id, desc)      → boolean
//   deleteTask(id)
//   renderTasks()
//   enterEditMode(id)
//   exitEditMode(id, save)
//   initTasks()

// ================================================================
// === QUICKLINKS MODULE ===
// ================================================================
//   normaliseUrl(url)          → string
//   createQuickLink(label, url) → QuickLink
//   addQuickLink(label, url)   → boolean
//   deleteQuickLink(id)
//   renderQuickLinks()
//   initQuickLinks()

// ================================================================
// === INIT ===
// ================================================================
//   document.addEventListener('DOMContentLoaded', () => {
//     initGreeting();
//     initTimer();
//     initTasks();
//     initQuickLinks();
//   });
```

### ID Generation

```js
function generateId() {
  return Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}
```

### Event Handling Approach

| Trigger | Handler Location | Method |
|---|---|---|
| `DOMContentLoaded` | INIT section | `addEventListener` |
| Clock tick (1 s) | GREETING MODULE | `setInterval` |
| Timer tick (1 s) | TIMER MODULE | `setInterval` stored in `timerInterval` |
| Start / Stop / Reset clicks | TIMER MODULE `initTimer()` | `addEventListener('click')` per button |
| Add task (button click) | TASK MODULE `initTasks()` | `addEventListener('click')` on `#task-add-btn` |
| Add task (Enter key) | TASK MODULE `initTasks()` | `addEventListener('keydown')` on `#task-input` |
| Task checkbox, edit, delete | TASK MODULE `renderTasks()` | Event delegation on `#task-list` via `closest()` |
| Add link (button click) | QUICKLINKS MODULE `initQuickLinks()` | `addEventListener('click')` on `#link-add-btn` |
| Delete link | QUICKLINKS MODULE `renderQuickLinks()` | Event delegation on `#link-list` |

Event delegation is used for the task list and quick links list to avoid re-attaching listeners on every render.

---


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: formatTime produces a zero-padded 24-hour HH:MM:SS string

*For any* valid `Date` object, `formatTime(date)` SHALL return a string that matches the regular expression `^\d{2}:\d{2}:\d{2}$`, with hours in the range 00–23, minutes 00–59, and seconds 00–59.

**Validates: Requirements 1.1, 1.3**

---

### Property 2: formatDate contains all required components

*For any* valid `Date` object, `formatDate(date)` SHALL return a string that contains a full day name (e.g., "Monday"), a numeric day, a full month name (e.g., "August"), and a four-digit year, all present in the output.

**Validates: Requirements 2.1, 2.2**

---

### Property 3: getGreeting is correct for every hour in [0, 23]

*For any* integer hour in the range 0–23, `getGreeting(hour)` SHALL return:
- `"Good Morning"` when `hour` ∈ [5, 11]
- `"Good Afternoon"` when `hour` ∈ [12, 17]
- `"Good Evening"` when `hour` ∈ [18, 21]
- `"Good Night"` when `hour` ∈ [22, 23] ∪ [0, 4]

No other string is ever returned.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

---

### Property 4: formatTimer produces a zero-padded MM:SS string

*For any* non-negative integer `seconds` in the range [0, 1500], `formatTimer(seconds)` SHALL return a string matching `^\d{2}:\d{2}$`, where minutes and seconds are both zero-padded to two digits and the total encoded seconds equals the input.

**Validates: Requirements 4.1**

---

### Property 5: Valid task addition grows the task list by exactly one

*For any* existing task list state and any non-empty, non-whitespace-only string `description`, calling `addTask(description)` SHALL increase the length of the in-memory `tasks` array by exactly 1, and the new task SHALL have `description` equal to the trimmed input and `completed` equal to `false`.

**Validates: Requirements 7.1**

---

### Property 6: Whitespace-only task descriptions are always rejected

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), calling `addTask(description)` SHALL return `false` and leave the `tasks` array unchanged.

**Validates: Requirements 7.2**

---

### Property 7: Task storage round-trip preserves all task data

*For any* sequence of `addTask`, `toggleTask`, and `editTask` operations, the JSON value stored in `localStorage` under `todo_dashboard_tasks` SHALL, when parsed, contain an array whose entries match the current in-memory `tasks` array in `id`, `description`, and `completed` for every element.

**Validates: Requirements 7.4, 8.4, 9.4, 11.1, 11.2**

---

### Property 8: toggleTask always inverts the completed state

*For any* task in the `tasks` array with a known `completed` value, calling `toggleTask(id)` SHALL result in that task's `completed` value being the logical negation of its previous value, and all other tasks SHALL remain unchanged.

**Validates: Requirements 8.1, 8.3**

---

### Property 9: editTask with a valid description always updates the description

*For any* task in the `tasks` array, calling `editTask(id, newDescription)` with a non-empty, non-whitespace-only `newDescription` SHALL set that task's `description` to `newDescription.trim()` and return `true`, while leaving all other task fields and all other tasks unchanged.

**Validates: Requirements 9.2**

---

### Property 10: editTask with a whitespace-only value is always rejected

*For any* task in the `tasks` array and any whitespace-only string `newDescription`, calling `editTask(id, newDescription)` SHALL return `false` and leave the task's `description` unchanged.

**Validates: Requirements 9.3**

---

### Property 11: deleteTask removes exactly the targeted task

*For any* task with id `targetId` present in the `tasks` array, calling `deleteTask(targetId)` SHALL result in a `tasks` array that does not contain any task with `id === targetId`, and all other tasks SHALL remain present and unchanged.

**Validates: Requirements 10.1**

---

### Property 12: Valid quick link addition grows the list by exactly one

*For any* existing quick links state and any non-empty, non-whitespace label and non-empty, non-whitespace URL, calling `addQuickLink(label, url)` SHALL increase the length of the `quickLinks` array by exactly 1, and the new entry SHALL have `label` equal to the trimmed input and `url` equal to the normalised URL.

**Validates: Requirements 12.1**

---

### Property 13: Empty or whitespace label/URL is always rejected for quick links

*For any* call to `addQuickLink(label, url)` where either `label` or `url` (or both) is empty or whitespace-only, the function SHALL return `false` and leave the `quickLinks` array unchanged.

**Validates: Requirements 12.2**

---

### Property 14: Quick links storage round-trip preserves all link data

*For any* sequence of `addQuickLink` and `deleteQuickLink` operations, the JSON value stored in `localStorage` under `todo_dashboard_links` SHALL, when parsed, contain an array whose entries match the current in-memory `quickLinks` array in `id`, `label`, and `url` for every element.

**Validates: Requirements 12.3, 15.1, 15.2**

---

### Property 15: normaliseUrl always produces a URL with a protocol prefix

*For any* non-empty string `url`, `normaliseUrl(url)` SHALL return a string that starts with either `"http://"` or `"https://"`. Specifically, if `url` does not already begin with `"http://"` or `"https://"`, the result SHALL be `"https://" + url`.

**Validates: Requirements 12.4**

---

### Property 16: Every rendered quick link has rel="noopener noreferrer"

*For any* `QuickLink` object in the `quickLinks` array, the corresponding `<a>` element rendered into `#link-list` SHALL have its `rel` attribute equal to `"noopener noreferrer"`.

**Validates: Requirements 13.3**

---

### Property 17: deleteQuickLink removes exactly the targeted link

*For any* quick link with id `targetId` present in the `quickLinks` array, calling `deleteQuickLink(targetId)` SHALL result in a `quickLinks` array that does not contain any entry with `id === targetId`, and all other entries SHALL remain present and unchanged.

**Validates: Requirements 14.1**

---

## Error Handling

### Input Validation

All user-facing inputs are validated before any state mutation or persistence occurs. Validation is synchronous and returns `false` (no mutation) on failure.

| Input | Validation Rule | On Failure |
|---|---|---|
| New task description | Must be non-empty after `trim()` | Return `false`; keep focus on `#task-input` |
| Edit task description | Must be non-empty after `trim()` | Return `false`; restore original display text |
| Quick link label | Must be non-empty after `trim()` | Return `false`; apply error class to `#link-label-input` |
| Quick link URL | Must be non-empty after `trim()` | Return `false`; apply error class to `#link-url-input` |

### localStorage Errors

`localStorage` access can throw in private browsing mode (quota exceeded, `SecurityError`). All calls to `storageSave` and `storageLoad` are wrapped in `try/catch`:

```js
function storageSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Dashboard] localStorage write failed:', e);
  }
}

function storageLoad(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn('[Dashboard] localStorage read failed:', e);
    return defaultValue;
  }
}
```

If `storageLoad` fails, the module falls back to the `defaultValue` (empty array `[]`), so the dashboard still renders and functions correctly — data just will not be persisted between sessions.

### Notification API Permission

The timer completion notification uses the Notifications API only if permission has already been granted. It does **not** proactively request permission; it falls back to an on-screen banner (`#timer-notification`) in all other cases.

```js
function onTimerComplete() {
  // Always show on-screen banner
  document.getElementById('timer-notification').hidden = false;

  // Only use Notification API if already permitted
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('Focus Timer', { body: 'Session complete! Take a break.' });
  }

  resetTimer();
}
```

### Corrupted localStorage Data

If `JSON.parse` returns a value that is not an array (e.g., the stored string was manually corrupted), both `initTasks` and `initQuickLinks` guard with an `Array.isArray` check and fall back to `[]`:

```js
const loaded = storageLoad(STORAGE_KEY_TASKS, []);
tasks = Array.isArray(loaded) ? loaded : [];
```

### Timer Edge Cases

- Calling `startTimer()` while the timer is already running is a no-op (the Start button is disabled when the timer is active).
- Calling `resetTimer()` clears any active interval before setting a new one, preventing duplicate intervals.

---

## Testing Strategy

### Overview

This feature is a pure client-side Vanilla JS application with no build tooling. The testing strategy uses **Jest** (with jsdom environment) for unit and property-based tests, runnable via `npx jest --testEnvironment jsdom`. No framework-specific test utilities are needed.

For property-based testing, **fast-check** is used. Each property test runs a minimum of **100 iterations**.

### File Structure

```
index.html
css/
  style.css
js/
  app.js
tests/
  greeting.test.js      ← unit + property tests for GREETING MODULE pure functions
  timer.test.js         ← unit + property tests for TIMER MODULE pure functions
  tasks.test.js         ← unit + property tests for TASK MODULE logic
  quicklinks.test.js    ← unit + property tests for QUICKLINKS MODULE logic
  storage.test.js       ← unit tests for STORAGE MODULE (mocked localStorage)
```

> **Note:** `js/app.js` is a single-file module. For testing, the pure functions (`formatTime`, `formatDate`, `getGreeting`, `formatTimer`, `normaliseUrl`, `createTask`, `addTask`, `toggleTask`, `editTask`, `deleteTask`, `addQuickLink`, `deleteQuickLink`) are extracted and exported via a `module.exports` guard at the bottom of `app.js`:
>
> ```js
> // At the end of app.js — only active in Node/test environments
> if (typeof module !== 'undefined') {
>   module.exports = {
>     formatTime, formatDate, getGreeting,
>     formatTimer,
>     createTask, addTask, toggleTask, editTask, deleteTask,
>     normaliseUrl, createQuickLink, addQuickLink, deleteQuickLink,
>     storageSave, storageLoad,
>   };
> }
> ```

### Unit Tests

Unit tests cover specific examples, edge cases, and DOM interaction points that are not covered by property tests.

**greeting.test.js**
- `formatTime` produces `"00:00:00"` for midnight
- `formatDate` for a known date (e.g., 2024-08-26) produces the expected string

**timer.test.js**
- `formatTimer(0)` → `"00:00"`
- `formatTimer(1500)` → `"25:00"`
- `formatTimer(90)` → `"01:30"`

**tasks.test.js**
- Adding a task clears the input field value (DOM test with jsdom)
- Completing a task applies strikethrough class (DOM test)
- Deleting the last task shows `#task-empty-msg`
- Loading from empty localStorage renders the empty-state message
- Edit mode: clicking Edit replaces `<span>` with `<input>` pre-filled with the description

**quicklinks.test.js**
- Clicking a quick link anchor has `target="_blank"` and `rel="noopener noreferrer"` (DOM test)
- Deleting the last link shows `#link-empty-msg`
- Loading from empty localStorage renders the empty-state message

**storage.test.js**
- `storageSave` / `storageLoad` round-trip with a mock localStorage
- `storageLoad` returns `defaultValue` when key is absent
- `storageLoad` returns `defaultValue` when JSON is corrupted

### Property-Based Tests

Each property test uses fast-check and runs 100+ iterations. Tests reference the design property they validate.

```js
// Feature: todo-dashboard, Property 1: formatTime produces a zero-padded 24-hour HH:MM:SS string
fc.assert(fc.property(fc.date(), (date) => {
  const result = formatTime(date);
  return /^\d{2}:\d{2}:\d{2}$/.test(result) &&
    parseInt(result.slice(0, 2)) <= 23 &&
    parseInt(result.slice(3, 5)) <= 59 &&
    parseInt(result.slice(6, 8)) <= 59;
}), { numRuns: 100 });

// Feature: todo-dashboard, Property 2: formatDate contains all required components
fc.assert(fc.property(fc.date(), (date) => {
  const result = formatDate(date);
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return days.some(d => result.includes(d)) &&
    months.some(m => result.includes(m)) &&
    /\d{4}/.test(result) &&
    /\d{1,2}/.test(result);
}), { numRuns: 100 });

// Feature: todo-dashboard, Property 3: getGreeting is correct for every hour in [0, 23]
fc.assert(fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
  const result = getGreeting(hour);
  const expected =
    hour >= 5 && hour <= 11 ? 'Good Morning' :
    hour >= 12 && hour <= 17 ? 'Good Afternoon' :
    hour >= 18 && hour <= 21 ? 'Good Evening' : 'Good Night';
  return result === expected;
}), { numRuns: 100 });

// Feature: todo-dashboard, Property 4: formatTimer produces a zero-padded MM:SS string
fc.assert(fc.property(fc.integer({ min: 0, max: 1500 }), (seconds) => {
  const result = formatTimer(seconds);
  return /^\d{2}:\d{2}$/.test(result) &&
    parseInt(result.slice(0, 2)) * 60 + parseInt(result.slice(3, 5)) === seconds;
}), { numRuns: 100 });

// Feature: todo-dashboard, Property 5: Valid task addition grows the task list by exactly one
fc.assert(fc.property(
  fc.array(fc.record({ id: fc.string(), description: fc.string({ minLength: 1 }), completed: fc.boolean() })),
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  (initialTasks, description) => {
    tasks = [...initialTasks];
    const before = tasks.length;
    const result = addTask(description);
    return result === true && tasks.length === before + 1 &&
      tasks[tasks.length - 1].description === description.trim() &&
      tasks[tasks.length - 1].completed === false;
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 6: Whitespace-only task descriptions are always rejected
fc.assert(fc.property(
  fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r')),
  (whitespaceStr) => {
    tasks = [];
    const result = addTask(whitespaceStr);
    return result === false && tasks.length === 0;
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 7: Task storage round-trip preserves all task data
fc.assert(fc.property(
  fc.array(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 10 }),
  (descriptions) => {
    tasks = [];
    descriptions.forEach(d => addTask(d));
    const loaded = JSON.parse(mockLocalStorage[STORAGE_KEY_TASKS]);
    return JSON.stringify(loaded) === JSON.stringify(tasks);
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 8: toggleTask always inverts the completed state
fc.assert(fc.property(
  fc.boolean(),
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  (initialCompleted, description) => {
    tasks = [{ id: 'test-id', description, completed: initialCompleted }];
    toggleTask('test-id');
    return tasks[0].completed === !initialCompleted;
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 9: editTask with valid description always updates description
fc.assert(fc.property(
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  (originalDesc, newDesc) => {
    tasks = [{ id: 'test-id', description: originalDesc, completed: false }];
    const result = editTask('test-id', newDesc);
    return result === true && tasks[0].description === newDesc.trim();
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 10: editTask with whitespace-only value is always rejected
fc.assert(fc.property(
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r')),
  (originalDesc, whitespaceStr) => {
    tasks = [{ id: 'test-id', description: originalDesc, completed: false }];
    const result = editTask('test-id', whitespaceStr);
    return result === false && tasks[0].description === originalDesc;
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 11: deleteTask removes exactly the targeted task
fc.assert(fc.property(
  fc.array(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 10 }),
  fc.nat(),
  (descriptions, indexSeed) => {
    tasks = [];
    descriptions.forEach(d => addTask(d));
    const index = indexSeed % tasks.length;
    const targetId = tasks[index].id;
    const before = tasks.length;
    deleteTask(targetId);
    return tasks.length === before - 1 && tasks.every(t => t.id !== targetId);
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 12: Valid quick link addition grows the list by exactly one
fc.assert(fc.property(
  fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  fc.webUrl(),
  (label, url) => {
    quickLinks = [];
    const before = quickLinks.length;
    const result = addQuickLink(label, url);
    return result === true && quickLinks.length === before + 1 &&
      quickLinks[0].label === label.trim();
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 13: Empty/whitespace label or URL is always rejected
fc.assert(fc.property(
  fc.oneof(
    fc.tuple(fc.stringOf(fc.constantFrom(' ', '\t')), fc.webUrl()),
    fc.tuple(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), fc.stringOf(fc.constantFrom(' ', '\t')))
  ),
  ([label, url]) => {
    quickLinks = [];
    const result = addQuickLink(label, url);
    return result === false && quickLinks.length === 0;
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 14: Quick links storage round-trip preserves all link data
fc.assert(fc.property(
  fc.array(
    fc.tuple(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), fc.webUrl()),
    { minLength: 1, maxLength: 10 }
  ),
  (pairs) => {
    quickLinks = [];
    pairs.forEach(([label, url]) => addQuickLink(label, url));
    const loaded = JSON.parse(mockLocalStorage[STORAGE_KEY_LINKS]);
    return JSON.stringify(loaded) === JSON.stringify(quickLinks);
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 15: normaliseUrl always produces a URL with a protocol prefix
fc.assert(fc.property(
  fc.string({ minLength: 1 }),
  (url) => {
    const result = normaliseUrl(url);
    return result.startsWith('http://') || result.startsWith('https://');
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 16: Every rendered quick link has rel="noopener noreferrer"
fc.assert(fc.property(
  fc.array(
    fc.tuple(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), fc.webUrl()),
    { minLength: 1, maxLength: 10 }
  ),
  (pairs) => {
    quickLinks = [];
    pairs.forEach(([label, url]) => addQuickLink(label, url));
    renderQuickLinks();
    const anchors = document.querySelectorAll('#link-list a.quick-link');
    return Array.from(anchors).every(a => a.rel === 'noopener noreferrer');
  }
), { numRuns: 100 });

// Feature: todo-dashboard, Property 17: deleteQuickLink removes exactly the targeted link
fc.assert(fc.property(
  fc.array(
    fc.tuple(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), fc.webUrl()),
    { minLength: 1, maxLength: 10 }
  ),
  fc.nat(),
  (pairs, indexSeed) => {
    quickLinks = [];
    pairs.forEach(([label, url]) => addQuickLink(label, url));
    const index = indexSeed % quickLinks.length;
    const targetId = quickLinks[index].id;
    const before = quickLinks.length;
    deleteQuickLink(targetId);
    return quickLinks.length === before - 1 && quickLinks.every(l => l.id !== targetId);
  }
), { numRuns: 100 });
```

### Running the Tests

```bash
# Install test dependencies (one-time)
npm install --save-dev jest fast-check jest-environment-jsdom

# Run all tests once (non-watch mode)
npx jest --testEnvironment jsdom --run
```

Add to `package.json` for convenience:

```json
{
  "scripts": {
    "test": "jest --testEnvironment jsdom"
  }
}
```

### Cross-Browser Compatibility

The application uses only standard DOM APIs (`document.getElementById`, `addEventListener`, `setInterval`, `localStorage`) that are supported in all target browsers (Chrome, Firefox, Edge, Safari). No polyfills are required.

The `defer` attribute on `<script src="js/app.js" defer>` ensures the DOM is fully parsed before `app.js` runs in all compliant browsers. `DOMContentLoaded` is still used as a defensive guard.

The dashboard works when opened via `file://` protocol because there are no cross-origin requests, no service workers, and no ES module `import/export` statements (which Chrome blocks on `file://` by default).
