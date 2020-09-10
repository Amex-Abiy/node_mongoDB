const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');

exports.registerUser = asyncHandler(async(req, res, next) => {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    return res.status(200).cookie('token', token, cookieOptions).json({
        status: true,
        token
    })
})

exports.loginUser = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    console.log(user)
    if (!user) {
        return next(new ErrorResponse(`User with email '${email}' does not exist`, 200))
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    return res.status(200).cookie('token', token, cookieOptions).json({
        status: true,
        token
    })

})