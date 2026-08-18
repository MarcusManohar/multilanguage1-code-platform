/**
 * Similarity Service - Algorithmic Comparison of Lexical, Structural, Control Flow, and Complexity
 */

class SimilarityService {
  /**
   * Calculate Jaccard similarity between two arrays/sets
   */
  jaccard(setA, setB) {
    const sA = new Set(setA);
    const sB = new Set(setB);
    if (sA.size === 0 && sB.size === 0) return 1.0;
    if (sA.size === 0 || sB.size === 0) return 0.0;

    let intersectionCount = 0;
    for (const item of sA) {
      if (sB.has(item)) intersectionCount++;
    }

    const unionSize = sA.size + sB.size - intersectionCount;
    return unionSize === 0 ? 1.0 : intersectionCount / unionSize;
  }

  /**
   * Weighted Cosine similarity for AST node types
   * Gives higher weight to high-level structural constructs and specific operational nodes
   */
  weightedNodeCosine(mapA = {}, mapB = {}) {
    const STRUCTURAL_WEIGHTS = {
      // High-level structure
      ClassDef: 3.5,
      ClassDeclaration: 3.5,
      StructDeclaration: 3.5,
      FunctionDef: 3.0,
      AsyncFunctionDef: 3.0,
      FunctionDefinition: 3.0,
      methodDeclaration: 3.0,
      // Control flow
      For: 2.5,
      While: 2.5,
      ForStatement: 2.5,
      WhileStatement: 2.5,
      forStatement: 2.5,
      whileStatement: 2.5,
      If: 2.5,
      IfExp: 2.5,
      IfStatement: 2.5,
      ifStatement: 2.5,
      SwitchStatement: 2.5,
      switchStatement: 2.5,
      Try: 2.0,
      ExceptHandler: 2.0,
      catchClause: 2.0,
      Import: 2.0,
      ImportFrom: 2.0,
      PreprocessorInclude: 2.0,
      // Distinct arithmetic & comparison operations
      Mult: 2.5,
      Add: 2.5,
      Sub: 2.5,
      Div: 2.5,
      Mod: 2.5,
      Pow: 2.5,
      FloorDiv: 2.5,
      'Op:Multiply': 2.5,
      'Op:Add': 2.5,
      'Op:Subtract': 2.5,
      'Op:Divide': 2.5,
      BinOp: 2.0,
      Compare: 2.0,
      BinaryExpression: 2.0,
      Call: 1.5,
      CallExpression: 1.5,
      Return: 1.2,
      ReturnStatement: 1.2,
      // Generic leaves (lower weight)
      Name: 0.5,
      Load: 0.3,
      Store: 0.3,
      Constant: 0.6,
      Expr: 0.4,
      Module: 0.3,
      TranslationUnit: 0.3,
      compilationUnit: 0.3,
    };

    const allKeys = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
    if (allKeys.size === 0) return 1.0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key of allKeys) {
      const weight = STRUCTURAL_WEIGHTS[key] || 1.0;
      const valA = (mapA[key] || 0) * weight;
      const valB = (mapB[key] || 0) * weight;
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    }

    if (normA === 0 || normB === 0) return 0.0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Relative numeric closeness between two numbers: 1 - (|a - b| / max(a, b, 1))
   */
  relativeCloseness(a, b) {
    const numA = Number(a) || 0;
    const numB = Number(b) || 0;
    if (numA === 0 && numB === 0) return 1.0;
    const maxVal = Math.max(numA, numB, 1);
    const diff = Math.abs(numA - numB);
    return Math.max(0, 1 - diff / maxVal);
  }

