// --- Global State & DOM Elements ---
let currentTheme = localStorage.getItem('focumia-theme') || 'light';
let currentTimerSettings = {
    pomodoroDuration: 25, shortBreakDuration: 5, longBreakDuration: 15,
    pomodorosBeforeLongBreak: 4, soundNotifications: true, browserNotifications: true
};
let tasksCache = [];
let pomodoroInterval = null;
let timeLeftInSeconds = currentTimerSettings.pomodoroDuration * 60;
let isTimerActive = false;
let isBreakTime = false;
let pomodorosSessionCount = 0;

let streaksData = {};
let currentWeekIdentifier = '';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let streaksChartInstance = null;

const bodyEl = document.body;
const splashScreenEl = document.getElementById('splash-screen');
const mainAppAreaEl = document.getElementById('main-app-area');
const pageContentEl = document.getElementById('page-content');
const allPages = document.querySelectorAll('.page');

const themeToggleButton = document.getElementById('theme-toggle-button');
const menuButton = document.getElementById('menu-button');
const menuDropdown = document.getElementById('menu-dropdown');
const logoFocumiaEl = document.getElementById('logo-focumia');


const pomodoroStatusTextEl = document.getElementById('pomodoro-status-text');
const pomodoroTimeDisplayEl = document.getElementById('pomodoro-time-display');
const timerStartPauseButton = document.getElementById('timer-start-pause-button');
const timerResetButton = document.getElementById('timer-reset-button');
const timerSkipButton = document.getElementById('timer-skip-button');

const newTaskInput = document.getElementById('new-task-input');
const addTaskButton = document.getElementById('add-task-button');
const taskListUl = document.getElementById('task-list-ul');
const taskCounterHomeEl = document.getElementById('task-counter-home');

const timerSettingsForm = document.getElementById('timer-settings-form');
const settingsMessageDiv = document.getElementById('settings-message');
const notificationSound = document.getElementById('notification-sound');
const calendarDaysContainer = document.getElementById('calendar-days-container');

const homepageReviewSection = document.getElementById('homepage-review-section');
const homepageReviewTitle = document.getElementById('homepage-review-title');
const homepageReviewContent = document.getElementById('homepage-review-content');
const closeHomepageReviewButton = document.getElementById('close-homepage-review-button');


