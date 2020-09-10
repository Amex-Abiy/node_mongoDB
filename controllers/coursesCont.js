const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler')
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

exports.getCourses = asyncHandler(async(req, res, next) => {
    let courses;
    if (req.params.bootcampId) {
        // needs to be casted into ObjectID
        courses = await Course.find({ bootcamp: mongoose.Types.ObjectId(req.params.bootcampId) });
    } else {
        courses = await Course.find()
            // courses = await Course.find().populate('bootcamp')
    }
    return res.status(200).json({
        status: true,
        count: courses.length,
        data: courses
    })
})

exports.getCourse = asyncHandler(async(req, res, next) => {
    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(
            new ErrorResponse(`Course with id ${req.params.id} does not exist`, 404)
        )
    }
    return res.status(200).json({
        status: true,
        count: course.length,
        data: course
    })
})

exports.addCourse = asyncHandler(async(req, res, next) => {
    // req.params.bootcampId is routed from the bootcamp router file
    req.body.bootcamp = req.params.bootcampId

    // check if bootcamp exists
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp with id ${req.params.bootcampId} does not exist`, 404)
        )
    }
    const course = await Course.create(req.body)

    return res.status(200).json({
        status: true,
        count: course.length,
        data: course
    })
})

exports.updateCourse = asyncHandler(async(req, res, next) => {
    let course = Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(`Course with id ${req.params.id} does not exist`, 404)
        )
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    return res.status(200).json({
        status: true,
        count: course.length,
        data: course
    })
})

exports.deleteCourse = asyncHandler(async(req, res, next) => {
    let course = Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(`Course with id ${req.params.id} does not exist`, 404)
        )
    }

    await Course.findByIdAndDelete(req.params.id)

    return res.status(200).json({
        status: true,
        data: {}
    })
})