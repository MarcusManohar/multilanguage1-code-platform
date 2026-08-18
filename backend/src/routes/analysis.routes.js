const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');

/**
 * @route   POST /api/analysis/run
 * @desc    Submit code for static analysis, lexical tokens, AST, metrics & optimization observations
 * @access  Public
 */
router.post('/run', analysisController.runAnalysis);

/**
 * @route   POST /api/analysis/compare
 * @desc    Compare student code against reference code across lexical, structural, control-flow & complexity
 * @access  Public
 */
router.post('/compare', analysisController.compareCode);

/**
 * @route   POST /api/analysis/compare-ai
 * @desc    Compare student code against reference code and generate Gemini AI analytical report
 * @access  Public
 */
router.post('/compare-ai', analysisController.compareWithAI);

module.exports = router;