const ICONS = {
    sun: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.37.295 2.655.82 3.801M12 12a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 012.25-2.25 2.25 2.25 0 012.25 2.25c-.001.745-.224 1.43-.606 2.005M15 15.75a3 3 0 01-6 0m3-10.5V4.5" /></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21c3.73 0 7.01-1.739 9.002-4.498z" /></svg>`,
    menu: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`,
    play: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>`,
    reset: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`,
    skip: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" class="w-5 h-5 checkmark-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`,
};

// --- Date Utility Functions ---
function getCurrentISOWeekAndYear() {
    const date = new Date();
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getCurrentDayISO() { // 0 for Monday, 6 for Sunday
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
}

// --- Streaks Data Functions ---
function loadStreaksDataFromLocalStorage() {
    const storedStreaks = localStorage.getItem('focumia-streaksData');
    streaksData = storedStreaks ? JSON.parse(storedStreaks) : {};
    currentWeekIdentifier = getCurrentISOWeekAndYear();

    if (!streaksData[currentWeekIdentifier]) {
        streaksData[currentWeekIdentifier] = DAY_NAMES.map(dayName => ({
            day: dayName, tasksCompletedScore: 0, focusSessionsScore: 0, totalScore: 0
        }));
        saveStreaksDataToLocalStorage();
    } else {
        // Ensure all days are present and scores are numbers, calculating totalScore
        const currentWeekData = streaksData[currentWeekIdentifier];
        const validatedWeekData = DAY_NAMES.map((dayName, index) => {
            const existingDayData = currentWeekData.find(d => d.day === dayName) || (currentWeekData[index] && currentWeekData[index].day === dayName ? currentWeekData[index] : null) ;
            if (existingDayData) {
                const tasksScore = Number(existingDayData.tasksCompletedScore) || 0;
                const focusScore = Number(existingDayData.focusSessionsScore) || 0;
                return {
                    day: dayName,
                    tasksCompletedScore: tasksScore,
                    focusSessionsScore: focusScore,
                    totalScore: tasksScore + focusScore
                };
            }
            return { day: dayName, tasksCompletedScore: 0, focusSessionsScore: 0, totalScore: 0 };
        });
        streaksData[currentWeekIdentifier] = validatedWeekData;
    }
}

function saveStreaksDataToLocalStorage() {
    localStorage.setItem('focumia-streaksData', JSON.stringify(streaksData));
}

function updateStreakScore(type) {
    loadStreaksDataFromLocalStorage(); // Ensure we have the latest, especially week identifier
    const todayIndex = getCurrentDayISO();

    if (!streaksData[currentWeekIdentifier]) { // If new week started and not initialized by load
        streaksData[currentWeekIdentifier] = DAY_NAMES.map(dayName => ({
            day: dayName, tasksCompletedScore: 0, focusSessionsScore: 0, totalScore: 0
        }));
    }
    
    const dayData = streaksData[currentWeekIdentifier][todayIndex];

    if (dayData) {
        if (type === 'task') dayData.tasksCompletedScore += 10;
        else if (type === 'focus') dayData.focusSessionsScore += 5;
        dayData.totalScore = (dayData.tasksCompletedScore || 0) + (dayData.focusSessionsScore || 0);
        saveStreaksDataToLocalStorage();

        if (document.getElementById('streaks-page')?.classList.contains('active')) {
            renderStreaksTable();
            renderStreaksChart();
        }
    } else {
        console.error("Failed to update streak score for", currentWeekIdentifier, `day index: ${todayIndex}`);
    }
}

// --- Core App Functions ---
function applyTheme(theme) {
    bodyEl.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('focumia-theme', theme);
    if (themeToggleButton) themeToggleButton.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;

    const scrollbarStyle = document.getElementById('dynamic-scrollbar-style');
    if (scrollbarStyle) scrollbarStyle.remove();
    const newScrollbarStyle = document.createElement('style');
    newScrollbarStyle.id = 'dynamic-scrollbar-style';
    const computedStyles = getComputedStyle(bodyEl);
    newScrollbarStyle.innerHTML = `
        ::-webkit-scrollbar-track { background: ${computedStyles.getPropertyValue('--scrollbar-track')}; }
        ::-webkit-scrollbar-thumb { background: ${computedStyles.getPropertyValue('--scrollbar-thumb')}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${computedStyles.getPropertyValue('--scrollbar-thumb-hover')}; }
    `;
    document.head.appendChild(newScrollbarStyle);

    if (document.getElementById('home-page')?.classList.contains('active')) {
        renderTasks(tasksCache);
        renderWeeklyCalendar();
    }
    if (document.getElementById('streaks-page')?.classList.contains('active')) {
        renderStreaksChart(); // Re-render chart as colors might change
    }
}

function renderWeeklyCalendar() {
    if (!calendarDaysContainer) return;
    calendarDaysContainer.innerHTML = '';
    const today = new Date();
    const currentDayOfWeekISO = getCurrentDayISO(); // 0 for Mon, 6 for Sun

    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() - currentDayOfWeekISO + i);
        const dateStringForReview = dayDate.toISOString().split('T')[0];

        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day-item flex-1 flex flex-col items-center justify-center p-2 rounded-lg jersey-10-regular themed-bg-secondary';
        dayDiv.setAttribute('data-date', dateStringForReview);

        const dayNameSpan = document.createElement('span');
        dayNameSpan.className = 'text-lg md:text-xl themed-text-secondary';
        dayNameSpan.textContent = DAY_NAMES[i]; // Use DAY_NAMES for consistency
        const dateNumberSpan = document.createElement('span');
        dateNumberSpan.className = 'text-3xl md:text-4xl themed-text-primary mt-1';
        dateNumberSpan.textContent = dayDate.getDate();
        dayDiv.appendChild(dayNameSpan);
        dayDiv.appendChild(dateNumberSpan);

        if (i === currentDayOfWeekISO) {
            dayDiv.classList.remove('themed-bg-secondary');
            dayDiv.classList.add('themed-button-primary', 'current-calendar-day');
            // Text color for current day should adapt to button's text color
            const buttonPrimaryTextColor = getComputedStyle(bodyEl).getPropertyValue('--button-primary-text').trim();
            dayNameSpan.style.color = buttonPrimaryTextColor;
            dateNumberSpan.style.color = buttonPrimaryTextColor;
        }

        dayDiv.addEventListener('click', () => {
            showHomepageReview(dateStringForReview);
        });
        calendarDaysContainer.appendChild(dayDiv);
    }
}

function showPage(pageId) {
    allPages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
        page.classList.toggle('hidden', page.id !== pageId);
    });
    if (menuDropdown) menuDropdown.classList.add('hidden');

    // Hide review section if navigating away from home page
    if (pageId !== 'home-page' && homepageReviewSection && !homepageReviewSection.classList.contains('hidden')) {
        hideHomepageReview();
    }

    if (pageId === 'home-page') {
        renderTasks(tasksCache);
        renderWeeklyCalendar(); // Re-render calendar, e.g., if day changes
    } else if (pageId === 'streaks-page') {
        loadStreaksDataFromLocalStorage(); // Ensure fresh data
        renderStreaksTable();
        renderStreaksChart();
    }
    window.scrollTo(0, 0); // Scroll to top on page change
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    if (pomodoroTimeDisplayEl) pomodoroTimeDisplayEl.textContent = formatTime(timeLeftInSeconds);
    if (pomodoroStatusTextEl) pomodoroStatusTextEl.textContent = isBreakTime ? "Break Time" : "Focus Time";
    if (timerStartPauseButton) timerStartPauseButton.innerHTML = isTimerActive ? `${ICONS.pause} Pause` : `${ICONS.play} Start`;
}

function playNotifSound() {
    if (currentTimerSettings.soundNotifications && notificationSound) {
        notificationSound.currentTime = 0; // Rewind to start
        notificationSound.play().catch(e => console.warn("Audio play failed:", e));
    }
}
function showBrowserNotification(title, body) {
    if (currentTimerSettings.browserNotifications && Notification.permission === "granted") {
        new Notification(title, { body, icon: 'logo.png' });
    }
}

function startNextCycle() {
    isTimerActive = false;
    if (isBreakTime) { // Break just finished, start focus
        isBreakTime = false;
        timeLeftInSeconds = currentTimerSettings.pomodoroDuration * 60;
        showBrowserNotification("Break Over!", "Time to get back to focus!");
    } else { // Focus just finished, start break & update score
        updateStreakScore('focus');
        pomodorosSessionCount++;
        isBreakTime = true;
        timeLeftInSeconds = (pomodorosSessionCount % currentTimerSettings.pomodorosBeforeLongBreak === 0) ?
                            currentTimerSettings.longBreakDuration * 60 :
                            currentTimerSettings.shortBreakDuration * 60;
        showBrowserNotification("Pomodoro Complete!", "Time for a break!");
    }
    playNotifSound();
    updateTimerDisplay();
}

function tick() {
    if (timeLeftInSeconds > 0) {
        timeLeftInSeconds--;
        updateTimerDisplay();
    } else {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        startNextCycle();
    }
}

if (timerStartPauseButton) timerStartPauseButton.addEventListener('click', () => {
    isTimerActive = !isTimerActive;
    if (isTimerActive && !pomodoroInterval) pomodoroInterval = setInterval(tick, 1000);
    else if (!isTimerActive && pomodoroInterval) { clearInterval(pomodoroInterval); pomodoroInterval = null; }
    updateTimerDisplay();
});
if (timerResetButton) timerResetButton.addEventListener('click', () => {
    clearInterval(pomodoroInterval); pomodoroInterval = null;
    isTimerActive = false; isBreakTime = false; pomodorosSessionCount = 0;
    timeLeftInSeconds = currentTimerSettings.pomodoroDuration * 60;
    updateTimerDisplay();
});
if (timerSkipButton) timerSkipButton.addEventListener('click', () => {
    clearInterval(pomodoroInterval); pomodoroInterval = null;
    startNextCycle(); // This will also handle if currently in focus or break
});

function saveTasksToLocalStorage() {localStorage.setItem('focumia-tasks', JSON.stringify(tasksCache));}
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('focumia-tasks');
    tasksCache = storedTasks ? (JSON.parse(storedTasks) || []) : [];
    // Data migration/validation for older tasks
    tasksCache.forEach(task => {
        if (task.completionDate === undefined) task.completionDate = null;
        if (task.hasAwardedCompletionPoints === undefined) {
            // If completed and has a completion date, assume points were awarded in older versions or should have been.
            // For new logic, points are only awarded on transition to completed.
            task.hasAwardedCompletionPoints = (task.completed && task.completionDate) ? true : false;
        }
    });
}

function renderTasks(tasks) {
    const completedTasksCount = tasks.filter(task => task.completed).length;
    const totalTasksCount = tasks.length;
    if (taskCounterHomeEl) taskCounterHomeEl.textContent = `${completedTasksCount}/${totalTasksCount} done`;
    if (!taskListUl) return;
    taskListUl.innerHTML = '';
    if (tasks.length === 0) {
        taskListUl.innerHTML = `<li class="text-center themed-text-secondary text-xl">No tasks yet. Add one!</li>`;
        return;
    }
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item flex items-center justify-between p-3 rounded-md themed-bg-secondary ${task.completed ? 'completed' : ''}`;
        const checkIconHTML = task.completed ? ICONS.check : '';
        li.innerHTML = `
            <div class="flex items-center flex-grow">
                <button data-task-id="${task.id}" class="task-toggle-button w-7 h-7 mr-4 rounded flex items-center justify-center transition-all ${task.completed ? 'completed' : 'incomplete'}">${checkIconHTML}</button>
                <span class="task-text text-2xl themed-text-primary">${escapeHtml(task.text)}</span>
            </div>
            <button data-task-id="${task.id}" class="task-delete-button text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-2xl px-2 ml-2" aria-label="Delete task">&times;</button>
        `;
        taskListUl.appendChild(li);
    });

    taskListUl.querySelectorAll('.task-toggle-button').forEach(button => button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.taskId;
        const taskIndex = tasksCache.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            const task = tasksCache[taskIndex];
            const wasCompleted = task.completed;
            task.completed = !task.completed;

            if (task.completed) {
                task.completionDate = new Date().toISOString().split('T')[0]; // Set completion date
                if (!wasCompleted && !task.hasAwardedCompletionPoints) { // Award points only if transitioning to completed and not already awarded
                    updateStreakScore('task');
                    task.hasAwardedCompletionPoints = true;
                }
            } else {
                // If unchecking a task, streak points are generally not removed to avoid complexity,
                // but we reset completion date and awarded status if strictness is desired (current logic allows re-awarding if uncheck then re-check)
                // For simplicity, we will allow re-awarding if un-checked and re-checked later for a *new* completion.
                // However, if un-checking a task whose points were awarded, we should prevent re-awarding for *that same* completion instance.
                // The `hasAwardedCompletionPoints` flag handles this. If user unchecks and rechecks, the flag is still true for that task id.
                // A more robust system might involve unique completion IDs if tasks can be "re-opened".
                // Current logic: If unchecking, reset completion date. Points logic relies on hasAwardedCompletionPoints.
                task.completionDate = null;
                // Optional: If unchecking means points should be revocable or task can be re-completed for new points later:
                // task.hasAwardedCompletionPoints = false; // This would allow getting points again if re-completed
            }
            saveTasksToLocalStorage();
            renderTasks(tasksCache);
        }
    }));

    taskListUl.querySelectorAll('.task-delete-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.taskId;
            const taskIndex = tasksCache.findIndex(t => t.id === id);
            if (taskIndex > -1) {
                // Optional: Confirm before deleting
                // if (confirm(`Are you sure you want to delete task: "${tasksCache[taskIndex].text}"?`)) {
                    tasksCache.splice(taskIndex, 1);
                    saveTasksToLocalStorage();
                    renderTasks(tasksCache);
                // }
            }
        });
    });
}
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

