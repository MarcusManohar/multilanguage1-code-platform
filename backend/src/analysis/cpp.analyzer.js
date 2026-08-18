const {
  tokenizeCCpp,
  validateCCppSyntax,
  buildCCppStructuralAST,
  getCCppCodeGenInfo,
} = require('./c_cpp_shared');

class CppAnalyzer {
  /**
   * Analyze C++ source code
   * @param {string} code
   * @returns {Object} Normalized analysis result
   */
  async analyze(code) {
    if (typeof code !== 'string') {
      code = '';
    }

    const lexical = tokenizeCCpp(code, true);
    const syntax = validateCCppSyntax(code, true);
    const structuralAST = buildCCppStructuralAST(code, true);
    const codeGen = getCCppCodeGenInfo(code, true);

    return {
      language: 'cpp',
      analysisLevel: 'full',
      syntax,
      lexical,
      ast: {
        available: true,
        nodeCount: structuralAST.nodeCount,
        depth: structuralAST.depth,
        nodeTypes: structuralAST.nodeTypes,
      },
      metrics: structuralAST.metrics,
      optimization: {
        observations: structuralAST.observations,
      },
      codeGeneration: codeGen,
    };
  }
}

module.exports = new CppAnalyzer();
