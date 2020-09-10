const express = require('express')
const authControler = require('../controllers/authCont')

const router = express.Router();

router.post('/register', authControler.registerUser)

router.get('/login', authControler.loginUser)

module.exports = router;