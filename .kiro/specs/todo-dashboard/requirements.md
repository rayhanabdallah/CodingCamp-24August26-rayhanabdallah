# Requirements Document

## Introduction

A fully client-side dashboard website built with HTML, CSS, and Vanilla JavaScript. All data is stored in the browser's Local Storage. The dashboard includes a greeting widget with a live clock, a Focus Timer, a To-Do List, and a Quick Links panel.

**Technical Constraints**
- TC-1: HTML + CSS + Vanilla JavaScript only (no frameworks or build tools)
- TC-2: All data persisted via the Browser Local Storage API
- TC-3: Compatible with modern versions of Chrome, Firefox, Edge, and Safari
- TC-4: Single `index.html` at root, one `css/style.css`, one `js/app.js`

## Glossary

- **Dashboard**: The single-page client-side application that hosts the greeting widget, Focus Timer, To-Do List, and Quick Links panel.
- **Focus Timer**: A countdown timer, defaulting to 25 minutes, used to run focused work sessions following the Pomodoro technique.
- **To-Do List**: The collection of user-created tasks displayed on the Dashboard, each with a description and a completed state.
- **Task**: A single to-do item consisting of a text description and a completed state.
- **Quick Link**: A user-defined shortcut consisting of a label and a URL that opens a website in a new browser tab.
- **Local Storage**: The Browser Local Storage API used to persist tasks, quick links, theme, personal name, timer duration, and sort preference across browser sessions.
- **Theme**: The visual appearance mode of the Dashboard, either light theme or dark theme.
- **Personal Name**: A user-provided name displayed within the greeting text.
- **Sort Preference**: The user-selected ordering option applied to the rendered To-Do List (completion status, alphabetical, or creation order).
- **Greeting**: The contextual message displayed to the user based on the current time of day and, optionally, the Personal Name.

## Requirements

### Requirement 1: Live Clock

**User Story:** As a user, I want to see the current time update every second, so that I always know what time it is without leaving the dashboard.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display the current time in HH:MM:SS format
2. WHILE the page is open THEN the system SHALL update the displayed time every second
3. WHEN the clock is displayed THEN the system SHALL use 24-hour format with zero-padded hours, minutes, and seconds

### Requirement 2: Current Date Display

**User Story:** As a user, I want to see the current date on the dashboard, so that I can quickly reference today's date without switching apps.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display the current date in a human-readable format (e.g., Monday, 26 August 2024)
2. WHEN the date is displayed THEN the system SHALL include the full day name, numeric day, full month name, and full year
3. WHEN midnight passes THEN the system SHALL update the displayed date automatically

### Requirement 3: Time-Based Greeting

**User Story:** As a user, I want to see a contextual greeting based on the time of day, so that the dashboard feels personal and relevant.

#### Acceptance Criteria

1. WHEN the current time is between 05:00 and 11:59 THEN the system SHALL display "Good Morning"
2. WHEN the current time is between 12:00 and 17:59 THEN the system SHALL display "Good Afternoon"
3. WHEN the current time is between 18:00 and 21:59 THEN the system SHALL display "Good Evening"
4. WHEN the current time is between 22:00 and 04:59 THEN the system SHALL display "Good Night"
5. WHEN the time crosses a greeting boundary THEN the system SHALL update the greeting automatically without a page reload

### Requirement 4: Start Focus Timer

**User Story:** As a user, I want to start a 25-minute Focus Timer, so that I can use the Pomodoro technique to manage focused work sessions.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display the Focus Timer initialised to 25:00 in MM:SS format
2. WHEN the user clicks the Start button THEN the system SHALL begin counting down from the current displayed time
3. WHEN the timer is running THEN the system SHALL decrement the display by one second every real-world second
4. WHEN the timer is running THEN the system SHALL disable the Start button and enable the Stop button

### Requirement 5: Stop and Reset Focus Timer

**User Story:** As a user, I want to stop and reset the Focus Timer, so that I can pause my session or start a fresh one.

#### Acceptance Criteria

1. WHEN the user clicks the Stop button while the timer is running THEN the system SHALL pause the countdown at its current value
2. WHEN the timer is stopped THEN the system SHALL enable the Start button and disable the Stop button
3. WHEN the user clicks the Reset button THEN the system SHALL stop any active countdown and reset the display to 25:00
4. WHEN the timer is reset THEN the system SHALL enable the Start button and disable the Stop button

