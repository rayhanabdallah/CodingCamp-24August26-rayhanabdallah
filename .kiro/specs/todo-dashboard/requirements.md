# Requirements: To-Do List Live Dashboard

## Overview

A fully client-side dashboard website built with HTML, CSS, and Vanilla JavaScript. All data is stored in the browser's Local Storage. The dashboard includes a greeting widget with a live clock, a Focus Timer, a To-Do List, and a Quick Links panel.

**Technical Constraints**
- TC-1: HTML + CSS + Vanilla JavaScript only (no frameworks or build tools)
- TC-2: All data persisted via the Browser Local Storage API
- TC-3: Compatible with modern versions of Chrome, Firefox, Edge, and Safari
- TC-4: Single `index.html` at root, one `css/style.css`, one `js/app.js`

---

## Requirement 1

**User Story:** As a user, I want to see the current time update every second, so that I always know what time it is without leaving the dashboard.

### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display the current time in HH:MM:SS format
2. WHILE the page is open THEN the system SHALL update the displayed time every second
3. WHEN the clock is displayed THEN the system SHALL use 24-hour format with zero-padded hours, minutes, and seconds

---

## Requirement 2

**User Story:** As a user, I want to see the current date on the dashboard, so that I can quickly reference today's date without switching apps.

### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display the current date in a human-readable format (e.g., Monday, 26 August 2024)
2. WHEN the date is displayed THEN the system SHALL include the full day name, numeric day, full month name, and full year
3. WHEN midnight passes THEN the system SHALL update the displayed date automatically

---

## Requirement 3

**User Story:** As a user, I want to see a contextual greeting based on the time of day, so that the dashboard feels personal and relevant.

### Acceptance Criteria

1. WHEN the current time is between 05:00 and 11:59 THEN the system SHALL display "Good Morning"
2. WHEN the current time is between 12:00 and 17:59 THEN the system SHALL display "Good Afternoon"
3. WHEN the current time is between 18:00 and 21:59 THEN the system SHALL display "Good Evening"
4. WHEN the current time is between 22:00 and 04:59 THEN the system SHALL display "Good Night"
5. WHEN the time crosses a greeting boundary THEN the system SHALL update the greeting automatically without a page reload

---

## Requirement 4

**User Story:** As a user, I want to start a 25-minute Focus Timer, so that I can use the Pomodoro technique to manage focused work sessions.

### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display the Focus Timer initialised to 25:00 in MM:SS format
2. WHEN the user clicks the Start button THEN the system SHALL begin counting down from the current displayed time
3. WHEN the timer is running THEN the system SHALL decrement the display by one second every real-world second
4. WHEN the timer is running THEN the system SHALL disable the Start button and enable the Stop button

---

## Requirement 5

**User Story:** As a user, I want to stop and reset the Focus Timer, so that I can pause my session or start a fresh one.

### Acceptance Criteria

1. WHEN the user clicks the Stop button while the timer is running THEN the system SHALL pause the countdown at its current value
2. WHEN the timer is stopped THEN the system SHALL enable the Start button and disable the Stop button
3. WHEN the user clicks the Reset button THEN the system SHALL stop any active countdown and reset the display to 25:00
4. WHEN the timer is reset THEN the system SHALL enable the Start button and disable the Stop button

---

## Requirement 6

**User Story:** As a user, I want to be notified when my Focus Timer finishes, so that I know my session is complete without watching the screen.

### Acceptance Criteria

1. WHEN the timer countdown reaches 00:00 THEN the system SHALL display a visible on-screen notification or alert indicating the session is complete
2. WHEN the timer countdown reaches 00:00 THEN the system SHALL play an audible beep or use the browser Notification API if permission is granted
3. WHEN the timer reaches 00:00 THEN the system SHALL reset the display to 25:00 and return to the stopped state

---

## Requirement 7

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can capture things I need to accomplish.

### Acceptance Criteria

1. WHEN a user types a task description and presses Enter or clicks the Add button THEN the system SHALL create a new task and append it to the list
2. WHEN a user attempts to add a task with an empty or whitespace-only description THEN the system SHALL prevent the addition and keep the input field focused
3. WHEN a new task is successfully added THEN the system SHALL clear the input field immediately
4. WHEN a task is added THEN the system SHALL persist it to Local Storage immediately

