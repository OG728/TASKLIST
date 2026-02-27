const STORAGE_KEY = 'tasklist.tasks';
const hasDOM = typeof document !== 'undefined';
const hasStorage = typeof localStorage !== 'undefined';

const taskForm = hasDOM ? document.getElementById('task-form') : null;
const taskInput = hasDOM ? document.getElementById('task-input') : null;
const taskList = hasDOM ? document.getElementById('task-list') : null;
const emptyState = hasDOM ? document.getElementById('empty-state') : null;

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function loadTasks() {
  if (!hasStorage) return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  if (!hasStorage) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  if (!taskList || !emptyState) return;

  const tasks = loadTasks();
  taskList.innerHTML = '';
  emptyState.style.display = tasks.length ? 'none' : 'block';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const main = document.createElement('div');
    main.className = 'task-main';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(task.completedAt);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const text = document.createElement('span');
    text.className = `task-text ${task.completedAt ? 'done' : ''}`;
    text.textContent = task.text;

    main.append(checkbox, text);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'delete-btn';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeTask(task.id));

    li.append(main, removeButton);
    taskList.appendChild(li);
  });
}

function addTask(text) {
  const tasks = loadTasks();
  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    createdDate: getTodayKey(),
    completedAt: null,
  });
  saveTasks(tasks);
  renderTasks();
}

function toggleTask(id) {
  const tasks = loadTasks();
  const nextTasks = tasks.map((task) => {
    if (task.id !== id) return task;
    return {
      ...task,
      completedAt: task.completedAt ? null : new Date().toISOString(),
    };
  });

  saveTasks(nextTasks);
  renderTasks();
}

function removeTask(id) {
  const tasks = loadTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  renderTasks();
}

if (taskForm && taskInput) {
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    addTask(text);
    taskInput.value = '';
    taskInput.focus();
  });
}

if (hasDOM) {
  renderTasks();
}
