DROP TABLE IF EXISTS habits;

CREATE TABLE habits (
    id serial PRIMARY KEY,
    habit VARCHAR(50) NOT NULL,
    frequency VARCHAR (50) NOT NULL,
    has_priority BOOLEAN NOT NULL,
    habit_count INT DEFAULT 1,
    habit_streak INT DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_counter INT DEFAULT 0,
    user_id INT NOT NULL
);
