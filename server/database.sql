CREATE DATABASE todo;

CREATE TABLE todos(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

ALTER TABLE todos
ADD COLUMN category VARCHAR(255);

CREATE SEQUENCE todos_seq;
