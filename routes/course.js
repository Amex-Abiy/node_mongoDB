const express = require('express')
const coursesControler = require('../controllers/coursesCont')

const router = express.Router({ mergeParams: true })

router.get('/', coursesControler.getCourses)

router.post('/', coursesControler.addCourse)

// get course by id
router.get('/:id', coursesControler.getCourse)

router.put('/:id', coursesControler.updateCourse)

router.delete('/:id', coursesControler.deleteCourse)

module.exports = router;