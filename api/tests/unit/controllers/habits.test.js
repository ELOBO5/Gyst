const habitsController = require('../../../controllers/habits.js');
const Habit = require('../../../models/habit.js');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({send: mockSend, json: mockJson}));
const mockRes = {status: mockStatus};
