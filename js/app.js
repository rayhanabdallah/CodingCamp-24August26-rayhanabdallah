// ==================== 1. GREETING & REAL-TIME CLOCK ====================
const greetingText = document.getElementById('greeting-text');
const datetimeText = document.getElementById('current-datetime');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');

function updateClockAndGreeting() {
  const now = new Date();
  
  // Format Tanggal dan Waktu Indonesia
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  datetimeText.textContent = now.toLocaleDateString('id-ID', options);

  // Greeting berdasarkan waktu
  const hours = now.getHours();
  let greeting = 'Selamat Malam';
  if (hours >= 5 && hours < 12) greeting = 'Selamat Pagi';
  else if (hours >= 12 && hours < 15) greeting = 'Selamat Siang';
  else if (hours >= 15 && hours < 18) greeting = 'Selamat Sore';

  const savedName = localStorage.getItem('customName') || '';
  greetingText.textContent = savedName ? `${greeting}, ${savedName}!` : `${greeting}!`;
}

saveNameBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    localStorage.setItem('customName', name);
    nameInput.value = '';
    updateClockAndGreeting();
  }
});

setInterval(updateClockAndGreeting, 1000);
updateClockAndGreeting();

// ==================== 2. LIGHT / DARK MODE ====================
const themeToggleBtn = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('theme') || 'light';
document.body.className = currentTheme;
themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.className = currentTheme;
  localStorage.setItem('theme', currentTheme);
  themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ==================== 3. FOCUS TIMER & CHANGE POMODORO TIME ====================
let timerInterval = null;
let defaultMinutes = 25;
let totalSeconds = defaultMinutes * 60;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const customMinutesInput = document.getElementById('custom-minutes');
const setTimerBtn = document.getElementById('set-timer-btn');

function renderTimer() {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      renderTimer();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert('Waktu Fokus Selesai! Saatnya istirahat.');
    }
  }, 1000);
});

stopBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = defaultMinutes * 60;
  renderTimer();
});

setTimerBtn.addEventListener('click', () => {
  const newMins = parseInt(customMinutesInput.value);
  if (!isNaN(newMins) && newMins > 0) {
    defaultMinutes = newMins;
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = defaultMinutes * 60;
    renderTimer();
  }
});

// ==================== 4. TO-DO LIST (DUPLICATE CHECK & SORT) ====================
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');
const sortTodoBtn = document.getElementById('sort-todo-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveAndRenderTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  todoList.innerHTML = '';
  
  if (todos.length === 0) {
    todoList.innerHTML = '<p class="empty-text">Belum ada tugas.</p>';
    return;
  }

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.addEventListener('click', () => toggleTodo(index));

    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => editTodo(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => deleteTodo(index));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    li.appendChild(span);
    li.appendChild(actions);
    todoList.appendChild(li);
  });
}

addTodoBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (!text) return;

  // Prevent Duplicate Task (Case-insensitive)
  const isDuplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    alert('Tugas ini sudah ada di dalam daftar!');
    return;
  }

  todos.push({ text: text, completed: false });
  todoInput.value = '';
  saveAndRenderTodos();
});

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveAndRenderTodos();
}

function editTodo(index) {
  const newText = prompt('Edit tugas:', todos[index].text);
  if (newText !== null && newText.trim() !== '') {
    todos[index].text = newText.trim();
    saveAndRenderTodos();
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveAndRenderTodos();
}

// Sort Tasks Alphabetically (A-Z)
sortTodoBtn.addEventListener('click', () => {
  todos.sort((a, b) => a.text.localeCompare(b.text));
  saveAndRenderTodos();
});

saveAndRenderTodos();

// ==================== 5. QUICK LINKS (LOCAL STORAGE) ====================
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const addLinkBtn = document.getElementById('add-link-btn');
const quickLinksContainer = document.getElementById('quick-links-container');

let links = JSON.parse(localStorage.getItem('quickLinks')) || [
  { name: 'Google', url: 'https://google.com' }
];

function saveAndRenderLinks() {
  localStorage.setItem('quickLinks', JSON.stringify(links));
  quickLinksContainer.innerHTML = '';

  links.forEach((link, index) => {
    const linkWrapper = document.createElement('div');
    linkWrapper.className = 'link-item-wrapper';

    const btn = document.createElement('a');
    btn.href = link.url;
    btn.target = '_blank';
    btn.className = 'link-btn';
    btn.textContent = link.name;
    
    const delLinkBtn = document.createElement('button');
    delLinkBtn.textContent = '×';
    delLinkBtn.className = 'link-del';
    delLinkBtn.addEventListener('click', () => {
      links.splice(index, 1);
      saveAndRenderLinks();
    });

    linkWrapper.appendChild(btn);
    linkWrapper.appendChild(delLinkBtn);
    quickLinksContainer.appendChild(linkWrapper);
  });
}

addLinkBtn.addEventListener('click', () => {
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();

  if (name && url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    links.push({ name, url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    saveAndRenderLinks();
  }
});

saveAndRenderLinks();