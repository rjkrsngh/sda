const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// use this middleware if a resource is to be accessed only by users who are logged in
const reqLogin = require('../middlewares/authorization');

require('dotenv').config();

JWT_SECRET_KEY = process.env.KEY;

// use mongoose to interact with the user schema
const mongoose = require('mongoose');
const User = mongoose.model('Company');

const handleCreateCompanyReq = (req, res, next) => {
	console.log('Entered handleCreateCompanyReq');
	var info = JSON.parse(req.body);
	console.log('create company req received with body: ', info);

	res.status(200).json({
		"message" : "req received"
	});
}

router.post('/company/create', handleCreateCompanyReq);
module.exports = router;