// ================================================================
// === STORAGE MODULE ===
// ================================================================

const STORAGE_KEY_TASKS = 'todo_dashboard_tasks';
const STORAGE_KEY_LINKS = 'todo_dashboard_links';

/**
 * Serialises value as JSON and saves it to localStorage under key.
 * @param {string} key
 * @param {*} value
 */
function storageSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Dashboard] localStorage write failed:', e);
  }
}

/**
 * Reads and JSON-parses the value at key. Returns defaultValue if absent or unparseable.
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
function storageLoad(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.warn('[Dashboard] localStorage read failed:', e);
    return defaultValue;
  }
}

// ================================================================
// === GREETING MODULE ===
// ================================================================

/**
 * Generates a unique ID string using the current timestamp and a random suffix.
 * @returns {string} e.g. "1724657234512_4f3a2b1"
 */
function generateId() {
  return Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

/**
 * Returns a time-based greeting string for the given hour.
 * @param {number} hour - Current hour in 24-hour format (0–23).
 * @returns {string} One of "Good Morning", "Good Afternoon", "Good Evening", "Good Night"
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 17) return 'Good Afternoon';
  if (hour >= 18 && hour <= 21) return 'Good Evening';
  return 'Good Night'; // covers 22–23 and 0–4
}

/**
 * Formats a Date object as a zero-padded 24-hour "HH:MM:SS" string.
 * @param {Date} date
 * @returns {string} e.g. "09:05:03"
 */
function formatTime(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Formats a Date object as "DayName, DD MonthName YYYY".
 * @param {Date} date
 * @returns {string} e.g. "Monday, 26 August 2024"
 */
function formatDate(date) {
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
  const dayName   = DAY_NAMES[date.getDay()];
  const day       = date.getDate();
  const monthName = MONTH_NAMES[date.getMonth()];
  const year      = date.getFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
}

/**
 * Updates the greeting, clock, and date DOM elements with the current time.
 * Called immediately on init and then every second via setInterval.
 */
function tickClock() {
  const now = new Date();
  document.getElementById('greeting-text').textContent = getGreeting(now.getHours());
  document.getElementById('clock-display').textContent = formatTime(now);
  document.getElementById('date-display').textContent = formatDate(now);
}

/**
 * Initialises the greeting widget: ticks immediately, then schedules a 1-second interval.
 */
function initGreeting() {
  tickClock();
  setInterval(tickClock, 1000);
}

// ================================================================
// === TIMER MODULE ===
// ================================================================

let timerSeconds = 25 * 60;  // remaining seconds (starts at 25:00)
let timerInterval = null;     // setInterval handle; null when stopped

/**
 * Formats a total number of seconds as a zero-padded "MM:SS" string.
 * @param {number} seconds - Non-negative integer in the range [0, 1500].
 * @returns {string} e.g. "25:00", "01:30", "00:45"
 */
function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

/**
 * Renders the current timerSeconds value into the #timer-display element.
 */
function renderTimer() {
  document.getElementById('timer-display').textContent = formatTimer(timerSeconds);
}

/**
 * Starts the countdown interval. No-op if the timer is already running.
 * Disables the Start button and enables the Stop button.
 */
function startTimer() {
  if (timerInterval !== null) return; // already running
  timerInterval = setInterval(timerTick, 1000);
  document.getElementById('timer-start').disabled = true;
  document.getElementById('timer-stop').disabled = false;
}

/**
 * Pauses the countdown by clearing the active interval.
 * Enables the Start button and disables the Stop button.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById('timer-start').disabled = false;
  document.getElementById('timer-stop').disabled = true;
}

/**
 * Stops any active interval, resets timerSeconds to 25:00 (1500 s),
 * re-renders the display, and restores the Start/Stop button states.
 */
function resetTimer() {
  stopTimer();
  timerSeconds = 1500;
  renderTimer();
}

/**
 * Called each second by the countdown interval. Decrements timerSeconds by 1,
 * re-renders the display, and triggers completion when the counter reaches zero.
 */
function timerTick() {
  timerSeconds -= 1;
  renderTimer();
  if (timerSeconds <= 0) {
    onTimerComplete();
  }
}

/**
 * Handles timer completion: shows the on-screen notification banner,
 * fires a browser Notification if permission is already granted, then resets
 * the timer back to 25:00.
 */
function onTimerComplete() {
  document.getElementById('timer-notification').hidden = false;

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('Focus Timer', { body: 'Session complete! Take a break.' });
  }

  resetTimer();
}

/**
 * Wires the Start, Stop, and Reset button click handlers and performs an
 * initial render so the display shows "25:00" on page load.
 */
function initTimer() {
  document.getElementById('timer-start').addEventListener('click', startTimer);
  document.getElementById('timer-stop').addEventListener('click', stopTimer);
  document.getElementById('timer-reset').addEventListener('click', resetTimer);
  renderTimer();
}

// ================================================================
// === TASK MODULE ===
// ================================================================

/** @type {Array<{id: string, description: string, completed: boolean}>} */
let tasks = [];

// --- Task 10.1: createTask, addTask ---

/**
 * Creates a new Task object with a generated ID.
 * @param {string} description - Non-empty, trimmed task text.
 * @returns {{ id: string, description: string, completed: boolean }}
 */
function createTask(description) {
  return {
    id: generateId(),
    description: description.trim(),
    completed: false,
  };
}

/**
 * Adds a new task to the tasks array, persists to localStorage, and re-renders.
 * Returns false (no-op) if the description is empty or whitespace-only.
 * @param {string} description
 * @returns {boolean} true if the task was added, false if rejected.
 */
function addTask(description) {
  if (!description || description.trim().length === 0) return false;
  tasks.push(createTask(description));
  storageSave(STORAGE_KEY_TASKS, tasks);
  renderTasks();
  return true;
}

// --- Task 10.2: toggleTask, deleteTask ---

/**
 * Toggles the completed state of the task with the given id.
 * Persists the change to localStorage and re-renders the list.
 * @param {string} id
 */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    storageSave(STORAGE_KEY_TASKS, tasks);
    renderTasks();
  }
}

