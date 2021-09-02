const usersController = require('../../../controllers/users.js');
const User = require('../../../models/user.js');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();
const mockStatus = jest.fn(() => ({send: mockSend, json: mockJson, end: mockEnd}));
const mockRes = {status: mockStatus};
