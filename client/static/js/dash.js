const BASE_URL = "https://get-your-sht-together.herokuapp.com/habits";
const USER_URL = "https://get-your-sht-together.herokuapp.com/users";

const token = localStorage.getItem("token");

function checkToken() {
  if (!token) {
    window.location.href = "https://gyst.vercel.app/index.html";
    return;
  }
}

let allHabits;

//habit lists

const addHabitToDocument = (habit, frequency) => {
  const habitMainContainer = document.getElementById(frequency);
  const individualContainer = document.createElement("ul");
  const habitListItem = document.createElement("li");
  const completedListItem = document.createElement("li");
  const streakListItem = document.createElement("li");
  const deleteItem = document.createElement("li");
  const checkbox = document.createElement("input");

  individualContainer.setAttribute("class", "indvHabitContainer");
  habitListItem.setAttribute("class", "habitListItem");
  completedListItem.setAttribute("class", "habitListItem");
  streakListItem.classList.add(`streakCounter${habit.id}`, "habitListItem");
  deleteItem.setAttribute("class", "habitListItem");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("class", "markAsDone");

  habitListItem.textContent = habit.habit;
  checkbox.checked = habit.completed;
  streakListItem.textContent = "🔥 " + habit.habit_streak;
  deleteItem.innerHTML = "&#128465;";

  completedListItem.appendChild(checkbox);
  individualContainer.appendChild(habitListItem);
  individualContainer.appendChild(completedListItem);
  individualContainer.appendChild(streakListItem);
  individualContainer.appendChild(deleteItem);
  habitMainContainer.appendChild(individualContainer);

  const toggleHabit = {
    id: habit.id,
    completed: !habit.completed,
    habit_streak: habit.completed ? --habit.habit_streak : ++habit.habit_streak,
    completed_counter: habit.completed
      ? --habit.completed_counter
      : ++habit.completed_counter
  };

  checkbox.addEventListener("click", () => {
    toggleCompleted(toggleHabit);
    updateCounter(toggleHabit);
  });
  deleteItem.addEventListener("click", () => deleteHabit(habit.id));
};

const updateCounter = (habit) => {
  const streakCounter = document.querySelector(`streakCounter${habit.id}`);
  streakCounter.innerHTML = habit.habit_streak;
};

// analytics dash
// need to add a habit.completed_counter to the database
const addAnalyticsToDocument = (habit) => {
  let habitStrengthPercentage;
  if (habit.completed === 0 || habit.habit_count === 0) {
    habitStrengthPercentage = 0;
  } else {
    habitStrengthPercentage =
      (habit.completed_counter / habit.habit_count) * 100;
  }

  const statsContainer = document.getElementById("stats-container");

  const analyticsListItem = document.createElement("div");
  const analyticItemName = document.createElement("p");
  const strengthDisplay = document.createElement("div");
  const strengthPercentage = document.createElement("p");
  const analyticsData = document.createElement("p");

  analyticsListItem.setAttribute("class", "analyticsListItem");
  analyticItemName.classList.add("text", "title");
  strengthDisplay.setAttribute("class", "strengthDisplay");
  strengthPercentage.classList.add("percentage", "text");
  analyticsData.classList.add("data", "text");

  analyticItemName.textContent = habit.habit;
  strengthPercentage.textContent = `${habitStrengthPercentage}%`;

  if (habit.habit_count === 1) {
    analyticsData.textContent = `You started this habit yesterday and currently have a streak of ${habit.habit_streak} day`;
  } else {
    analyticsData.textContent = `You started this habit ${habit.habit_count} days ago and currently have a streak of ${habit.habit_streak} days`;
  }

  analyticsListItem.appendChild(analyticItemName);
  analyticsListItem.appendChild(strengthDisplay);
  analyticsListItem.appendChild(strengthPercentage);
  analyticsListItem.appendChild(analyticsData);

  // color coded habit strength indicator

  let habitStrengthScale = habitStrengthPercentage / 10;

  for (let i = 1; i <= habitStrengthScale; i++) {
    const strengthBlock = document.createElement("p");
    strengthBlock.classList.add("powerblock", `block${i}`);
    strengthDisplay.appendChild(strengthBlock);
    console.log("block ", strengthBlock);
  }

  statsContainer.appendChild(analyticsListItem);
};