/**
 * Removes the task with the given id from the tasks array.
 * Persists the change to localStorage and re-renders the list.
 * @param {string} id
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  storageSave(STORAGE_KEY_TASKS, tasks);
  renderTasks();
}

// --- Task 10.3: editTask, enterEditMode, exitEditMode ---

/**
 * Updates the description of the task with the given id.
 * Rejects empty or whitespace-only values (returns false without mutating state).
 * Persists the change to localStorage on success.
 * @param {string} id
 * @param {string} newDescription
 * @returns {boolean} true if updated, false if rejected.
 */
function editTask(id, newDescription) {
  if (!newDescription || newDescription.trim().length === 0) return false;
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.description = newDescription.trim();
    storageSave(STORAGE_KEY_TASKS, tasks);
  }
  return true;
}

/**
 * Switches the task list item for the given id into inline edit mode.
 * Replaces the <span class="task-text"> with a text input pre-filled with
 * the current description and a Save button. Stores the original text as a
 * data attribute on the input so it can be restored on cancel.
 * @param {string} id
 */
function enterEditMode(id) {
  const li = document.querySelector('[data-id="' + id + '"]');
  if (!li) return;
  const span = li.querySelector('.task-text');
  if (!span) return;
  const originalText = span.textContent;

  const input = document.createElement('input');
  input.className = 'task-edit-input';
  input.type = 'text';
  input.value = originalText;
  input.dataset.original = originalText;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'task-save-btn';
  saveBtn.textContent = 'Save';

  span.replaceWith(input);
  // Insert save button after the input, before the edit button
  const editBtn = li.querySelector('.task-edit-btn');
  if (editBtn) {
    li.insertBefore(saveBtn, editBtn);
  } else {
    li.appendChild(saveBtn);
  }

  input.focus();
}

/**
 * Exits inline edit mode for the task with the given id.
 * If save is true, attempts to commit the new description via editTask().
 * If editTask rejects the value (empty/whitespace), the original description
 * is restored without changes. If save is false, changes are discarded.
 * Re-renders the task list to restore the normal view.
 * @param {string} id
 * @param {boolean} save - true to commit, false to discard.
 */
function exitEditMode(id, save) {
  if (save) {
    const li = document.querySelector('[data-id="' + id + '"]');
    if (li) {
      const input = li.querySelector('.task-edit-input');
      if (input) {
        editTask(id, input.value);
        // If editTask rejected the value it returned false — state is unchanged,
        // renderTasks() will restore the original description from the tasks array.
      }
    }
  }
  renderTasks();
}

// --- Task 10.4: renderTasks ---

