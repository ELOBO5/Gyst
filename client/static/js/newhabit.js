//Save habit

const token = localStorage.getItem('token');
function checkToken() {

    if (!token){
        window.location.href = "http://127.0.0.1:5503/client/index.html";
        return;
    }
}

checkToken();


function postNewHabit(e) {
    e.preventDefault();
    checkToken();

    const habit = document.querySelector('#habit-entry').value;
    const frequency = document.querySelector('#habit-frequency').value;
    const has_priority = document.querySelector('#habit-priority').checked;

    fetch('https://get-your-sht-together.herokuapp.com/habits', {
        method: 'POST',
        body: JSON.stringify({
            habit,
            frequency,
            has_priority,
            user_id: localStorage.getItem('id')
        }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': token
        }
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .then(() => window.location.href = "http://127.0.0.1:5503/client/dash.html")
        .catch(error => console.log(error, 'Error posting entry'));
};


const submitNewHabit = document.querySelector('#submitNewHabit');
submitNewHabit.addEventListener('submit', postNewHabit);
