# Web Software Development Project 2020

Web service for reporting daily behaviour and viewing progress.
The service can be found online at https://wsd-ropsutius.herokuapp.com/

## Database

You can create the Postgres database locally using the following commands

CREATE TABLE users (
email VARCHAR(255) PRIMARY KEY,
pwd VARCHAR(60) NOT NULL
);

CREATE TABLE morning_reports (
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
slp_dur NUMERIC NOT NULL,
slp_qlty SMALLINT NOT NULL,
mood SMALLINT NOT NULL,
email VARCHAR(255) NOT NULL,
FOREIGN KEY (email) REFERENCES users (email)
);

CREATE TABLE evening_reports (
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
time_sport NUMERIC NOT NULL,
time_study NUMERIC NOT NULL,
eating SMALLINT NOT NULL,
mood SMALLINT NOT NULL,
email VARCHAR(255) NOT NULL,
FOREIGN KEY (email) REFERENCES users (email)
);

## Running

You can run the service locally by first setting the credentials of the local database in the .env file.
After that the application can be started from the root folder using

deno run --unstable --allow-all app.js

## Testing

Tests can be run on the application from the root folder using

deno test --allow-all