---

## Requirement 8

**User Story:** As a user, I want to mark tasks as done, so that I can track my progress.

### Acceptance Criteria

1. WHEN a user clicks the complete checkbox or button on a task THEN the system SHALL toggle the task's completed state
2. WHEN a task is marked as completed THEN the system SHALL apply a strikethrough visual style to the task description
3. WHEN a task is unchecked THEN the system SHALL remove the strikethrough style and restore normal appearance
4. WHEN a task's completed state changes THEN the system SHALL persist the updated state to Local Storage immediately

---

## Requirement 9

**User Story:** As a user, I want to edit existing tasks, so that I can correct mistakes or update task descriptions.

### Acceptance Criteria

1. WHEN a user clicks the Edit button on a task THEN the system SHALL replace the task's display text with an editable input field pre-filled with the current description
2. WHEN the user confirms the edit by pressing Enter or clicking a Save button THEN the system SHALL update the task description with the new value
3. WHEN the user submits an edit with an empty or whitespace-only value THEN the system SHALL reject the edit and restore the original description
4. WHEN a task description is successfully updated THEN the system SHALL persist the change to Local Storage immediately

---

## Requirement 10

**User Story:** As a user, I want to delete tasks, so that I can remove items I no longer need.

### Acceptance Criteria

1. WHEN a user clicks the Delete button on a task THEN the system SHALL remove that task from the list and from Local Storage
2. WHEN a task is deleted THEN the system SHALL update the visible list immediately without a page reload
3. WHEN the last task is deleted THEN the system SHALL display an empty-state message (e.g., "No tasks yet. Add one above!")

---

## Requirement 11

**User Story:** As a user, I want my tasks to be saved across browser sessions, so that I do not lose them when I close or refresh the tab.

### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL read all saved tasks from Local Storage and render them in the list
2. WHEN tasks are loaded from storage THEN the system SHALL preserve each task's description and completed state
3. WHEN Local Storage contains no task data THEN the system SHALL render an empty list with the empty-state message

---

## Requirement 12

**User Story:** As a user, I want to add quick links to the dashboard, so that I can access frequently visited websites with a single click.

### Acceptance Criteria

1. WHEN a user enters a label and a URL and clicks the Add Link button THEN the system SHALL add the link to the Quick Links panel
2. WHEN a user attempts to add a link with an empty label or empty URL THEN the system SHALL prevent the addition and highlight the missing field(s)
3. WHEN a link is added THEN the system SHALL persist it to Local Storage immediately
4. WHEN a URL is entered without a protocol prefix THEN the system SHALL prepend "https://" automatically before saving

---

## Requirement 13

**User Story:** As a user, I want quick links to open in a new browser tab, so that I stay on the dashboard while visiting the linked site.

### Acceptance Criteria

1. WHEN a user clicks a quick link THEN the system SHALL open the target URL in a new browser tab
2. WHEN a quick link is rendered THEN the system SHALL display the user-provided label as the link text
3. WHEN a quick link is opened THEN the system SHALL set the `rel` attribute to `"noopener noreferrer"` for security

---

## Requirement 14

**User Story:** As a user, I want to delete quick links, so that I can remove links I no longer need.

### Acceptance Criteria

1. WHEN a user clicks the Delete button on a quick link THEN the system SHALL remove that link from the panel and from Local Storage
2. WHEN a quick link is deleted THEN the system SHALL update the panel immediately without a page reload
3. WHEN the last quick link is deleted THEN the system SHALL display an empty-state message (e.g., "No links saved yet.")

---

## Requirement 15

**User Story:** As a user, I want my quick links to be saved across browser sessions, so that I do not have to re-enter them every time I open the dashboard.

### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL read all saved quick links from Local Storage and render them in the panel
2. WHEN quick links are loaded from storage THEN the system SHALL preserve each link's label and URL
3. WHEN Local Storage contains no quick link data THEN the system SHALL render the panel with the empty-state message
