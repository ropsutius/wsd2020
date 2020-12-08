# Web Software Development Project 2020

Web service for reporting daily behaviour and viewing progress.

## Database

You can create the Postgres database using the following commands

CREATE TABLE users (
email VARCHAR(255) PRIMARY KEY,
pwd VARCHAR(60) NOT NULL
);

CREATE TABLE morning_reports (
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
slp_dur DECIMAL(2) NOT NULL,
slp_qlty SMALLINT NOT NULL,
mood SMALLINT NOT NULL,
email VARCHAR(255) NOT NULL,
FOREIGN KEY (email) REFERENCES users (email)
);

CREATE TABLE evening_reports (
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
time_sport DECIMAL(2) NOT NULL,
time_study DECIMAL(2) NOT NULL,
eating SMALLINT NOT NULL,
mood SMALLINT NOT NULL,
email VARCHAR(255) NOT NULL,
FOREIGN KEY (email) REFERENCES users (email)
);

## Running

Start the server by navigating to the correct directory and typing

`$ node server.js`

You can see the site in your browser at [127.0.0.1:3000](http://127.0.0.1:3000/)

Additionally you can use npm (installed together with Node.js) to install nodemon:

`$ npm i -g nodemon`

Nodemon can be used to Start the server, but instead of having to restart the server after every change, nodemon automatically restarts it.  
With nodemon the server is started by typing:

`$ nodemon server.js`

### npm module dependencies

Express
ExpressJS
PostGres
Body Parser
