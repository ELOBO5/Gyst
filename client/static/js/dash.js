const BASE_URL = 'http://localhost:3000/habits';

const getAllHabits = async () => {
	const response = await fetch(BASE_URL);
	const { habits } = await response.json();

	for (const habit of habits) {
		addHabitToDocument(habit, habit.frequency);
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
	const options = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(habit)
	};

	const response = await fetch(`${BASE_URL}/${id}`, options);
	const data = await response.json();

	// TODO: - Use the 'data' to adjust what's on the page, once HTML has been completed and designed.
};

getAllHabits();
