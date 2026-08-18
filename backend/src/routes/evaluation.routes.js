const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluation.controller');

/**
 * @route   POST /api/evaluation/run
 * @desc    Submit code and test cases for evaluation
 * @access  Public
 */
router.post('/run', evaluationController.runEvaluation);

module.exports = router;
