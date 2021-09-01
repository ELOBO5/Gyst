const BASE_URL = "http://localhost:3000/habits";

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
  streakListItem.setAttribute("class", "habitListItem");
  streakListItem.setAttribute("class", `streakCounter${habit.id}`);
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
    habit_streak: habit.completed ? --habit.habit_streak : ++habit.habit_streak
  };

  checkbox.addEventListener("click", () => toggleCompleted(toggleHabit));
  deleteItem.addEventListener("click", () => deleteHabit(habit.id));
};

// analytics dash
// need to add a habit.completed_counter to the database
const addAnalyticsToDocument = (habit) => {
  let habitStrengthPercentage =
    (habit.completed_counter / habit.habit_counter) * 100;

  const statsContainer = document.getElementById("stats-container");

  const analyticsListItem = document.createElement("div");
  const analyticItemName = document.createElement("p");
  const strengthDisplay = document.createElement("div");
  const strengthPercentage = document.createElement("p");
  const analyticsData = document.createElement("p");

  analyticsListItem.setAttribute("class", "analyticsListItem");
  analyticItemName.setAttribute("class", "text title");
  strengthDisplay.setAttribute("class", "strengthDisplay");
  strengthPercentage.setAttribute("class", "percentage text");
  analyticsData.setAttribute("class", "data text");

  analyticItemName.textContent = habit.habit;
  strengthPercentage.textContent = habitStrengthPercentage;

  if (habit.habit_counter === 1) {
    analyticsData.textContent = `${habit.habit} - You started this habit yesterday and currently have a streak of ${habit.streak_counter} day`;
  } else {
    analyticsData.textContent = `${habit.habit} - You started this habit ${habit.habit_counter} days ago and currently have a streak of ${habit.streak_counter} days`;
  }

  analyticsListItem.appendChild(analyticsItemName);
  analyticsListItem.appendChild(strengthDisplay);
  analyticsListItem.appendChild(strengthPercentage);
  analyticsListItem.appendChild(analyticsData);

  // color coded habit strength indicator

  let habitStrengthScale = habitStrengthPercentage / 10;
  const strengthDisplay = document.querySelector(".strengthDisplay");

  for (let i = 0; i < habitStrengthScale; i++) {
    const strengthBlock = document.createElement("p");
    strengthBlock.setAtrribute("class", `powerblock block${x}`);

    strengthDisplay.appendChild(strengthBlock);
  }
  statsContainer.appendChild(analyticsListItem);
};

////

const getAllHabits = async () => {
  try {
    const response = await fetch(BASE_URL);
    const { habits } = await response.json();
    allHabits = habits;

    for (const habit of habits) {
      addHabitToDocument(habit, habit.frequency);
    }
  } catch (error) {
    console.error("Error getting all habits from server");
  }
};

/**
 * @param {object} habit should contain `id`, `completed` and  `habit_streak` keys.
 */
const toggleCompleted = async (habit) => {
  try {
    const options = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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
  const today = new Date();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  const url = `${BASE_URL}/${habit.id}/reset`;

  const options = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" }
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
  try {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    };

    await fetch(`${BASE_URL}/${id}`, options);
  } catch (error) {
    console.error("Error deleting habit in client");
  }
};

getAllHabits();
setInterval(() => resetAllHabits(allHabits), 1000);
