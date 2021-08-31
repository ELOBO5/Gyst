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

async function updateInfo(req, res) {
	try {
		const habit = await Habit.findByHabitId(req.params.id);
		const updatedHabit = await habit.updateInfo(req.body);
		res.status(200).json(updatedHabit);
	} catch (error) {
        console.error('Could not update habit');
		res.status(404).json({ err });
	}
}

async function toggleCompleted(req, res) {
    try {
        const habit = await Habit.findByHabitId(req.params.id);
        const updatedHabit = await habit.toggleCompleted(req.body)
        res.status(200).json(updatedHabit);
    } catch (error) {
        console.error('Could not toggle habit completed');
        res.status(404).json({ error });
    }
}

async function dailyReset(req, res) {
    try {
        const habit = await Habit.findByHabitId(req.params.id);
        const updatedHabit = await habit.dailyReset(req.body)
        res.status(200).json(updatedHabit);
    } catch (error) {
        console.error('Could not reset habit for the day');
        res.status(404).json({ error });
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

module.exports = { index, show, create, updateInfo, toggleCompleted, dailyReset, destroy };
