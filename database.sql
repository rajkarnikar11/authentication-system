CREATE DATABASE portfolio;

CREATE TABLE users(
    user_id UUID PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);