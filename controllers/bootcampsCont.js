const slugify = require('slugify')
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler')
const Bootcamp = require('../models/Bootcamp');
const paginationHandler = require('../utils/pagination');

exports.getAllBootcamps = asyncHandler(async(req, res, next) => {
    // keep a copy so we dont change the original
    let requestQuery = {...req.query }

    const removeFields = ['sort', 'page', 'limit'];
    removeFields.forEach((params) => { delete req.query[params] })

    // the 'gt|gte|lt|lte|in' query params need '$' sign at the start so we need to add that
    let queryString = JSON.stringify(req.query).replace(/\b(gt|gte|lt|lte|in)\b/g, value => `$${value}`);
    queryString = JSON.parse(queryString)

    //  PAGINATION
    const { pagination, skip, limit } = await paginationHandler(requestQuery, Bootcamp);

    const bootcamps = await Bootcamp.find(queryString).sort(requestQuery.sort || null).skip(skip).limit(limit);
    if (!bootcamps) {
        return next(new ErrorResponse('Bootcamps not found', 404))
    }
    return res.status(200).json({
        status: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps
    })
})

exports.getBootcampById = asyncHandler(async(req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404))
    }
    return res.status(200).json({
        status: true,
        data: bootcamp
    })

})

exports.createNewBootcamp = asyncHandler(async(req, res, next) => {
    const slug = slugify(req.body.name, { lower: true });
    req.body.slug = slug;
    const bootcamp = await Bootcamp.create(req.body);
    return res.status(201).json({
        status: true,
        data: bootcamp
    })


})

exports.updateBootcamp = asyncHandler(async(req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404))
    }
    return res.status(201).json({
        status: true,
        data: bootcamp
    })

})

exports.deleteBootcamp = asyncHandler(async(req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404))
    }
    bootcamp.remove()
    return res.status(200).json({
        status: true,
        data: {}
    })

})

exports.uploadPhoto = asyncHandler(async(req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404))
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400))
    }

    const file = req.files.photo;
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }
    if (!file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`File cant exceed 1MB of size`, 400))
    }

    const fileName = `photo_${req.params.id}.${Date.now()}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem uploading image`, 500))
        }
    })
    await Bootcamp.findById(req.params.id, { photo: fileName });

    return res.status(200).json({
        status: true,
        data: { photo: fileName }
    })
})