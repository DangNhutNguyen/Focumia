# Focumia

> Your Personal Pomodoro and Task Management Companion for Enhanced Focus and Productivity!

Welcome to **Focumia**! This web application is meticulously designed to help you conquer distractions, master your tasks, and build rock-solid productive habits. By elegantly combining the renowned Pomodoro Technique with intuitive task management, motivational streak tracking, and insightful daily reviews, Focumia empowers you to achieve deep focus and peak efficiency, all while ensuring your data remains private and secure on your own device.

## Key Features

Focumia is packed with features to streamline your workflow:

* **Customizable Pomodoro Timer:** Tailor focus, short break, and long break durations. Configure Pomodoros per long break. Includes optional sound and browser notifications.
* **Smart Task Checklist:** Easily add, complete, and remove tasks. A dynamic counter (`X/Y done`) keeps you updated on your progress.
* **Interactive Weekly Calendar & Daily Review:** View your current week at a glance. Click any day to review tasks completed on that specific date, fostering reflection and celebrating achievements.
* **Motivational Streak System:** Build momentum by earning points for completing focus sessions (+5) and for finishing tasks for the first time (+10). Visualize your weekly dedication with an insightful line graph and a detailed score table.
* **Personalized Themes:** Instantly switch between a clean Light Mode and a focused Dark Mode. Your preference is saved locally.
* **Persistent Settings:** All your timer configurations and notification choices are remembered by your browser.
* **Privacy First:** All your data (tasks, settings, streaks) is stored exclusively in your browser's `localStorage`. Nothing is sent to any server.
* **Full Data Control:** A "Delete All Data" option in the menu allows you to reset the application at any time.
* **Transparent Policies:** Clear Privacy Policy and Cookie Policy pages are readily accessible.
* **Quick Navigation:** Click the "Focumia" logo in the header to instantly return to the Home page.

## The "Base" - Technology Stack

Focumia is built with a clean and efficient client-side architecture:

* **HTML5:** For the core structure and content.
* **CSS3:** For custom styling, theming (light/dark modes), and responsive design.
  * **Tailwind CSS:** Utilized via CDN for rapid UI development with utility classes.
* **Vanilla JavaScript (ES6 Modules):** Powers all the dynamic functionality, interactivity, and data management. No external JS frameworks are used for core logic, keeping it lightweight.
* **Chart.js:** Integrated via CDN to render the visual line graph for the streaks page.
* **Browser `localStorage`:** Used for all data persistence (tasks, settings, themes, streaks), ensuring your information stays on your device.
* **Google Fonts:** For the unique "Jersey 10" display font.

## How It Works (Code Structure)

Focumia is a single-page application (SPA) where all operations happen directly in your browser. The codebase is primarily organized into three main files:

1.  **`index.html`:**
    * Defines the overall page structure, including the splash screen, header, main content area (which hosts different "pages" like Home, Settings, Streaks, Policies), and the various sections within each page (e.g., Pomodoro timer, task list, calendar, review section).
    * Links to external resources like Tailwind CSS, Google Fonts, Chart.js, and the local `style.css` and `script.js`.

2.  **`style.css`:**
    * Contains custom CSS rules that complement Tailwind CSS.
    * Defines CSS variables for theming (light and dark modes), allowing for dynamic style changes based on user preference.
    * Includes specific styles for custom components like the task items, calendar days, policy content formatting, and scrollbars.

3.  **`script.js`:**
    * This is the heart of the application, handling all logic and interactivity.
    * **State Management:** Manages global variables for the current theme, timer settings, task list (`tasksCache`), streak data, etc.
    * **DOM Manipulation:** Dynamically renders and updates UI elements like the timer display, task list, weekly calendar, review section, and streaks chart/table.
    * **Event Handling:** Manages all user interactions, such as button clicks (timer controls, theme toggle, menu navigation, task operations, calendar day clicks), form submissions (settings), and keyboard inputs (adding tasks).
    * **Core Features Logic:** Implements the Pomodoro timer cycles, task completion and removal, streak scoring, daily review data fetching, and settings management.
    * **`localStorage` Interaction:** Handles saving and loading all persistent data (tasks, settings, theme, streaks) to and from the browser's local storage.
    * **Modularity:** Organized into functions for specific purposes (e.g., `applyTheme`, `renderTasks`, `updateStreakScore`, `showPage`, `initApp`).

Essentially, `index.html` sets up the stage, `style.css` dresses it, and `script.js` brings it to life, making everything interactive and functional directly within your browser.

## Getting Started

Focumia is designed for easy local use:

1.  **Download the Files:** Ensure you have `index.html`, `style.css`, and `script.js`.
2.  **Keep Them Together:** Place all three files in the same folder on your computer.
3.  **Open in Browser:** Open the `index.html` file using your preferred web browser (e.g., Chrome, Firefox, Edge, Safari).
4.  **Start Focusing!** Begin using Focumia to manage your time and tasks effectively.

## Contact & Feedback

* **Found a bug or have a feature suggestion?**  
  Please report it on our GitHub Issues page: [https://github.com/codliro/focumia/issues](https://github.com/codliro/focumia/issues)  

* **General Inquiries:**  
  You can reach out via email at [penciltalk0910@gmail.com](mailto:penciltalk0910@gmail.com).

## License

This project is licensed under the **[MIT License](https://opensource.org/licenses/MIT)**.

---

Powered by **[CodliRo](https://github.com/codliro)**