const getAllHabits = async () => {
  checkToken();

  const userId = localStorage.getItem("id");
  const authorization = { headers: { authorization: token } };

  try {
    const response = await fetch(`${USER_URL}/${userId}/habits`, authorization);
    const habits = await response.json();
    allHabits = habits;

    habits.forEach((habit) => {
      const frequency = habit.frequency.toLowerCase();
      addHabitToDocument(habit, frequency);
    });
  } catch (error) {
    console.error("Error getting all habits from server");
  }
};

const getAnalytics = async () => {
  checkToken();

  const userId = localStorage.getItem("id");
  const authorization = { headers: { authorization: token } };

  try {
    const response = await fetch(`${USER_URL}/${userId}/habits`, authorization);
    const habits = await response.json();
    allHabits = habits;

    habits.forEach((habit) => {
      if (habit.has_priority) {
        addAnalyticsToDocument(habit);
      }
    });
  } catch (error) {
    console.error("Error getting habit analytics from server");
  }
};

/**
 * @param {object} habit should contain `id`, `completed`, `habit_streak` and `completed_counter` keys.
 */
const toggleCompleted = async (habit) => {
  try {
    const options = {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(habit)
    };
    await fetch(`${BASE_URL}/${habit.id}/completed`, options);
  } catch (error) {
    console.error("Error updating habit in client");
  }
};

/**
 * Adjusts the properties of a habit at midnight. If a habit, is marked as completed, the streak continues, otherwise the streak goes back to zero.
 * The streak count adjusts for monthly, weekly and daily habits accordingly.
 * @param {object} habit should contain all the properties of the `Habit` model.
 */
const dailyReset = async (habit) => {
  checkToken();

  const today = new Date();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  const url = `${BASE_URL}/${habit.id}/reset`;

  const options = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", authorization: token }
  };

  try {
    if (
      time === "00:00:0" &&
      habit.habit_count % 30 === 0 &&
      habit.frequency === "monthly" &&
      !habit.completed
    ) {
      await fetch(url, {
        ...options,
        body: JSON.stringify({ habit_streak: 0 })
      });
    } else if (
      time === "00:00:0" &&
      habit.habit_count % 7 === 0 &&
      habit.frequency === "weekly" &&
      !habit.completed
    ) {
      await fetch(url, {
        ...options,
        body: JSON.stringify({ habit_streak: 0 })
      });
    } else if (
      time === "00:00:0" &&
      habit.habit_count % 30 === 0 &&
      habit.frequency === "monthly"
    ) {
      await fetch(url, {
        ...options,
        body: JSON.stringify({ habit_streak: ++habit.habit_streak })
      });
    } else if (
      time === "00:00:0" &&
      habit.habit_count % 7 === 0 &&
      habit.frequency === "weekly"
    ) {
      await fetch(url, {
        ...options,
        body: JSON.stringify({ habit_streak: ++habit.habit_streak })
      });
    } else if (time === "00:00:0" && !habit.completed) {
      await fetch(url, {
        ...options,
        body: JSON.stringify({ habit_streak: 0 })
      });
    } else if (time === "00:00:0") {
      await fetch(url, {
        ...options,
        body: JSON.stringify({ habit_streak: ++habit.habit_streak })
      });
    }
  } catch (error) {
    console.error("Error resetting habit for the day in client");
  }
};

const resetAllHabits = (habits) => {
  habits.map((habit) => dailyReset(habit));
};

const deleteHabit = async (id) => {
  checkToken();

  try {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", authorization: token }
    };

    await fetch(`${BASE_URL}/${id}`, options);
  } catch (error) {
    console.error("Error deleting habit in client");
  }
};

function logout() {
  localStorage.clear();
  window.location.href = "https://gyst.vercel.app/index.html";
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout);

getAllHabits();
getAnalytics();
setInterval(() => resetAllHabits(allHabits), 1000);
