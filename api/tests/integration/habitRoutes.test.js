describe('Habit Endpoints', () => {
    let api;
    
    beforeAll(() => {
        api = server.listen(5000, () => console.log('Test server running on port 5000'));
    })
    
    beforeEach(async () => {
        await resetTestDB();
    })
    
    afterAll(done => {
        console.log('Stopping test server');
        api.close(done);
    })

    test('returns list of all habits', async () => {
        const res = await request(api).get('/habits');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(5);
    })

    test('returns a particular habit by id', async () => {
        const res = await request(api).get('/habits/3');

        expect(res.statusCode).toEqual(200);

        expect(res.body.id).toEqual(3);
        expect(res.body.habit).toEqual('1 third habit');
        expect(res.body.frequency).toEqual('monthly');
        expect(res.body.has_priority).toEqual(true);

        // DATE type in sql contains hours, mins and seconds in the string as well
        expect(res.body.created_at).toContain('2020-12-15');

        expect(res.body.habit_count).toEqual(6);
        expect(res.body.habit_streak).toEqual(0);
        expect(res.body.completed).toEqual(false);
        expect(res.body.user_id).toEqual(1);
    })

    test('responds to non existent paths with 404', async () => {
        const res = await request(api).get('/asdf');
        
        expect(res.statusCode).toEqual(404);
    })

    test('creates a new habit', async () => {
        const habitData = {
            habit: 'create test habit',
            frequency: 'weekly',
            has_priority: false,
            user_id: 44
        }

        const res = await request(api)
            .post('/habits')
            .send(habitData)
        
        expect(res.statusCode).toEqual(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('created_at');
        expect(res.body.habit).toEqual('create test habit');
        expect(res.body.frequency).toEqual('weekly');
        expect(res.body.has_priority).toEqual(false);
        expect(res.body.habit_count).toEqual(0);
        expect(res.body.habit_streak).toEqual(0);
        expect(res.body.completed).toEqual(false);
        expect(res.body.user_id).toEqual(44);

        const newHabitRes = await request(api).get(`/habits/${res.body.id}`);
        expect(newHabitRes.statusCode).toEqual(200);
        expect(newHabitRes.body).toBeTruthy();
        expect(newHabitRes.body.habit).toEqual('create test habit');
    })
})
