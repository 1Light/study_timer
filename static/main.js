// DOM elements
let focusButton = document.getElementById("focus");
let buttons = document.querySelectorAll(".btn");
let shortBreakButton = document.getElementById("shortbreak");
let longBreakButton = document.getElementById("longbreak");
let saveButton = document.getElementById("save");
let closeButton = document.getElementById("close");
let settingsButton = document.getElementById("settings");
let settingsContainer = document.getElementById("settingsContainer");
let validationMessages = document.getElementById("validationMessages");

let startBtn = document.getElementById("btn-start");
let reset = document.getElementById("btn-reset");
let pause = document.getElementById("btn-pause");
let time = document.getElementById("time");

let set;
let active = "focus"; // Default active session type
let count = 59; // Seconds countdown
let paused = true; // Timer paused by default
let minCount = 24; // Default countdown minutes for focus time

// Initial display of timer
time.textContent = `${minCount + 1}:00`;

// Function to append zero to single-digit values
const appendZero = (value) => {
  return value < 10 ? `0${value}` : value;
};

// Function to update the timer display based on active session type
const updateTimer = () => {
  // Pause the timer
  pauseTimer();

  // Update countdown based on active session
  if (active === "focus") {
    minCount = defaultFocusTime - 1;
  } else if (active === "short") {
    minCount = defaultShortBreakTime - 1;
  } else if (active === "long") {
    minCount = defaultLongBreakTime - 1;
  }

  count = 59; // Reset seconds countdown
  time.textContent = `${appendZero(minCount + 1)}:00`; // Update timer display
};

// Event listener for reset button
reset.addEventListener("click", () => {
  pauseTimer(); // Pause the timer
  updateTimer(); // Update timer display
});

// Function to remove focus styling from all buttons
const removeFocus = () => {
  buttons.forEach((btn) => {
    btn.classList.remove("btn-focus");
  });
};

// Default durations for focus, short break, and long break times
let defaultFocusTime = 25;
let defaultShortBreakTime = 5;
let defaultLongBreakTime = 15;

// Function to update settings input values
const updateSettingsInputs = () => {
  document.getElementById("focusTime").value = defaultFocusTime;
  document.getElementById("shortBreakTime").value = defaultShortBreakTime;
  document.getElementById("longBreakTime").value = defaultLongBreakTime;
};

// Event listeners for session type buttons (focus, short break, long break)
focusButton.addEventListener("click", () => {
  active = "focus"; // Set active session type to focus
  removeFocus(); // Remove focus styling from all buttons
  focusButton.classList.add("btn-focus"); // Add focus styling to the focus button
  updateTimer(); // Update timer display
});

shortBreakButton.addEventListener("click", () => {
  active = "short"; // Set active session type to short break
  removeFocus(); // Remove focus styling from all buttons
  shortBreakButton.classList.add("btn-focus"); // Add focus styling to the short break button
  updateTimer(); // Update timer display
});

longBreakButton.addEventListener("click", () => {
  active = "long"; // Set active session type to long break
  removeFocus(); // Remove focus styling from all buttons
  longBreakButton.classList.add("btn-focus"); // Add focus styling to the long break button
  updateTimer(); // Update timer display
});

// Variable to track visibility state of settings container
let visibility = false;

// Event listener for settings button
settingsButton.addEventListener("click", () => {
  active = "settings"; // Set active session type to settings
  removeFocus(); // Remove focus styling from all buttons
  settingsButton.classList.add("btn-focus"); // Add focus styling to the settings button

  // Toggle visibility of settings container
  if (!visibility) {
    settingsContainer.classList.remove('hide');
    settingsContainer.classList.add('show');
    updateSettingsInputs(); // Update settings input values
    visibility = true; // Update visibility state
  } else {
    settingsContainer.classList.add('hide');
    settingsContainer.classList.remove('show');
    visibility = false; // Update visibility state
  }
});

// Event listener for close button in settings
closeButton.addEventListener("click", () => {
  settingsContainer.classList.add('hide');
  settingsContainer.classList.remove('show');
  validationMessages.classList.add('hide');
  validationMessages.classList.remove('show');
  visibility = false; // Update visibility state
});

// Event listener for save button in settings
saveButton.addEventListener("click", () => {
  // Get new values from settings inputs
  let newFocusTime = document.getElementById("focusTime").value.trim();
  let newShortBreakTime = document.getElementById("shortBreakTime").value.trim();
  let newLongBreakTime = document.getElementById("longBreakTime").value.trim();

  // Validate input values
  if (newFocusTime <= 0 || isNaN(newFocusTime)) {
    document.getElementById("validationMessages").textContent = "Focus time should be greater than 0 and must be a number.";
    validationMessages.classList.remove('hide');
    validationMessages.classList.add('show');
    return;
  }
  if (newShortBreakTime <= 0 || isNaN(newShortBreakTime)) {
    document.getElementById("validationMessages").textContent = "Short break time should be greater than 0 and must be a number.";
    validationMessages.classList.remove('hide');
    validationMessages.classList.add('show');
    return;
  }
  if (newLongBreakTime <= 0 || isNaN(newLongBreakTime)) {
    document.getElementById("validationMessages").textContent = "Long break time should be greater than 0 and must be a number.";
    validationMessages.classList.remove('hide');
    validationMessages.classList.add('show');
    return;
  }

  // Clear validation messages if all inputs are valid
  document.getElementById("validationMessages").textContent = "";

  // Update default times and reset timer
  defaultFocusTime = newFocusTime;
  defaultShortBreakTime = newShortBreakTime;
  defaultLongBreakTime = newLongBreakTime;
  updateTimer(); // Update timer display
});

// Function to pause the timer
const pauseTimer = () => {
  paused = true;
  clearInterval(set);
  startBtn.classList.remove("hide");
  pause.classList.remove("show");
  reset.classList.remove("show");
};

// Event listener for pause button
pause.addEventListener("click", () => {
  pauseTimer(); // Pause the timer
});

// Function to start the timer
const startTimer = () => {
  reset.classList.add("show");
  pause.classList.add("show");
  startBtn.classList.add("hide");
  startBtn.classList.remove("show");

  if (paused) {
    paused = false;

    // Check if there's time left in countdown
    if (minCount > 0 || count > 0) {
      time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;

      // Start countdown interval
      set = setInterval(() => {
        count--;
        time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
        if (count === 0) {
          if (minCount !== 0) {
            minCount--;
            count = 60;
          } else {
            clearInterval(set);
          }
        }
      }, 1000);
    }
  }
};

// Event listener for start button
startBtn.addEventListener("click", () => {
  startTimer(); // Start the timer
});
