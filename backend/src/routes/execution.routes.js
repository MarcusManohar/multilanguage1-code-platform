const express = require('express');
const router = express.Router();
const executionController = require('../controllers/execution.controller');

/**
 * @route   POST /api/execution/run
 * @desc    Submit code for execution
 * @access  Public
 */
router.post('/run', executionController.runCode);

module.exports = router;