  /**
   * Compare two analysis results and compute multi-dimensional similarity
   * @param {Object} student Analysis result of student code
   * @param {Object} reference Analysis result of reference code
   * @returns {Object} Similarity scores and explanations
   */
  compare(student, reference) {
    const studentValid = student.syntax?.valid !== false;
    const referenceValid = reference.syntax?.valid !== false;

    // 1. Lexical Similarity
    const kwSim = this.jaccard(student.lexical?.keywords || [], reference.lexical?.keywords || []);
    const opSim = this.jaccard(student.lexical?.operators || [], reference.lexical?.operators || []);
    const litSim = this.jaccard(student.lexical?.literals || [], reference.lexical?.literals || []);
    const tokRatio = this.relativeCloseness(student.lexical?.tokenCount || 0, reference.lexical?.tokenCount || 0);
    const idSim = this.jaccard(student.lexical?.identifiers || [], reference.lexical?.identifiers || []);

    // Operators and literals carry strong semantic weight (35% + 25%), while variable identifiers carry only 5%
    const lexicalScore = Math.round(
      (0.25 * kwSim + 0.35 * opSim + 0.25 * litSim + 0.10 * tokRatio + 0.05 * idSim) * 100
    );

    // 2. Control-Flow Similarity
    const sMetrics = student.metrics || {};
    const rMetrics = reference.metrics || {};

    const funcSim = this.relativeCloseness(sMetrics.functions, rMetrics.functions);
    const loopSim = this.relativeCloseness(sMetrics.loops, rMetrics.loops);
    const condSim = this.relativeCloseness(sMetrics.conditionals, rMetrics.conditionals);

    const controlFlowScore = Math.round(
      (0.40 * loopSim + 0.40 * condSim + 0.20 * funcSim) * 100
    );

    // 3. Complexity Similarity
    const ccSim = this.relativeCloseness(sMetrics.complexity, rMetrics.complexity);
    const locSim = this.relativeCloseness(sMetrics.linesOfCode, rMetrics.linesOfCode);
    const varSim = this.relativeCloseness(sMetrics.variables, rMetrics.variables);

    const complexityScore = Math.round(
      (0.50 * ccSim + 0.25 * locSim + 0.25 * varSim) * 100
    );

    // 4. Structural / AST Similarity
    let structuralScore = 0;
    const astA = student.ast || {};
    const astB = reference.ast || {};

    if (astA.available && astB.available) {
      const nodeTypeSim = this.weightedNodeCosine(astA.nodeTypes, astB.nodeTypes);
      const depthSim = this.relativeCloseness(astA.depth, astB.depth);
      const nodeCountSim = this.relativeCloseness(astA.nodeCount, astB.nodeCount);

      // Operation & literal semantic alignment factor (0.0 to 1.0)
      const opAlignmentFactor = 0.60 * opSim + 0.40 * litSim;

      // Base structural alignment modulated by operational semantic alignment
      const rawStructural = 0.50 * nodeTypeSim + 0.25 * depthSim + 0.25 * nodeCountSim;
      const modulatedStructural = rawStructural * (0.65 + 0.35 * opAlignmentFactor);

      structuralScore = Math.round(modulatedStructural * 100);

      // If control flow structure diverges strongly, scale structural score accordingly
      if (controlFlowScore < 50) {
        structuralScore = Math.round(structuralScore * (0.4 + 0.6 * (controlFlowScore / 100)));
      }
    } else if (studentValid && referenceValid) {
      structuralScore = lexicalScore;
    } else {
      // Invalid syntax significantly reduces structural confidence
      structuralScore = Math.round(lexicalScore * 0.30);
    }

    // 5. Overall Similarity Score (Weighted composite)
    let overallScore = Math.round(
      0.30 * lexicalScore +
      0.35 * structuralScore +
      0.20 * controlFlowScore +
      0.15 * complexityScore
    );

    // If syntax is invalid in either program, cap overall similarity
    if (!studentValid || !referenceValid) {
      overallScore = Math.min(overallScore, 40);
    }

    overallScore = Math.min(100, Math.max(0, overallScore));

    // 6. Explanation Generation
    const similarStructures = [];
    const differences = [];

    if (sMetrics.functions === rMetrics.functions) {
      similarStructures.push(`Identical function/method count (${sMetrics.functions}).`);
    } else {
      differences.push(
        `Function count differs (Student: ${sMetrics.functions}, Reference: ${rMetrics.functions}).`
      );
    }

    if (sMetrics.loops === rMetrics.loops) {
      similarStructures.push(`Identical loop structures count (${sMetrics.loops}).`);
    } else {
      differences.push(`Loop count differs (Student: ${sMetrics.loops}, Reference: ${rMetrics.loops}).`);
    }

    if (sMetrics.conditionals === rMetrics.conditionals) {
      similarStructures.push(`Identical conditional branches count (${sMetrics.conditionals}).`);
    } else {
      differences.push(
        `Conditional branch count differs (Student: ${sMetrics.conditionals}, Reference: ${rMetrics.conditionals}).`
      );
    }

    if (sMetrics.complexity === rMetrics.complexity) {
      similarStructures.push(`Matching cyclomatic complexity level (${sMetrics.complexity}).`);
    } else {
      differences.push(
        `Cyclomatic complexity differs (Student: ${sMetrics.complexity}, Reference: ${rMetrics.complexity}).`
      );
    }

    if (kwSim >= 0.8) {
      similarStructures.push('High keyword vocabulary overlap.');
    } else if (kwSim < 0.5) {
      differences.push('Divergent keyword usage indicating different language constructs.');
    }

    if (opSim >= 0.8) {
      similarStructures.push('Highly aligned operator usage.');
    } else if (opSim < 0.6) {
      differences.push('Distinct arithmetic or logical operators utilized across programs.');
    }

    if (litSim < 0.5 && ((student.lexical?.literals?.length || 0) > 0 || (reference.lexical?.literals?.length || 0) > 0)) {
      differences.push('Different constant values or literal parameters detected.');
    }

    if (!studentValid) {
      differences.push('Student code contains syntax errors, reducing structural confidence.');
    }
    if (!referenceValid) {
      differences.push('Reference code contains syntax errors.');
    }

    if (similarStructures.length === 0) {
      similarStructures.push('Basic syntactic tokens share general programming paradigms.');
    }
    if (differences.length === 0) {
      differences.push('No significant structural deviations detected.');
    }

    return {
      similarity: {
        lexical: lexicalScore,
        structural: structuralScore,
        controlFlow: controlFlowScore,
        complexity: complexityScore,
        overall: overallScore,
      },
      explanation: {
        similarStructures,
        differences,
      },
    };
  }
}

module.exports = new SimilarityService();
