const BASE_URL = 'http://localhost:3000/habits';

const getAllHabits = async () => {
	try {
		const response = await fetch(BASE_URL);
		const { habits } = await response.json();

		for (const habit of habits) {
			addHabitToDocument(habit, habit.frequency);
		}
	} catch (error) {
		console.log('Error getting all habits from server ', error);
	}
};

const addHabitToDocument = (habit, frequency) => {
	const dailyContainer = document.getElementById(frequency);
	const listItem = document.createElement('li');
	const habitName = document.createElement('p');

	habitName.textContent = habit.habit;
	listItem.appendChild(habitName);
	dailyContainer.appendChild(listItem);
};

/**
 * @param {object} habit should contain `habit`, `frequency`, `has_priority`, `habit_count` and `habit_streak` keys.
 */
const updateHabit = async (id, habit) => {
	try {
		const options = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(habit)
		};

		const response = await fetch(`${BASE_URL}/${id}`, options);
		const data = await response.json();

		// TODO: - Use the 'data' to adjust what's on the page, once HTML has been completed and designed.
	} catch (error) {
		console.log('Error updating habit in client ', error);
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
		console.log('Error deleting habit in client ', error);
	}
};

getAllHabits();
