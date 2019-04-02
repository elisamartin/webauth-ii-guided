const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session'); // 1- install express-session and bring it in

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
	name: 'monkey',
	secret: 'keep it secret, keep it safe, keep it long', // don't! put it outside of source control
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false // needs to be true in production, only do any of this over https !!!!!!!!!!
	},
	httpOnly: true,
	resave: false, // don't recreate the session if nothing has changed...
	saveUninitialized: false, // we don't want to save anything... unless something changed!
	// THIS IS TO GET PERSISTANCE
	store: new SessionStore({
		knex: require('../database/dbConfig'),
		tablename: 'active_sessions',
		sidfieldname: 'sid',
		createtable: true,
		clearInterval: 1000 * 60 * 60
	})
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)); // 2- use express-session middleware

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.send("It's alive!");
});

module.exports = server;
