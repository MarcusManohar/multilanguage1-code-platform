const { spawnSync } = require('child_process');
const path = require('path');

const HELPER_PATH = path.join(__dirname, 'python_ast_helper.py');

class PythonAnalyzer {
  /**
   * Analyze Python source code
   * @param {string} code
   * @returns {Object} Normalized analysis result
   */
  async analyze(code) {
    if (typeof code !== 'string') {
      code = '';
    }

    try {
      // Execute python_ast_helper.py using python interpreter
      const pythonProcess = spawnSync('py', ['-3', HELPER_PATH], {
        input: code,
        encoding: 'utf8',
        timeout: 10000,
      });

      if (pythonProcess.status === 0 && pythonProcess.stdout) {
        return JSON.parse(pythonProcess.stdout);
      }

      // Fallback if `py -3` returned error, try `python`
      const fallbackProcess = spawnSync('python', [HELPER_PATH], {
        input: code,
        encoding: 'utf8',
        timeout: 10000,
      });

      if (fallbackProcess.status === 0 && fallbackProcess.stdout) {
        return JSON.parse(fallbackProcess.stdout);
      }

      throw new Error(
        pythonProcess.stderr || fallbackProcess.stderr || 'Python AST analyzer process failed.'
      );
    } catch (err) {
      return {
        language: 'python',
        analysisLevel: 'partial',
        syntax: {
          valid: false,
          errors: [{ line: 1, column: 1, message: `Analyzer error: ${err.message}` }],
        },
        lexical: {
          tokenCount: 0,
          identifiers: [],
          keywords: [],
          operators: [],
          literals: [],
        },
        ast: {
          available: false,
          nodeCount: 0,
          depth: 0,
          nodeTypes: {},
        },
        metrics: {
          linesOfCode: code.split('\n').filter((l) => l.trim()).length,
          functions: 0,
          variables: 0,
          loops: 0,
          conditionals: 0,
          complexity: 1,
        },
        optimization: {
          observations: ['Analysis execution encountered an error.'],
        },
        codeGeneration: {
          available: false,
          information: [],
        },
      };
    }
  }
}

module.exports = new PythonAnalyzer();
