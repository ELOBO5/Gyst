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

async function create(req, res) {
    try {
        const newHabit = await Habit.create(req.body);
        res.status(201).json(newHabit);
    } catch (err) {
        console.error('Could not create habit');
        res.status(422).json({err});
    }
}

async function destroy(req, res) {
    try {
        const habit = await Habit.findByHabitId(req.params.id);
        await habit.destroy();
        res.status(204).end();
    } catch (err) {
        console.error('Could not delete habit');
        res.status(404).json({err});
    }
}

module.exports = {index, show, create, destroy};
