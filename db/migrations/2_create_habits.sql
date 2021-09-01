DROP TABLE IF EXISTS habits;

CREATE TABLE habits (
    id serial PRIMARY KEY,
    habit VARCHAR(50) NOT NULL,
    frequency VARCHAR (50) NOT NULL,
    has_priority BOOLEAN NOT NULL,
    created_at DATE NOT NULL,
    habit_count INT NOT NULL,
    habit_streak INT NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_counter INT NOT NULL,
    user_id INT NOT NULL
);