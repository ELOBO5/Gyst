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

getAllHabits();
