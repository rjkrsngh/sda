const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
JWT_SECRET_KEY = process.env.KEY;

// use mongoose to interact with the user schema
const mongoose = require('mongoose');
const User = mongoose.model('User');

const handleCreateUserReq = (req, res, next) => {
	console.log('create user req received -> ', req.body);

	const {name, company, password, salary,
			country, address, phone_number, role} = req.body;

	if(!name || !company || !password || !country || !phone_number || !role){
		res.status(400).json({
			error : "important fields missing"
		});
		return;
	}

	bcrypt.hash(password ,8).then((hashedPasswd) => {
		const user = new User({
			name,
			company,
			password : hashedPasswd,
			salary,
			country,
			address,
			phone_number,
			role
		});

		console.log('user object created');
		user.save().then(user=>{
			res.status(201).json({
				message : "user created"
			});
		})
		.catch(err=>{
			console.log(`could not create the user due to error: ${err}`);
		});
	});
}

router.post('/user/create', handleCreateUserReq);
module.exports = router;