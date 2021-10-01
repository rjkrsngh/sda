const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const reqLogin = require('../middlewares/authorization');

require('dotenv').config();

// use mongoose to interact with the user schema
const mongoose = require('mongoose');
const User = mongoose.model('User');

const JWT_SECRET_KEY = process.env.KEY

const handleSignupReq = async (req, res, next) => {
    console.log('signup req received with body: ', req.body);
    const { name, email, password } = req.body;
    
    if (!email || !password || !name) {
        res.status(400).json({
            error: 'all fields required'
        });
    } else {
        console.log('waiting to get user');
        User.findOne({ username: name }).then((savedUser) => {
            if (savedUser) {
                return res.status(400).json({
                    error: "user already exists"
                });
            } else {
                bcrypt.hash(password, 15).then((hashedPasswd) => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPasswd
                    });

                    // TODO: generate and send the token after signup too
                    user.save().then(user => {})
                    .catch(err => {
                        console.log('could not insert user to the db');
                    });
                });
            }
        }).catch(err => {
            console.log('error finding user!');
        });
    }
}

const handleSigninReq = (req, res, next) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({
            error: 'username or password not provided'
        });
    } else {
        User.findOne({ name: name }).then((foundUser) => {
            if (!foundUser) {
                //console.log('no such user');
                return res.status(401).json({
                    error: 'no such user'
                });
            } else {
                bcrypt.compare(password, foundUser.password).then(matched => {
                    if (matched) {
                        // On match, generate a jwt and send it to the user to avoid identity theft/impersonation attacks
                        const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET_KEY);
                        const {name, email, _id} = foundUser;

                        res.json({
                            token,
                            user: {
                                name, 
                                email,
                                _id
                            }
                        });
                    } else {
                        return res.status(400).json({
                            error: 'invalid password'
                        });
                    }
                }).catch(err => {
                    console.log('error comparing passwords');
                })
            }
        });
    }
}

router.post('/signup', handleSignupReq);
router.post('/signin', handleSigninReq);
module.exports = router;