if (addTaskButton && newTaskInput) {
    addTaskButton.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        if (text === '') return;
        tasksCache.push({
            id: Date.now().toString(), text: text, completed: false,
            createdAt: new Date().toISOString(), completionDate: null,
            hasAwardedCompletionPoints: false
        });
        saveTasksToLocalStorage(); renderTasks(tasksCache); newTaskInput.value = '';
    });
    newTaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTaskButton.click(); });
}

function loadTimerSettingsFromLocalStorage() {
    const storedSettings = localStorage.getItem('focumia-timer-settings');
    if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Merge, ensuring no old/unexpected properties are carried over
        currentTimerSettings.pomodoroDuration = parsedSettings.pomodoroDuration || 25;
        currentTimerSettings.shortBreakDuration = parsedSettings.shortBreakDuration || 5;
        currentTimerSettings.longBreakDuration = parsedSettings.longBreakDuration || 15;
        currentTimerSettings.pomodorosBeforeLongBreak = parsedSettings.pomodorosBeforeLongBreak || 4;
        currentTimerSettings.soundNotifications = typeof parsedSettings.soundNotifications === 'boolean' ? parsedSettings.soundNotifications : true;
        currentTimerSettings.browserNotifications = typeof parsedSettings.browserNotifications === 'boolean' ? parsedSettings.browserNotifications : true;
    }

    if (timerSettingsForm) {
        timerSettingsForm.pomodoroDuration.value = currentTimerSettings.pomodoroDuration;
        timerSettingsForm.shortBreakDuration.value = currentTimerSettings.shortBreakDuration;
        timerSettingsForm.longBreakDuration.value = currentTimerSettings.longBreakDuration;
        timerSettingsForm.pomodorosBeforeLongBreak.value = currentTimerSettings.pomodorosBeforeLongBreak;
        timerSettingsForm.soundNotifications.checked = currentTimerSettings.soundNotifications;
        timerSettingsForm.browserNotifications.checked = currentTimerSettings.browserNotifications;
        // Ensure 'enhancedFocusMode' checkbox state is handled if it's re-added
        // if (timerSettingsForm.enhancedFocusMode) {
        //     timerSettingsForm.enhancedFocusMode.checked = currentTimerSettings.enhancedFocusMode || false;
        // }
    }
    timeLeftInSeconds = currentTimerSettings.pomodoroDuration * 60;
    updateTimerDisplay(); // Update display with loaded/default settings
}

