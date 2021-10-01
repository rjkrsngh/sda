const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const User = mongoose.model('Company');

require('dotenv').config();
JWT_SECRET_KEY = process.env.KEY;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            error: 'you must be logged in to access this resource'
        });
    } else {
        // authorization header is of the form
        // authorizatoin = "Bearer ${token}"
        // so we remove the string("Bearer ") to get the token directly
        const token = authorization.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
            if (err) {
                return res.status(401).json({
                    error: 'invalid token'
                });
            } else {
                const { _id } = payload;
                User.findById(_id).then(userDoc => {
                    if (!userDoc) {
                        return res.status(401).json({
                            message : 'you must be logged in to access this resource'
                        })
                    } else {
                        req.user = userDoc;
                        next();
                    }
                });
            }
        });
    }
}