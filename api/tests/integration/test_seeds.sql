TRUNCATE users, habits RESTART IDENTITY;

INSERT INTO users (username, email, password)
VALUES
('Test User 1', 'test1@email.com', 'pass'),
('Test User 2', 'test2@email.com', 'word');

INSERT INTO habits (habit, frequency, has_priority, created_at, habit_count, habit_streak, user_id)
VALUES
('1 first habit', 'daily', TRUE, '2021-08-20', 5, 2, 1),
('1 second habit', 'weekly', FALSE, '2021-04-22', 7, 0, 1),
('1 third habit', 'monthly', TRUE, '2020-12-15', 6, 0, 1),
('2 first habit', 'daily', FALSE, '2021-03-30', 60, 15, 2),
('2 second habit', 'monthly', TRUE, '2021-01-31', 5, 5, 2);
