CREATE DATABASE epytodo;

USE epytodo;

CREATE TABLE user
(
    id int primary key auto_increment not null,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    firstname varchar(255) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todo
(
    id int primary key auto_increment not null,
    title varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_time DATETIME NOT NULL,
    status varchar(255) DEFAULT 'not started' NOT NULL,
    user_id int UNSIGNED NOT NULL
);
