TRUNCATE users, habits RESTART IDENTITY;

INSERT INTO users (username, email, password)
VALUES
('Test User 1', 'test1@email.com', 'pass'),
('Test User 2', 'test2@email.com', 'word');

INSERT INTO habits (habit, frequency, has_priority, habit_count, habit_streak, completed_counter, user_id)
VALUES
('1 first habit', 'daily', TRUE, 5, 2, 0, 1),
('1 second habit', 'weekly', FALSE, 7, 0, 0, 1),
('1 third habit', 'monthly', TRUE, 6, 0, 0, 1),
('2 first habit', 'daily', FALSE, 60, 15, 0, 2),
('2 second habit', 'monthly', TRUE, 5, 5, 0, 2);
