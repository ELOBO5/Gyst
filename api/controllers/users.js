const User = require('../models/user.js');
const Habit = require('../models/habit.js');

async function index(req, res) {
    try {
        const users = await User.all;
        res.status(200).json(users);
    } catch (err) {
        console.error('Could not get Users');
        res.status(500).json({err});
    }
}

async function getHabitsForUser(req, res) {
    try {
        const habits = await Habit.findByUserId(req.params.id);
        res.status(200).json(habits);
    } catch (err) {
        console.error('Could not get Users');
        res.status(500).json({err});
    }
}

async function show(req, res) {
    try {
        const user = await User.findByEmail(req.params.email);
        res.status(200).json(user);
    } catch (err) {
        console.error('Could not find User');
        res.status(404).json({err});
    }
}

async function create(req, res) {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Could not create User');
        res.status(422).json({err});
    }
}

async function destroy(req, res) {
    try {
        const user = await User.findByEmail(req.params.email);
        await user.destroy();
        res.status(204).end();
    } catch (err) {
        console.error('Could not delete User');
        res.status(404).json({err});
    }
}

module.exports = { index, getHabitsForUser, show, create, destroy };
