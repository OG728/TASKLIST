const STORAGE_KEY = 'tasklist.tasks';

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toDateKey(date) {
  return date.toISOString().split('T')[0];
}

function getStatsByCreatedDate(tasks) {
  return tasks.reduce((map, task) => {
    const day = task.createdDate;
    if (!day) return map;
    if (!map[day]) {
      map[day] = { total: 0, completed: 0 };
    }
    map[day].total += 1;
    if (task.completedAt) map[day].completed += 1;
    return map;
  }, {});
}

function ratioToColor(ratio) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const hue = clamped * 120;
  return `hsl(${hue} 70% 78%)`;
}

function initCalendarApp() {
  const monthLabel = document.getElementById('month-label');
  const calendarGrid = document.getElementById('calendar-grid');
  const prevMonthButton = document.getElementById('prev-month');
  const nextMonthButton = document.getElementById('next-month');

  if (!monthLabel || !calendarGrid || !prevMonthButton || !nextMonthButton) {
    return;
  }

  let viewDate = new Date();
  viewDate.setDate(1);

  function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthLabel.textContent = viewDate.toLocaleString(undefined, {
      month: 'long',
      year: 'numeric',
    });

    calendarGrid.innerHTML = '';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
      const heading = document.createElement('div');
      heading.className = 'day-name';
      heading.textContent = day;
      calendarGrid.appendChild(heading);
    });

    const statsByDay = getStatsByCreatedDate(loadTasks());

    for (let i = 0; i < startWeekday; i += 1) {
      const blank = document.createElement('div');
      blank.className = 'calendar-day empty';
      calendarGrid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = toDateKey(date);
      const stats = statsByDay[key] || { total: 0, completed: 0 };
      const ratio = stats.total ? stats.completed / stats.total : 0;

      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.style.background = ratioToColor(ratio);

      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = day;

      const meta = document.createElement('div');
      meta.className = 'day-meta';
      meta.textContent = `${stats.completed}/${stats.total} completed`;

      cell.append(dayNumber, meta);
      calendarGrid.appendChild(cell);
    }
  }

  prevMonthButton.addEventListener('click', () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });

  nextMonthButton.addEventListener('click', () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
}

if (typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
  initCalendarApp();
}