if (timerSettingsForm) timerSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentTimerSettings = {
        pomodoroDuration: parseInt(timerSettingsForm.pomodoroDuration.value) || 25,
        shortBreakDuration: parseInt(timerSettingsForm.shortBreakDuration.value) || 5,
        longBreakDuration: parseInt(timerSettingsForm.longBreakDuration.value) || 15,
        pomodorosBeforeLongBreak: parseInt(timerSettingsForm.pomodorosBeforeLongBreak.value) || 4,
        soundNotifications: timerSettingsForm.soundNotifications.checked,
        browserNotifications: timerSettingsForm.browserNotifications.checked,
        // enhancedFocusMode: timerSettingsForm.enhancedFocusMode ? timerSettingsForm.enhancedFocusMode.checked : false, // if re-added
    };
    localStorage.setItem('focumia-timer-settings', JSON.stringify(currentTimerSettings));

    if (settingsMessageDiv) {
        settingsMessageDiv.textContent = "Timer settings saved!";
        settingsMessageDiv.classList.remove('hidden');
        setTimeout(() => settingsMessageDiv.classList.add('hidden'), 3000);
    }

    // Reset timer to reflect new settings if it's not running
    if (!isTimerActive) {
        timeLeftInSeconds = currentTimerSettings.pomodoroDuration * 60;
        isBreakTime = false; // Ensure it resets to focus time
        pomodorosSessionCount = 0; // Reset session count for long break logic
        updateTimerDisplay();
    }
    // If timer IS active, changes will apply to the NEXT session.
    // Or, decide to stop and reset timer immediately:
    // clearInterval(pomodoroInterval); pomodoroInterval = null;
    // isTimerActive = false; isBreakTime = false; pomodorosSessionCount = 0;
    // timeLeftInSeconds = currentTimerSettings.pomodoroDuration * 60;
    // updateTimerDisplay();
});

