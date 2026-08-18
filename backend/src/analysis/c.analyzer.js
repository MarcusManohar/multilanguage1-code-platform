const {
  tokenizeCCpp,
  validateCCppSyntax,
  buildCCppStructuralAST,
  getCCppCodeGenInfo,
} = require('./c_cpp_shared');

class CAnalyzer {
  /**
   * Analyze C source code
   * @param {string} code
   * @returns {Object} Normalized analysis result
   */
  async analyze(code) {
    if (typeof code !== 'string') {
      code = '';
    }

    const lexical = tokenizeCCpp(code, false);
    const syntax = validateCCppSyntax(code, false);
    const structuralAST = buildCCppStructuralAST(code, false);
    const codeGen = getCCppCodeGenInfo(code, false);

    return {
      language: 'c',
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

module.exports = new CAnalyzer();
