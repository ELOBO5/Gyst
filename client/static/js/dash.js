const BASE_URL = 'http://localhost:3000/habits';

let allHabits;

const addHabitToDocument = (habit, frequency) => {
	const habitMainContainer = document.getElementById(frequency);
	const individualContainer = document.createElement('ul');
	const habitListItem = document.createElement('li');
	const completedListItem = document.createElement('li');
	const streakListItem = document.createElement('li');
	const checkbox = document.createElement('input');

	individualContainer.setAttribute('class', 'indvHabitContainer');
	habitListItem.setAttribute('class', 'habitListItem');
	completedListItem.setAttribute('class', 'habitListItem');
	streakListItem.setAttribute('class', 'habitListItem');
	streakListItem.setAttribute('class', `streakCounter${habit.id}`);
	checkbox.setAttribute('type', 'checkbox');
	checkbox.setAttribute('class', 'markAsDone');

	habitListItem.textContent = habit.habit;
	checkbox.checked = habit.completed;
	streakListItem.textContent = habit.habit_streak;

	completedListItem.appendChild(checkbox);
	individualContainer.appendChild(habitListItem);
	individualContainer.appendChild(completedListItem);
	individualContainer.appendChild(streakListItem);
	habitMainContainer.appendChild(individualContainer);

	// TODO: - Create edit button and event listener to 'updateInfo' event
	// TODO: - Add event listener to checkbox
	const toggleHabit = {
		id: habit.id,
		completed: !habit.completed,
		habit_streak:  habit.completed ? --habit.habit_streak : ++habit.habit_streak
	};

	checkbox.addEventListener('click', () => toggleCompleted(toggleHabit));
};

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

/**
 * @param {object} habit should contain `id`, `habit`, `frequency` and `has_priority` keys.
 */
const updateHabitInfo = async habit => {
	try {
		const options = {
			method: 'PATCH',
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

/**
 * @param {object} habit should contain `id`, `completed` and  `habit_streak` keys.
 */
const toggleCompleted = async habit => {
	try {
		const options = {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(habit)
		};

		 const response = await fetch(`${BASE_URL}/${habit.id}/completed`, options);
		const data = await response.json();

		// TODO: - BELOW
		// const streakCounter = document.querySelector(`.streakCounter${habit.id}`);
		// streakCounter.textContent = data.habit_streak;
	} catch (error) {
		console.error('Error updating habit in client');
	}
};

const dailyReset = async habit => {
	const today = new Date();
	const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

	const url = `${BASE_URL}/${habit.id}/reset`;

	const options = {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' }
	};

	try {
		if (time === '00:00:0' && habit.habit_count % 30 === 0 && habit.frequency === 'monthly' && !habit.completed) {
			await fetch(url, { 
				...options,
				body: JSON.stringify({ habit_streak: 0 })
			});
		} else if (time === '00:00:0' && habit.habit_count % 7 === 0 && habit.frequency === 'weekly' && !habit.completed) {
			await fetch(url, { 
				...options,
				body: JSON.stringify({ habit_streak: 0 })
			});
		} else if (time === '00:00:0' && habit.habit_count % 30 === 0 && habit.frequency === 'monthly') {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: ++habit.habit_streak })
			});
		} else if (time === '00:00:0' && habit.habit_count % 7 === 0 && habit.frequency === 'weekly') {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: ++habit.habit_streak })
			});
		} else if (time === '00:00:0' && !habit.completed) {
			await fetch(url, { 
				...options,
				body: JSON.stringify({ habit_streak: 0 })
			});
		} else if (time === '00:00:0') {
			await fetch(url, {
				...options,
				body: JSON.stringify({ habit_streak: ++habit.habit_streak })
			});
		}
	} catch (error) {
		console.error('Error resetting habit for the day in client');
	}
};

const resetAllHabits = habits => {
	habits.map(habit => dailyReset(habit));
}

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
setInterval(() =>resetAllHabits(allHabits), 1000);