// --- Streaks Page Rendering ---
function renderStreaksTable() {
    const container = document.getElementById('streaksTableContainer');
    if (!container) return;

    const weekData = streaksData[currentWeekIdentifier] || DAY_NAMES.map(dayName => ({day: dayName, tasksCompletedScore:0, focusSessionsScore:0, totalScore:0}));
    let tableHTML = `<table class="w-full text-left themed-text-primary text-xl md:text-2xl jersey-10-regular"><thead class="themed-border-b"><tr>
        <th class="p-2 sm:p-3">Day</th><th class="p-2 sm:p-3 text-right">Task Score</th><th class="p-2 sm:p-3 text-right">Focus Score</th><th class="p-2 sm:p-3 text-right font-bold">Total Score</th>
        </tr></thead><tbody>`;
    weekData.forEach(data => {
        tableHTML += `<tr class="themed-border-b"><td class="p-2 sm:p-3">${data.day}</td><td class="p-2 sm:p-3 text-right">${data.tasksCompletedScore}</td>
        <td class="p-2 sm:p-3 text-right">${data.focusSessionsScore}</td><td class="p-2 sm:p-3 text-right font-bold">${data.totalScore}</td></tr>`;
    });
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

function renderStreaksChart() {
    const canvas = document.getElementById('streaksChartCanvas');
    if (!canvas || typeof Chart === 'undefined') return;
    const weekData = streaksData[currentWeekIdentifier] || DAY_NAMES.map(dName => ({ day: dName, totalScore: 0 }));
    const labels = weekData.map(d => d.day);
    const scores = weekData.map(d => d.totalScore);
    const bodyStyles = getComputedStyle(document.body);

    // Use a reliable way to get theme colors for chart
    const primaryButtonBg = bodyStyles.getPropertyValue('--button-primary-bg').trim() || (currentTheme === 'dark' ? '#FFFFFF' : '#000000');
    const textColorSecondary = bodyStyles.getPropertyValue('--text-secondary').trim() || (currentTheme === 'dark' ? '#b0b0b0' : '#555555');
    const textColorPrimary = bodyStyles.getPropertyValue('--text-primary').trim() || (currentTheme === 'dark' ? '#FFFFFF' : '#000000');
    const borderColor = bodyStyles.getPropertyValue('--border-color').trim() || (currentTheme === 'dark' ? '#333333' : '#cccccc');

    // Function to convert rgb/hex to rgba with alpha
    function colorToRgba(color, alpha) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else if (color.startsWith('rgb(')) {
            return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
        } else if (color.startsWith('rgba(')) { // If already rgba, try to replace alpha
             return color.replace(/,\s*\d(\.\d+)?\)/, `, ${alpha})`);
        }
        return color; // Fallback
    }

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Daily Score', data: scores, fill: true,
            borderColor: primaryButtonBg,
            backgroundColor: colorToRgba(primaryButtonBg, 0.2),
            tension: 0.2, pointRadius: 5, pointBackgroundColor: primaryButtonBg,
        }]
    };
    if (streaksChartInstance) streaksChartInstance.destroy();
    streaksChartInstance = new Chart(canvas, {
        type: 'line', data: chartData,
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: textColorSecondary, font: { family: "'Jersey 10', sans-serif", size: 14 }}, grid: { color: borderColor }},
                x: { ticks: { color: textColorSecondary, font: { family: "'Jersey 10', sans-serif", size: 14 }}, grid: { display: false }}
            },
            plugins: { legend: { display: true, labels: { color: textColorPrimary, font: { family: "'Jersey 10', sans-serif", size: 16 }}}}
        }
    });
}

