const habitsController = require('../../../controllers/habits.js');
const Habit = require('../../../models/habit.js');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({send: mockSend, json: mockJson}));
const mockRes = {status: mockStatus};

describe('Habits Controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('index controller', () => {
        test('returns all habits with a 200 status code', async () => {
            jest.spyOn(Habit, 'all', 'get')
                .mockResolvedValueOnce(['habit1', 'habit2']);

            await habitsController.index(null, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['habit1', 'habit2']);
        })

        test('returns error with a 500 status code', async () => {
            try {
                jest.spyOn(Habit, 'all', 'get').mockRejectedValueOnce('index error test');
                await habitsController.index(null, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'index error test'}));
        })
    })

    describe('show controller', () => {
        test('returns a habit with a 200 status code', async () => {
            const testHabitData = {
                id: 554, habit: 'Sleep', frequency: 'daily', has_priority: true, created_at: '2020-04-22',
                habit_count: 0, habit_streak: 0, completed: false, user_id: 6
            }
            jest.spyOn(Habit, 'findByHabitId')
                .mockResolvedValueOnce(new Habit(testHabitData));
            const mockReq = { params: {id: 554} };

            await habitsController.show(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Habit(testHabitData));
        })

        test('returns error with a 404 status code', async () => {
            const mockReq = { params: {id: 554} };

            try {
                jest.spyOn(Habit, 'findByHabitId').mockRejectedValueOnce('show error test');
                await habitsController.show(mockReq, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'show error test'}));
        })
    })

    describe('create controller', () => {
        test('returns a new habit with a 201 status code', async () => {
            const newHabitData = {
                id: 555, habit: 'Exercise', frequency: 'weekly', has_priority: true, created_at: '2020-03-12',
                habit_count: 0, habit_streak: 0, completed: false, user_id: 8
            }
            jest.spyOn(Habit, 'create')
                .mockResolvedValueOnce(new Habit(newHabitData));
            const mockReq = {body: newHabitData};

            await habitsController.create(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(new Habit(newHabitData));
        })

        test('returns error with a 422 status code', async () => {
            const newHabitData = {
                id: 555, habit: 'Exercise', frequency: 'weekly', has_priority: true, created_at: '2020-03-12',
                habit_count: 0, habit_streak: 0, completed: false, user_id: 8
            }
            const mockReq = {body: newHabitData}

            try {
                jest.spyOn(Habit, 'create').mockRejectedValueOnce('create error test');
                await habitsController.create(mockReq, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(422);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'create error test'}));
        })
    })

    describe('updateInfo controller', () => {
        test('returns updated habit with a 200 status code', async () => {
            const habitData = {id: 159, habit: 'Exercise', frequency: 'weekly', has_priority: false, created_at: '2020-09-25', habit_count: 0, habit_streak: 0, completed: false, user_id: 59};
            const updates = {habit: 'Sleep', frequency: 'daily', has_priority: false};
            let updatedHabitData = habitData;
            updatedHabitData.habit = updates.habit;
            updatedHabitData.frequency = updates.frequency;
            updatedHabitData.has_priority = updates.has_priority;
            jest.spyOn(Habit, 'findByHabitId')
                .mockResolvedValueOnce(new Habit(habitData));
            jest.spyOn(Habit.prototype, 'updateInfo')
                .mockResolvedValueOnce(new Habit(updatedHabitData));
            const mockReq = { body: habitData, params: {id: 159} };

            await habitsController.updateInfo(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Habit(updatedHabitData));
        })

        test('returns error with a 404 status code', async () => {
            const habitData = {id: 159, habit: 'Exercise', frequency: 'weekly', has_priority: false, created_at: '2020-09-25', habit_count: 0, habit_streak: 0, completed: false, user_id: 59};
            const updates = {habit: 'Sleep', frequency: 'daily', has_priority: false};
            let updatedHabitData = habitData;
            updatedHabitData.habit = updates.habit;
            updatedHabitData.frequency = updates.frequency;
            updatedHabitData.has_priority = updates.has_priority;
            const mockReq = { body: habitData, params: {id: 159} };

            try {
                jest.spyOn(Habit, 'findByHabitId')
                    .mockResolvedValueOnce(new Habit(habitData));
                jest.spyOn(Habit.prototype, 'updateInfo')
                    .mockRejectedValueOnce('updateInfo error test');
                await habitsController.updateInfo(mockReq, mockRes);
            } catch (err) {
                
            }

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'updateInfo error test'}));
        })
    })

    describe('toggleCompleted controller', () => {
        test('returns updated habit with a 200 status code', async () => {
            const habitData = {id: 169, habit: 'Exercise a little', frequency: 'daily', has_priority: true, created_at: '2020-08-20', habit_count: 0, habit_streak: 0, completed: false, user_id: 499};
            const updates = {completed: true, habit_streak: 1};
            let updatedHabitData = habitData;
            updatedHabitData.completed = updates.completed;
            updatedHabitData.habit_streak = updates.habit_streak;
            jest.spyOn(Habit, 'findByHabitId')
                .mockResolvedValueOnce(new Habit(habitData));
            jest.spyOn(Habit.prototype, 'toggleCompleted')
                .mockResolvedValueOnce(new Habit(updatedHabitData));
            const mockReq = { body: habitData, params: {id: 169} };

            await habitsController.toggleCompleted(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Habit(updatedHabitData));
        })

        test('returns error with a 404 status code', async () => {
            const habitData = {id: 169, habit: 'Exercise a little', frequency: 'daily', has_priority: true, created_at: '2020-08-20', habit_count: 0, habit_streak: 0, completed: false, user_id: 499};
            const updates = {completed: true, habit_streak: 1};
            let updatedHabitData = habitData;
            updatedHabitData.completed = updates.completed;
            updatedHabitData.habit_streak = updates.habit_streak;
            const mockReq = { body: habitData, params: {id: 169} };

            try {
                jest.spyOn(Habit, 'findByHabitId')
                    .mockResolvedValueOnce(new Habit(habitData));
                jest.spyOn(Habit.prototype, 'toggleCompleted')
                    .mockRejectedValueOnce('toggleCompleted error test');
                await habitsController.toggleCompleted(mockReq, mockRes);
            } catch (err) {
                
            }

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'toggleCompleted error test'}));
        })
    })
})