### Requirement 6: Focus Timer Completion Notification

**User Story:** As a user, I want to be notified when my Focus Timer finishes, so that I know my session is complete without watching the screen.

#### Acceptance Criteria

1. WHEN the timer countdown reaches 00:00 THEN the system SHALL display a visible on-screen notification or alert indicating the session is complete
2. WHEN the timer countdown reaches 00:00 THEN the system SHALL play an audible beep or use the browser Notification API if permission is granted
3. WHEN the timer reaches 00:00 THEN the system SHALL reset the display to 25:00 and return to the stopped state

### Requirement 7: Add Tasks

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can capture things I need to accomplish.

#### Acceptance Criteria

1. WHEN a user types a task description and presses Enter or clicks the Add button THEN the system SHALL create a new task and append it to the list
2. WHEN a user attempts to add a task with an empty or whitespace-only description THEN the system SHALL prevent the addition and keep the input field focused
3. WHEN a new task is successfully added THEN the system SHALL clear the input field immediately
4. WHEN a task is added THEN the system SHALL persist it to Local Storage immediately

### Requirement 8: Mark Tasks Done

**User Story:** As a user, I want to mark tasks as done, so that I can track my progress.

#### Acceptance Criteria

1. WHEN a user clicks the complete checkbox or button on a task THEN the system SHALL toggle the task's completed state
2. WHEN a task is marked as completed THEN the system SHALL apply a strikethrough visual style to the task description
3. WHEN a task is unchecked THEN the system SHALL remove the strikethrough style and restore normal appearance
4. WHEN a task's completed state changes THEN the system SHALL persist the updated state to Local Storage immediately

### Requirement 9: Edit Tasks

**User Story:** As a user, I want to edit existing tasks, so that I can correct mistakes or update task descriptions.

#### Acceptance Criteria

1. WHEN a user clicks the Edit button on a task THEN the system SHALL replace the task's display text with an editable input field pre-filled with the current description
2. WHEN the user confirms the edit by pressing Enter or clicking a Save button THEN the system SHALL update the task description with the new value
3. WHEN the user submits an edit with an empty or whitespace-only value THEN the system SHALL reject the edit and restore the original description
4. WHEN a task description is successfully updated THEN the system SHALL persist the change to Local Storage immediately

### Requirement 10: Delete Tasks

**User Story:** As a user, I want to delete tasks, so that I can remove items I no longer need.

#### Acceptance Criteria

1. WHEN a user clicks the Delete button on a task THEN the system SHALL remove that task from the list and from Local Storage
2. WHEN a task is deleted THEN the system SHALL update the visible list immediately without a page reload
3. WHEN the last task is deleted THEN the system SHALL display an empty-state message (e.g., "No tasks yet. Add one above!")

### Requirement 11: Task Persistence

**User Story:** As a user, I want my tasks to be saved across browser sessions, so that I do not lose them when I close or refresh the tab.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL read all saved tasks from Local Storage and render them in the list
2. WHEN tasks are loaded from storage THEN the system SHALL preserve each task's description and completed state
3. WHEN Local Storage contains no task data THEN the system SHALL render an empty list with the empty-state message

### Requirement 12: Add Quick Links

**User Story:** As a user, I want to add quick links to the dashboard, so that I can access frequently visited websites with a single click.

#### Acceptance Criteria

1. WHEN a user enters a label and a URL and clicks the Add Link button THEN the system SHALL add the link to the Quick Links panel
2. WHEN a user attempts to add a link with an empty label or empty URL THEN the system SHALL prevent the addition and highlight the missing field(s)
3. WHEN a link is added THEN the system SHALL persist it to Local Storage immediately
4. WHEN a URL is entered without a protocol prefix THEN the system SHALL prepend "https://" automatically before saving

### Requirement 13: Open Quick Links in New Tab

**User Story:** As a user, I want quick links to open in a new browser tab, so that I stay on the dashboard while visiting the linked site.

#### Acceptance Criteria

1. WHEN a user clicks a quick link THEN the system SHALL open the target URL in a new browser tab
2. WHEN a quick link is rendered THEN the system SHALL display the user-provided label as the link text
3. WHEN a quick link is opened THEN the system SHALL set the `rel` attribute to `"noopener noreferrer"` for security

### Requirement 14: Delete Quick Links

**User Story:** As a user, I want to delete quick links, so that I can remove links I no longer need.

#### Acceptance Criteria

