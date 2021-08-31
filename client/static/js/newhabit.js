//Save habit


// Create habit on dashboard


const postHabit = event => {
    event.preventDefault();
    const habitEntry = document.querySelector('#habit-entry').value;
    fetch('https://localhost:3000/habits', {
        method: 'POST',
        body: JSON.stringify({
            message: habitEntry,
        }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error, 'Error posting entry'));
};



function createPost(data) {
    const indvHabitContainer = document.createElement('ul');
    const habit = document.createElement('li');
    const buttonplaceholder = document.createElement('li')
    const markAsDone = document.createElement('button')
    const streakCounter = document.createElement('li')

    indvHabitContainer.setAttribute('class', 'habitContainer');
    habit.setAttribute('class', 'habitListItem habit');
    buttonplaceholder.setAttribute('class', 'habitListItem buttonplaceholder')
    markAsDone.setAttributes('class', 'markAsDoneButton's)
    streakCounter.setAttribute('class', 'habitListItem streakCounter')

    habit.textContent = data.habitEntry;
    button.value = 
    indvHabitContainer.style.outline = 'transparent';

    indvHabitContainer.appendChild(habit);
    indvHabitContainer.appendChild(buttonplaceholder);
    buttonplaceholder.appendChild(markAsDone);
    indvHabitContainer.appendChild(streakCounter);

    //use a switch statement for the different frequencies? 
    habitListContainer = document.querySelector('#dailyContainer')
    habitListContainer.appendChild(indvHabitContainer);

}



//disable priority if > 3