// --- Delete History Function ---
function deleteApplicationHistory() {
    if (confirm("Are you sure you want to delete ALL application data (theme, tasks, settings, and streaks)? This action cannot be undone.")) {
        localStorage.removeItem('focumia-theme');
        localStorage.removeItem('focumia-tasks');
        localStorage.removeItem('focumia-timer-settings');
        localStorage.removeItem('focumia-streaksData');

        // Reset in-memory state, though reload will handle most of this
        tasksCache = [];
        streaksData = {};
        currentTimerSettings = {
            pomodoroDuration: 25, shortBreakDuration: 5, longBreakDuration: 15,
            pomodorosBeforeLongBreak: 4, soundNotifications: true, browserNotifications: true
        };
        // No need to reset enhancedFocusMode here as it's removed from general settings object

        alert("All application data has been deleted. The app will now reload.");
        location.reload();
    }
}

// --- Homepage Review Functions ---
function showHomepageReview(dateString) {
    if (!homepageReviewSection || !homepageReviewTitle || !homepageReviewContent) return;

    const parts = dateString.split('-'); // YYYY-MM-DD
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);

    homepageReviewTitle.textContent = `Completed on ${dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}`;

    const tasksCompletedThatDay = tasksCache.filter(task => task.completed && task.completionDate === dateString);

    homepageReviewContent.innerHTML = ''; // Clear previous content

    if (tasksCompletedThatDay.length > 0) {
        const ulCompleted = document.createElement('ul');
        ulCompleted.className = 'space-y-2 list-disc list-inside ml-0'; // Adjusted for better list appearance
        tasksCompletedThatDay.forEach(task => {
            const li = document.createElement('li');
            li.className = 'themed-text-primary text-xl'; // Ensure text color is primary for readability
            li.textContent = escapeHtml(task.text); // Escape task text
            ulCompleted.appendChild(li);
        });
        homepageReviewContent.appendChild(ulCompleted);
    } else {
        const pNoneCompleted = document.createElement('p');
        pNoneCompleted.className = 'themed-text-secondary text-xl';
        pNoneCompleted.textContent = 'No tasks were completed on this day.';
        homepageReviewContent.appendChild(pNoneCompleted);
    }

    homepageReviewSection.classList.remove('hidden');
    homepageReviewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideHomepageReview() {
    if (homepageReviewSection) {
        homepageReviewSection.classList.add('hidden');
    }
}

