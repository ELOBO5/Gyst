const Habit = require('../models/habit.js');

async function index(req, res) {
    try {
        const habits = await Habit.all;
        res.status(200).json({habits});
    } catch (err) {
        console.log('Could not get habits');
        res.status(500).json({err});
    }
}
