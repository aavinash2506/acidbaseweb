const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController.js');

router.get('/', questionController.getQuestions);
//router.get('/studentscores', )

router.post('/add', questionController.addQuestion);

router.put('/edit/:questionId', questionController.editQuestion);

router.delete('/delete/:questionId', questionController.deleteQuestion);

module.exports = router;
