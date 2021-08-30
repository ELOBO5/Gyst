const Habit = require('../models/habit.js');

async function index(req, res) {
    try {
        const habits = await Habit.all;
        res.status(200).json({habits});
    } catch (err) {
        console.error('Could not get habits');
        res.status(500).json({err});
    }
}

async function show(req, res) {
    try {
        const habit = await Habit.findByHabitId(req.params.id);
        res.status(200).json(habit);
    } catch (err) {
        console.error('Could not find habit');
        res.status(404).json({err});
    }
}
