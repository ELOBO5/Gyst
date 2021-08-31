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
