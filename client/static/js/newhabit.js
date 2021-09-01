//Save habit


function postNewHabit(e) {
    e.preventDefault();
    const habit = document.querySelector('#habit-entry').value;
    const frequency = document.querySelector('#habit-frequency').value;
    const has_priority = document.querySelector('#habit-priority').value;

    fetch('https://localhost:3000/habits', {
        method: 'POST',
        body: JSON.stringify({
            habit,
            frequency,
            has_priority
            //user_id
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


const submitNewHabit = document.querySelector('#submitNewHabit');
submitNewHabit.addEventListener('submit', postNewHabit);
