const express = require('express')
const bootcampsControler = require('../controllers/bootcampsCont')

const courseRouter = require('./course')

const router = express.Router()

// if this route is hit, transfer to course route file
router.use('/:bootcampId/courses', courseRouter)

router.get('/', bootcampsControler.getAllBootcamps)

router.get('/:id', bootcampsControler.getBootcampById)

router.post('', bootcampsControler.createNewBootcamp)

router.put('/:id', bootcampsControler.updateBootcamp)

router.delete('/:id', bootcampsControler.deleteBootcamp)

router.post('/:id/photo', bootcampsControler.uploadPhoto)


module.exports = router;