if (closeHomepageReviewButton) closeHomepageReviewButton.addEventListener('click', hideHomepageReview);


// --- App Initialization ---
const FOOTER_HTML = `
    <p>
        Powered by <a href="https://github.com/codliro" target="_blank" rel="noopener noreferrer" class="themed-text-primary hover:underline">CodliRo</a>.
        Follow us on <a href="https://github.com/codliro" target="_blank" rel="noopener noreferrer" class="themed-text-primary hover:underline">GitHub</a>.
    </p>
    <p class="mt-2">
        <a href="https://github.com/codliro/focumia/issues" target="_blank" rel="noopener noreferrer" class="menu-item-link themed-text-primary hover:underline" data-page="bug-report-external">Report a Bug</a> |
        <a href="#" class="menu-item-link themed-text-primary hover:underline" data-page="privacy-policy">Privacy Policy</a> |
        <a href="#" class="menu-item-link themed-text-primary hover:underline" data-page="cookie-policy">Cookie Policy</a> |
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" class="menu-item-link themed-text-primary hover:underline" data-page="license-external">MIT License</a>
    </p>
`;

function initApp() {
    console.log("Initializing Focumia App...");
    loadTimerSettingsFromLocalStorage();
    loadTasksFromLocalStorage();
    loadStreaksDataFromLocalStorage();

    applyTheme(currentTheme); // Apply theme early

    document.querySelectorAll('.page-footer').forEach(footer => {
        footer.innerHTML = FOOTER_HTML;
    });

    if (logoFocumiaEl) {
        logoFocumiaEl.addEventListener('click', () => {
            showPage('home-page');
            if (homepageReviewSection && !homepageReviewSection.classList.contains('hidden')) { // Hide review if open
                hideHomepageReview();
            }
        });
    }

    // Set icons for buttons
    if (menuButton) menuButton.innerHTML = ICONS.menu;
    if (timerStartPauseButton) timerStartPauseButton.innerHTML = ICONS.play + " Start"; // Initial state
    if (timerResetButton) timerResetButton.innerHTML = ICONS.reset + " Reset";
    if (timerSkipButton) timerSkipButton.innerHTML = ICONS.skip + " Skip";
    if (addTaskButton) addTaskButton.innerHTML = ICONS.plus;

    // Event Listeners
    if (themeToggleButton) themeToggleButton.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark'; applyTheme(currentTheme);
    });

    if (menuButton && menuDropdown) {
        menuButton.addEventListener('click', (e) => { e.stopPropagation(); menuDropdown.classList.toggle('hidden'); });
        bodyEl.addEventListener('click', (e) => { // Close dropdown if clicking outside
            if (menuDropdown && !menuDropdown.classList.contains('hidden') && !menuDropdown.contains(e.target) && e.target !== menuButton && !menuButton.contains(e.target)) {
                 menuDropdown.classList.add('hidden');
            }
        });
        menuDropdown.addEventListener('click', (e) => e.stopPropagation()); // Prevent closing when clicking inside dropdown
    }

    document.querySelectorAll('.menu-item, .menu-item-link').forEach(item => {
        const pageName = item.dataset.page;
        if (pageName && !pageName.endsWith('-external')) { // Handle internal page links
            item.addEventListener('click', (e) => {
                if(item.getAttribute('href') === '#') e.preventDefault(); // Prevent hash jump for non-external links

                const pageId = pageName + '-page';
                showPage(pageId);

                if (item.closest('#menu-dropdown') && menuDropdown) { // Close dropdown after selection
                    menuDropdown.classList.add('hidden');
                }
            });
        }
        // External links (data-page ends with '-external') will work via their href attribute naturally
    });

    // ***** FIX: Attach event listener for Delete All Data button *****
    const deleteHistoryButton = document.getElementById('delete-history-button');
    if (deleteHistoryButton) {
        deleteHistoryButton.addEventListener('click', deleteApplicationHistory);
    }
    // ***** END FIX *****

    if (mainAppAreaEl) mainAppAreaEl.classList.remove('hidden');
    showPage('home-page'); // Show home page by default

    if (splashScreenEl) { // Handle splash screen fade out
        setTimeout(() => {
            splashScreenEl.style.opacity = '0'; // Start fade out
            splashScreenEl.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                splashScreenEl.classList.remove('active');
                splashScreenEl.classList.add('hidden');
            }, 500); // Wait for fade out transition to complete
        }, 1200); // Initial delay before fading splash
    }


    // Request notification permission if not already granted or denied
    if (currentTimerSettings.browserNotifications && typeof Notification !== 'undefined' && Notification.permission !== "granted" && Notification.permission !== "denied") {
         Notification.requestPermission().then(permission => {
            console.log("Browser Notification Permission:", permission);
            if (permission === "denied" && timerSettingsForm && timerSettingsForm.browserNotifications) {
                // Optionally uncheck the box if permission is denied by user
                // timerSettingsForm.browserNotifications.checked = false;
                // currentTimerSettings.browserNotifications = false;
                // localStorage.setItem('focumia-timer-settings', JSON.stringify(currentTimerSettings));
            }
         });
    }

    updateTimerDisplay(); // Ensure timer display is correct on load
    renderWeeklyCalendar(); // Initial render of calendar
    // renderTasks(tasksCache); // Already called by showPage('home-page') -> renderTasks
}

// Initialize the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
