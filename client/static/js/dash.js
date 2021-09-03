const BASE_URL = "https://get-your-sht-together.herokuapp.com/habits";
const USER_URL = "https://get-your-sht-together.herokuapp.com/users";

const token = localStorage.getItem("token");

function checkToken() {
	if (!token) {
		window.location.href = "http://127.0.0.1:5503/client/index.html";
		return;
	}
}

let allHabits;

//habit lists

const addHabitToDocument = (habit, frequency) => {
	const habitMainContainer = document.querySelector(`.${frequency}`);
	const individualContainer = document.createElement("ul");
	const completedListItem = document.createElement("li");
	const habitListItem = document.createElement("li");
	const habitInfoContainer = document.createElement("div");
	const habitName = document.createElement("p");
	const habitStreak = document.createElement("p");
	const deleteListItem = document.createElement("li");
	const deleteImage = document.createElement("p");

	individualContainer.classList.add("individual");
	completedListItem.classList.add("completed-item");
	habitInfoContainer.classList.add("individual-habit");
	habitName.setAttribute("class", "individual-habit-name");
	habitStreak.classList.add("individual-habit-streak");
	deleteImage.classList.add("delete-img");

	completedListItem.innerHTML = habit.completed
		? '<i class="fas fa-check-circle"></i>'
		: '<i class="far fa-circle"></i>';
	habitName.textContent = habit.habit;
	habitStreak.textContent =
		habit.habit_streak > 0
			? `${habit.habit_streak}-day streak`
			: "Complete today to start a new streak";

	deleteImage.innerHTML = '<i class="far fa-trash-alt"></i>';

	habitInfoContainer.appendChild(habitName);
	habitInfoContainer.appendChild(habitStreak);
	habitListItem.appendChild(habitInfoContainer);
	deleteListItem.appendChild(deleteImage);
	individualContainer.appendChild(completedListItem);
	individualContainer.appendChild(habitListItem);
	individualContainer.appendChild(deleteListItem);
	habitMainContainer.appendChild(individualContainer);

	const toggleHabit = {
		id: habit.id,
		completed: !habit.completed,
		habit_streak: habit.completed ? --habit.habit_streak : ++habit.habit_streak,
		completed_counter: habit.completed
			? --habit.completed_counter
			: ++habit.completed_counter
	};

	completedListItem.addEventListener("click", () => toggleCompleted(toggleHabit));
	deleteListItem.addEventListener("click", () => deleteHabit(habit.id));
};

if (document.querySelector(".completed-item")) {
	document.querySelector(".completed-item");
}

// analytics dash
// need to add a habit.completed_counter to the database
const addAnalyticsToDocument = habit => {
	let habitStrengthPercentage;
	if (habit.completed === 0 || habit.habit_count === 0) {
		habitStrengthPercentage = 0;
	} else {
		habitStrengthPercentage = ((habit.completed_counter / habit.habit_count) * 100).toFixed(0);
	}

	const statsContainer = document.getElementById("stats-container");

	const analyticsListItem = document.createElement("div");
	const analyticItemName = document.createElement("h3");
	const analyticsData = document.createElement("p");
	const strengthDisplay = document.createElement("div");

	analyticsListItem.setAttribute("class", "analyticsListItem");
	analyticsData.classList.add("data", "text");
	strengthDisplay.setAttribute("class", "strengthDisplay");

	analyticItemName.textContent = habit.habit;

	if (habit.habit_count === 1 && habit.habit.completed) {
		analyticsData.textContent = `You started today and are currently on a ${habit.habit_streak}-day streak with a ${habitStrengthPercentage}% completion rate.`;
	} else if (habit.habit_count === 1 && !habit.habit.completed) {
		analyticsData.textContent = `You started today, so you haven't got a streak yet.`;
	} else {
		analyticsData.textContent = `You started ${habit.habit_count} days ago and are currently on a ${habit.habit_streak}-day streak with a ${habitStrengthPercentage}% completion rate.`;
	}

	let habitStrengthScale = habitStrengthPercentage / 10;

	for (let i = 1; i <= habitStrengthScale; i++) {
		const strengthBlock = document.createElement("p");
		strengthBlock.classList.add("powerblock", `block${i}`);
		strengthDisplay.appendChild(strengthBlock);
	}

	analyticsListItem.appendChild(analyticItemName);
	analyticsListItem.appendChild(analyticsData);
	analyticsListItem.appendChild(strengthDisplay);
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

		habits.forEach(habit => {
			const frequency = habit.frequency.toLowerCase();
			addHabitToDocument(habit, frequency);
		});

		const daily = habits.some(habit => habit.frequency === "Daily" || habit.frequency === "daily"  );
		const weekly = habits.some(habit => habit.frequency === "Weekly" || habit.frequency === "weekly");
		const monthly = habits.some(habit => habit.frequency === "Monthly" || habit.frequency === "monthly");

		if (!daily) missingHabits("daily");
		if (!weekly) missingHabits("weekly");
		if (!monthly) missingHabits("monthly");
	} catch (error) {
		console.error("Error getting all habits from server");
	}
};

const missingHabits = frequency => {
	const addButton = document.createElement("a");
	addButton.classList.add("add-habits");
	addButton.textContent = `Add a new ${frequency} habit`;
	addButton.href = "http://127.0.0.1:5503/client/newhabit.html";
	document.querySelector(`.habitlist.${frequency}`).appendChild(addButton);
};

const getAnalytics = async () => {
	checkToken();

	const userId = localStorage.getItem("id");
	const authorization = { headers: { authorization: token } };

	try {
		const response = await fetch(`${USER_URL}/${userId}/habits`, authorization);
		const habits = await response.json();
		allHabits = habits;

		habits.forEach(habit => {
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
const toggleCompleted = async habit => {
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
const dailyReset = async habit => {
	checkToken();

	const today = new Date();
	const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	const url = `${BASE_URL}/${habit.id}/reset`;

	const options = {
		method: "PATCH",
		headers: { "Content-Type": "application/json", authorization: token }
	};

	try {
		if (
			time === "0:0:0" &&
			habit.habit_count % 30 === 0 &&
			habit.frequency === "monthly" &&
			!habit.completed
		) {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: 0 })
			});
		} else if (
			time === "0:0:0" &&
			habit.habit_count % 7 === 0 &&
			habit.frequency === "weekly" &&
			!habit.completed
		) {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: 0 })
			});
		} else if (
			time === "0:0:0" &&
			habit.habit_count % 30 === 0 &&
			habit.frequency === "monthly"
		) {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: ++habit.habit_streak })
			});
		} else if (
			time === "0:0:0" &&
			habit.habit_count % 7 === 0 &&
			habit.frequency === "weekly"
		) {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: ++habit.habit_streak })
			});
		} else if (time === "0:0:0" && !habit.completed) {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: 0 })
			});
		} else if (time === "0:0:0") {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: ++habit.habit_streak })
			});
		}
	} catch (error) {
		console.error("Error resetting habit for the day in client");
	}
};

const resetAllHabits = habits => {
	habits.map(habit => dailyReset(habit));
};

const deleteHabit = async id => {
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
	window.location.href = "http://127.0.0.1:5503/client/index.html";
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout);

getAllHabits();
getAnalytics();
setInterval(() => resetAllHabits(allHabits), 1000);

module.exports = { getAllHabits, logout };