1. WHEN a user clicks the Delete button on a quick link THEN the system SHALL remove that link from the panel and from Local Storage
2. WHEN a quick link is deleted THEN the system SHALL update the panel immediately without a page reload
3. WHEN the last quick link is deleted THEN the system SHALL display an empty-state message (e.g., "No links saved yet.")

### Requirement 15: Quick Link Persistence

**User Story:** As a user, I want my quick links to be saved across browser sessions, so that I do not have to re-enter them every time I open the dashboard.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL read all saved quick links from Local Storage and render them in the panel
2. WHEN quick links are loaded from storage THEN the system SHALL preserve each link's label and URL
3. WHEN Local Storage contains no quick link data THEN the system SHALL render the panel with the empty-state message

### Requirement 16: Light / Dark Mode

**User Story:** As a user, I want to toggle between light and dark themes, so that I can view the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN a user activates the theme toggle control THEN the system SHALL switch the dashboard between light theme and dark theme
2. WHEN the theme is changed THEN the system SHALL persist the selected theme to Local Storage immediately
3. WHEN the page loads THEN the system SHALL read the saved theme from Local Storage and apply it before rendering the dashboard content
4. WHERE Local Storage contains no saved theme THEN the system SHALL apply the light theme as the default

### Requirement 17: Custom Greeting Name

**User Story:** As a user, I want to set a personal name that appears in the greeting, so that the dashboard feels tailored to me.

#### Acceptance Criteria

1. WHEN a user enters a personal name and confirms it THEN the system SHALL include the name in the greeting text (e.g., "Good Morning, Rayhan")
2. WHEN a personal name is set THEN the system SHALL persist the name to Local Storage immediately
3. WHEN the page loads THEN the system SHALL read the saved name from Local Storage and display it in the greeting
4. WHERE Local Storage contains no saved name THEN the system SHALL display the greeting without a personal name (e.g., "Good Morning")
5. WHEN a user submits an empty or whitespace-only name THEN the system SHALL reject the value and retain the previously saved name

### Requirement 18: Configurable Focus Timer Duration

**User Story:** As a user, I want to configure the Focus Timer duration, so that I can use a session length that suits my workflow instead of a fixed 25 minutes.

#### Acceptance Criteria

1. WHEN a user sets a Focus Timer duration in whole minutes THEN the system SHALL update the displayed timer to the configured duration in MM:SS format
2. WHEN a user submits a duration that is not a positive whole number of minutes THEN the system SHALL reject the value and retain the previously configured duration
3. WHEN the Focus Timer duration is configured THEN the system SHALL persist the duration to Local Storage immediately
4. WHEN the user clicks the Reset button THEN the system SHALL reset the display to the configured duration rather than a fixed 25 minutes
5. WHEN the page loads THEN the system SHALL read the saved duration from Local Storage and initialise the Focus Timer to that duration
6. WHERE Local Storage contains no saved duration THEN the system SHALL initialise the Focus Timer to 25 minutes as the default

### Requirement 19: Prevent Duplicate Tasks

**User Story:** As a user, I want the dashboard to prevent duplicate tasks, so that my to-do list stays free of repeated entries.

#### Acceptance Criteria

1. WHEN a user adds a task whose trimmed description matches an existing task's trimmed description, compared case-insensitively THEN the system SHALL prevent the addition of the duplicate task
2. WHEN a duplicate task addition is prevented THEN the system SHALL display a notification informing the user that the task already exists
3. WHEN a duplicate task addition is prevented THEN the system SHALL retain the existing task list unchanged in both the display and Local Storage

### Requirement 20: Sort To-Do List

**User Story:** As a user, I want to sort my to-do list, so that I can view tasks in an order that helps me work through them.

#### Acceptance Criteria

1. WHEN a user selects a sort option THEN the system SHALL reorder the rendered to-do list according to the selected option
2. WHERE the user selects sort by completion status THEN the system SHALL group tasks by completed state in the rendered list
3. WHERE the user selects alphabetical sort THEN the system SHALL order tasks by their description in ascending case-insensitive order
4. WHERE the user selects sort by creation order THEN the system SHALL order tasks from oldest to newest based on when each task was added
5. WHEN the sort option is changed THEN the system SHALL persist the selected sort preference to Local Storage immediately
6. WHEN the page loads THEN the system SHALL read the saved sort preference from Local Storage and apply it to the rendered to-do list
