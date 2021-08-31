const BASE_URL = 'http://localhost:3000/habits';

let allHabits;

const getAllHabits = async () => {
	try {
		const response = await fetch(BASE_URL);
		const { habits } = await response.json();
		allHabits = habits;

		for (const habit of habits) {
			addHabitToDocument(habit, habit.frequency);
		}
	} catch (error) {
		console.error('Error getting all habits from server');
	}
};

const addHabitToDocument = (habit, frequency) => {
	const dailyContainer = document.getElementById(frequency);
	const listItem = document.createElement('li');
	const habitName = document.createElement('p');
	const habitStreak = document.createElement('p');
	const checkbox = document.createElement('input');

	habitName.textContent = habit.habit;
	habitStreak.textContent = habit.habit_streak;
	checkbox.setAttribute('type', 'checkbox');
	checkbox.checked = habit.completed;

	listItem.appendChild(habitName);
	listItem.appendChild(habitStreak);
	listItem.appendChild(checkbox);
	dailyContainer.appendChild(listItem);

	// TODO: - Create edit button and event listener to 'updateInfo' event
	// TODO: - Add event listener to checkbox
};

/**
 * @param {object} habit should contain `id`, `habit`, `frequency` and `has_priority` keys.
 */
const updateHabitInfo = async habit => {
	try {
		const options = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(habit)
		};

		const response = await fetch(`${BASE_URL}/${habit.id}/info`, options);
		const data = await response.json();

		// TODO: - Use the 'data' to adjust what's on the page, once HTML has been completed and designed.
	} catch (error) {
		console.error('Error updating habit in client');
	}
};

const dailyReset = async habit => {
	const today = new Date();
	const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

	const url = `${BASE_URL}/${habit.id}/reset`;

	const options = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' }
	};

	try {
		if (time === '00:00:0' && !habit.completed) {
			const response = await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: 0 })
			});
			const data = await response.json();
		} else if (time === '00:00:0') {
			const response = await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: habit.habit_streak++ })
			});
			const data = await response.json();
		}
	} catch (error) {
		console.error('Error resetting habit for the day in client');
	}
};

const deleteHabit = async id => {
	try {
		const options = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		};

		await fetch(`${BASE_URL}/${id}`, options);
	} catch (error) {
		console.error('Error deleting habit in client');
	}
};

getAllHabits();
