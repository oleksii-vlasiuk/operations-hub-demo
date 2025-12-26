CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL
);

INSERT INTO users (username, email) VALUES ('oleksii', 'oleksii@mail.com');
INSERT INTO users (username, email) VALUES ('zhanna', 'zhanna@mail.com');
INSERT INTO users (username, email) VALUES ('ivan', 'ivan@mail.com');
INSERT INTO users (username, email) VALUES ('user', 'user@mail.com');