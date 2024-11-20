const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentsController.js');

router.get('/studentscores', studentController.getStudentsScores )

module.exports = router;