/**
 * Renders the full task list into #task-list.
 * Clears any existing items, then builds one <li> per task using
 * createElement (no innerHTML, to prevent XSS with user-supplied text).
 * Shows #task-empty-msg when the tasks array is empty; hides it otherwise.
 * No event listeners are attached here — delegation is handled once in initTasks().
 */
function renderTasks() {
  const list = document.getElementById('task-list');
  const emptyMsg = document.getElementById('task-empty-msg');

  // Clear current items
  list.innerHTML = '';

  if (tasks.length === 0) {
    emptyMsg.hidden = false;
    return;
  }

  emptyMsg.hidden = true;

  tasks.forEach(function (task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    // Text span
    const span = document.createElement('span');
    span.className = 'task-text';
    if (task.completed) {
      span.classList.add('completed');
    }
    span.textContent = task.description;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'task-edit-btn';
    editBtn.textContent = 'Edit';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.textContent = 'Delete';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// --- Task 10.5: initTasks ---

/**
 * Initialises the To-Do List widget.
 *
 * - Loads persisted tasks from localStorage (falls back to [] on missing/corrupt data).
 * - Performs an initial render.
 * - Wires the Add button and the Enter key on #task-input to addTask(), clearing the
 *   input on success and keeping focus on rejection.
 * - Attaches a single delegated click listener on #task-list that handles:
 *     • .task-edit-btn   → enterEditMode(id)
 *     • .task-save-btn   → exitEditMode(id, true)
 *     • .task-delete-btn → deleteTask(id)
 * - Attaches a separate delegated change listener on #task-list that handles:
 *     • .task-checkbox   → toggleTask(id)
 *
 * Requirements: 7.1, 7.2, 7.3, 11.1, 11.2, 11.3
 */
function initTasks() {
  // Load persisted tasks, guarding against non-array values from corrupt storage.
  const loaded = storageLoad(STORAGE_KEY_TASKS, []);
  tasks = Array.isArray(loaded) ? loaded : [];

  renderTasks();

  const taskInput  = document.getElementById('task-input');
  const taskAddBtn = document.getElementById('task-add-btn');
  const taskList   = document.getElementById('task-list');

  /** Shared handler: attempt to add the current input value as a new task. */
  function handleAddTask() {
    const added = addTask(taskInput.value);
    if (added) {
      taskInput.value = '';
      taskInput.focus();
    } else {
      taskInput.focus();
    }
  }

  // Wire Add button click.
  taskAddBtn.addEventListener('click', handleAddTask);

  // Wire Enter key on the task input field.
  taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  });

  // Delegated click listener for edit, save, and delete actions inside the list.
  taskList.addEventListener('click', function (event) {
    const editBtn   = event.target.closest('.task-edit-btn');
    const saveBtn   = event.target.closest('.task-save-btn');
    const deleteBtn = event.target.closest('.task-delete-btn');

    if (editBtn) {
      const id = editBtn.closest('[data-id]').dataset.id;
      enterEditMode(id);
      return;
    }

    if (saveBtn) {
      const id = saveBtn.closest('[data-id]').dataset.id;
      exitEditMode(id, true);
      return;
    }

    if (deleteBtn) {
      const id = deleteBtn.closest('[data-id]').dataset.id;
      deleteTask(id);
      return;
    }
  });

  // Delegated change listener for checkbox toggles.
  taskList.addEventListener('change', function (event) {
    const checkbox = event.target.closest('.task-checkbox');
    if (checkbox) {
      const id = checkbox.closest('[data-id]').dataset.id;
      toggleTask(id);
    }
  });
}

// ================================================================
// === QUICKLINKS MODULE ===
// ================================================================

/** @type {Array<{id: string, label: string, url: string}>} */
let quickLinks = [];

/**
 * Ensures a URL string has a protocol prefix.
 * If the URL does not already start with "http://" or "https://", prepends "https://".
 * @param {string} url - Raw URL string (already trimmed).
 * @returns {string} URL guaranteed to start with "http://" or "https://".
 */
function normaliseUrl(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return 'https://' + url;
}

/**
 * Creates a new QuickLink object with a generated ID.
 * @param {string} label - Non-empty user-provided display label.
 * @param {string} url   - URL string (will be trimmed and normalised).
 * @returns {{ id: string, label: string, url: string }}
 */
function createQuickLink(label, url) {
  return {
    id: generateId(),
    label: label.trim(),
    url: normaliseUrl(url.trim()),
  };
}
