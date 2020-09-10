const jwtToken = require('jsonwebtoken')
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.isAuth = (req, res, next) => {
    let token;
    if (req.headers.authorization || req.headers.authorization.startsWith('Bearer')) {
        token = req.authorization.split(' ')[1];

        if (!token) {
            return next(new ErrorResponse('Token is not set, authentication failed!', 401))
        }

        try {
            const userId = jwtToken.verify(token, process.env.JWT_SECRET_KEY)
            req.user = await User.findById(userId);
            if (!req.user) {
                return next(new ErrorResponse('Error identifying token!', 401))
            }
            next();
        } catch (error) {
            return next(new ErrorResponse('Error verifying token!', 401))
        }
    }
}

exports.authorizedFor = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse('You are not authorized for this action', 401))
        }
        next()
    }
}