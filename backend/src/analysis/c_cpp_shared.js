const { spawnSync } = require('child_process');

const C_KEYWORDS = new Set([
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
  'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
  'inline', 'int', 'long', 'register', 'restrict', 'return', 'short',
  'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
  'unsigned', 'void', 'volatile', 'while', '_Bool', '_Complex', '_Imaginary'
]);

const CPP_KEYWORDS = new Set([
  ...C_KEYWORDS,
  'alignas', 'alignof', 'asm', 'bool', 'catch', 'char8_t', 'char16_t', 'char32_t',
  'class', 'concept', 'consteval', 'constexpr', 'constinit', 'const_cast',
  'co_await', 'co_return', 'co_yield', 'decltype', 'delete', 'dynamic_cast',
  'explicit', 'export', 'false', 'friend', 'mutable', 'namespace', 'new',
  'noexcept', 'nullptr', 'operator', 'override', 'private', 'protected',
  'public', 'reinterpret_cast', 'requires', 'static_assert', 'static_cast',
  'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typeid',
  'typename', 'using', 'virtual', 'wchar_t'
]);

const OPERATORS = [
  '>>=', '<<=', '->*', '...', '::', '++', '--', '->', '&&', '||',
  '<=', '>=', '==', '!=', '+=', '-=', '*=', '/=', '%=', '&=', '^=', '|=',
  '<<', '>>', '<=>', '##', '<:', ':>', '<%', '%>', '%:',
  '+', '-', '*', '/', '%', '<', '>', '=', '!', '~', '&', '|', '^', '?', ':', ',', '.', ';', '(', ')', '[', ']', '{', '}'
];

/**
 * Tokenize C/C++ source code
 */
function tokenizeCCpp(code, isCpp = false) {
  const keywordsSet = isCpp ? CPP_KEYWORDS : C_KEYWORDS;
  const identifiers = new Set();
  const keywordsFound = new Set();
  const operatorsFound = new Set();
  const literalsFound = new Set();

  let tokenCount = 0;
  let i = 0;
  const len = code.length;

  while (i < len) {
    const ch = code[i];

    // Whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Single line comment
    if (ch === '/' && code[i + 1] === '/') {
      i += 2;
      while (i < len && code[i] !== '\n') i++;
      continue;
    }

    // Multi line comment
    if (ch === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < len && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    // Preprocessor directive
    if (ch === '#' && (i === 0 || code[i - 1] === '\n' || /\s/.test(code[i - 1]))) {
      let prep = '#';
      i++;
      while (i < len && code[i] !== '\n') {
        prep += code[i];
        i++;
      }
      tokenCount++;
      operatorsFound.add('#');
      continue;
    }

    // String literal
    if (ch === '"') {
      let str = '"';
      i++;
      while (i < len && code[i] !== '"') {
        if (code[i] === '\\' && i + 1 < len) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (i < len) {
        str += '"';
        i++;
      }
      tokenCount++;
      literalsFound.add(str.slice(0, 50));
      continue;
    }

    // Char literal
    if (ch === "'") {
      let chr = "'";
      i++;
      while (i < len && code[i] !== "'") {
        if (code[i] === '\\' && i + 1 < len) {
          chr += code[i] + code[i + 1];
          i += 2;
        } else {
          chr += code[i];
          i++;
        }
      }
      if (i < len) {
        chr += "'";
        i++;
      }
      tokenCount++;
      literalsFound.add(chr);
      continue;
    }

    // Number literal
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(code[i + 1] || ''))) {
      let num = '';
      while (i < len && /[0-9a-fA-FxX.uUlLfF]/.test(code[i])) {
        num += code[i];
        i++;
      }
      tokenCount++;
      literalsFound.add(num);
      continue;
    }

    // Identifier or Keyword
    if (/[a-zA-Z_]/.test(ch)) {
      let id = '';
      while (i < len && /[a-zA-Z0-9_]/.test(code[i])) {
        id += code[i];
        i++;
      }
      tokenCount++;
      if (keywordsSet.has(id)) {
        keywordsFound.add(id);
      } else {
        identifiers.add(id);
      }
      continue;
    }

    // Multi-char or single-char operators
    let matchedOp = null;
    for (const op of OPERATORS) {
      if (code.startsWith(op, i)) {
        matchedOp = op;
        break;
      }
    }

    if (matchedOp) {
      tokenCount++;
      operatorsFound.add(matchedOp);
      i += matchedOp.length;
      continue;
    }

    // Other character
    tokenCount++;
    i++;
  }

  return {
    tokenCount,
    identifiers: Array.from(identifiers).sort(),
    keywords: Array.from(keywordsFound).sort(),
    operators: Array.from(operatorsFound).sort(),
    literals: Array.from(literalsFound).sort(),
  };
}

/**
 * Validate syntax using GCC / G++ compiler frontend
 */
function validateCCppSyntax(code, isCpp = false) {
  const compiler = isCpp ? 'g++' : 'gcc';
  const langFlag = isCpp ? '-xc++' : '-xc';
  const stdFlag = isCpp ? '-std=c++20' : '-std=c11';

  try {
    const res = spawnSync(compiler, ['-fsyntax-only', langFlag, stdFlag, '-'], {
      input: code,
      encoding: 'utf8',
      timeout: 10000,
    });

    if (res.status === 0) {
      return { valid: true, errors: [] };
    }

    const stderr = res.stderr || '';
    const errors = [];
    const lines = stderr.split('\n');

    for (const line of lines) {
      const match = line.match(/<stdin>:(\d+):(\d+):\s*(error|fatal error):\s*(.*)/i);
      if (match) {
        errors.push({
          line: parseInt(match[1], 10),
          column: parseInt(match[2], 10),
          severity: match[3].toLowerCase(),
          message: match[4].trim(),
        });
      }
    }

    if (errors.length === 0 && stderr.trim().length > 0) {
      errors.push({
        line: 1,
        column: 1,
        severity: 'error',
        message: stderr.trim().split('\n')[0] || 'Syntax error detected by compiler.',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (err) {
    return {
      valid: false,
      errors: [{ line: 1, column: 1, severity: 'error', message: err.message }],
    };
  }
}

/**
 * Build structural AST and metrics for C/C++
 */
function buildCCppStructuralAST(code, isCpp = false) {
  let nodeCount = 1; // Root TranslationUnit
  let depth = 1;
  const nodeTypes = {
    TranslationUnit: 1,
  };

  const lines = code.split('\n');
  const cleanLines = lines.map((l) => l.trim()).filter((l) => l && !l.startsWith('//') && !l.startsWith('/*'));
  const loc = cleanLines.length;

  let functions = 0;
  let variables = 0;
  let loops = 0;
  let conditionals = 0;
  let complexity = 1;
  const observations = [];

  // Parse lines for structural elements
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    // Includes
    if (trimmed.startsWith('#include')) {
      nodeCount++;
      nodeTypes['PreprocessorInclude'] = (nodeTypes['PreprocessorInclude'] || 0) + 1;
    } else if (trimmed.startsWith('#define')) {
      nodeCount++;
      nodeTypes['PreprocessorDefine'] = (nodeTypes['PreprocessorDefine'] || 0) + 1;
    }

    // Classes / Structs
    if (/\bstruct\s+[a-zA-Z_]/.test(trimmed)) {
      nodeCount++;
      nodeTypes['StructDeclaration'] = (nodeTypes['StructDeclaration'] || 0) + 1;
    }
    if (isCpp && /\bclass\s+[a-zA-Z_]/.test(trimmed)) {
      nodeCount++;
      nodeTypes['ClassDeclaration'] = (nodeTypes['ClassDeclaration'] || 0) + 1;
    }
    if (isCpp && /\bnamespace\s+[a-zA-Z_]/.test(trimmed)) {
      nodeCount++;
      nodeTypes['NamespaceDeclaration'] = (nodeTypes['NamespaceDeclaration'] || 0) + 1;
    }

    // Specific Operators in AST node types
    if (trimmed.includes('*') && !trimmed.startsWith('#') && !trimmed.startsWith('/*')) {
      nodeTypes['Op:Multiply'] = (nodeTypes['Op:Multiply'] || 0) + 1;
    }
    if (trimmed.includes('+') && !trimmed.includes('++')) {
      nodeTypes['Op:Add'] = (nodeTypes['Op:Add'] || 0) + 1;
    }
    if (trimmed.includes('-') && !trimmed.includes('--') && !trimmed.includes('->')) {
      nodeTypes['Op:Subtract'] = (nodeTypes['Op:Subtract'] || 0) + 1;
    }
    if (trimmed.includes('/') && !trimmed.includes('//')) {
      nodeTypes['Op:Divide'] = (nodeTypes['Op:Divide'] || 0) + 1;
    }

    // Functions: ReturnType Identifier(...) {
    const funcMatch = trimmed.match(/\b(int|void|float|double|char|bool|auto|long|string|size_t|[a-zA-Z_][a-zA-Z0-9_]*::[a-zA-Z0-9_]*)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*\{?/);
    if (funcMatch && !['if', 'for', 'while', 'switch', 'return'].includes(funcMatch[2])) {
      functions++;
      nodeCount += 2; // FunctionDefinition + Identifier
      nodeTypes['FunctionDefinition'] = (nodeTypes['FunctionDefinition'] || 0) + 1;
      nodeTypes['FunctionDeclarator'] = (nodeTypes['FunctionDeclarator'] || 0) + 1;
    }

    // Loops
    if (/\bfor\s*\(/.test(trimmed)) {
      loops++;
      complexity++;
      nodeCount++;
      nodeTypes['ForStatement'] = (nodeTypes['ForStatement'] || 0) + 1;
    }
    if (/\bwhile\s*\(/.test(trimmed) && !trimmed.endsWith(');')) {
      loops++;
      complexity++;
      nodeCount++;
      nodeTypes['WhileStatement'] = (nodeTypes['WhileStatement'] || 0) + 1;
    }
    if (/\bdo\s*\{/.test(trimmed)) {
      loops++;
      complexity++;
      nodeCount++;
      nodeTypes['DoWhileStatement'] = (nodeTypes['DoWhileStatement'] || 0) + 1;
    }

    // Conditionals
    if (/\bif\s*\(/.test(trimmed)) {
      conditionals++;
      complexity++;
      nodeCount++;
      nodeTypes['IfStatement'] = (nodeTypes['IfStatement'] || 0) + 1;
    }
    if (/\belse\b/.test(trimmed)) {
      nodeCount++;
      nodeTypes['ElseClause'] = (nodeTypes['ElseClause'] || 0) + 1;
    }
    if (/\bswitch\s*\(/.test(trimmed)) {
      conditionals++;
      complexity++;
      nodeCount++;
      nodeTypes['SwitchStatement'] = (nodeTypes['SwitchStatement'] || 0) + 1;
    }
    if (/\?.*:/.test(trimmed)) {
      conditionals++;
      complexity++;
      nodeCount++;
      nodeTypes['TernaryExpression'] = (nodeTypes['TernaryExpression'] || 0) + 1;
    }

    // Variable declarations: e.g. int x = 10;
    if (/\b(int|float|double|char|bool|long|short|unsigned|auto|const|string|vector|std::[a-zA-Z]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(=|;|,)/.test(trimmed)) {
      variables++;
      nodeCount += 2;
      nodeTypes['VariableDeclaration'] = (nodeTypes['VariableDeclaration'] || 0) + 1;
    }

    // Returns
    if (/\breturn\b/.test(trimmed)) {
      nodeCount++;
      nodeTypes['ReturnStatement'] = (nodeTypes['ReturnStatement'] || 0) + 1;
    }

    // Logical operators increasing complexity
    const andMatches = (trimmed.match(/&&/g) || []).length;
    const orMatches = (trimmed.match(/\|\|/g) || []).length;
    complexity += andMatches + orMatches;
  }

  // Calculate nesting depth based on brace levels
  let currentDepth = 1;
  for (let idx = 0; idx < code.length; idx++) {
    if (code[idx] === '{') {
      currentDepth++;
      if (currentDepth > depth) depth = currentDepth;
    } else if (code[idx] === '}') {
      if (currentDepth > 1) currentDepth--;
    }
  }

  // Optimization observations
  if (isCpp) {
    if (code.includes('std::vector') && !code.includes('reserve')) {
      observations.push('Consider using std::vector::reserve() when size is known to reduce reallocations.');
    }
    if (code.includes('std::endl')) {
      observations.push("Prefer '\\n' over std::endl to avoid unnecessary stream buffer flushes.");
    }
    if (code.includes('std::string') && !code.includes('const std::string&') && !code.includes('string_view')) {
      observations.push('Consider passing strings by const reference or std::string_view for performance.');
    }
  } else {
    if (code.includes('malloc') && !code.includes('free')) {
      observations.push('Detected dynamic memory allocation (malloc) without matching free call.');
    }
  }

  if (observations.length === 0) {
    observations.push('Code structure is clean and follows standard procedural patterns.');
  }

  return {
    nodeCount,
    depth,
    nodeTypes,
    metrics: {
      linesOfCode: loc,
      functions,
      variables,
      loops,
      conditionals,
      complexity,
    },
    observations,
  };
}

/**
 * Generate compiler code generation information without executing
 */
function getCCppCodeGenInfo(code, isCpp = false) {
  const compiler = isCpp ? 'g++' : 'gcc';
  const langFlag = isCpp ? '-xc++' : '-xc';
  const stdFlag = isCpp ? '-std=c++20' : '-std=c11';

  try {
    const res = spawnSync(compiler, ['-S', '-O1', langFlag, stdFlag, '-', '-o', '-'], {
      input: code,
      encoding: 'utf8',
      timeout: 10000,
    });

    if (res.status === 0 && res.stdout) {
      const asmOutput = res.stdout;
      const instructionLines = asmOutput
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('.') && !l.startsWith('#') && !l.endsWith(':'));

      return {
        available: true,
        information: [
          `Target Compiler: ${compiler.toUpperCase()} (x86_64 ABI)`,
          `Generated ${instructionLines.length} assembly instructions under O1 optimization.`,
          `Code generation and optimization pipeline verified successfully.`,
        ],
      };
    }
  } catch {
    // Fallback if compiler command fails
  }

  return {
    available: false,
    information: [],
  };
}

module.exports = {
  tokenizeCCpp,
  validateCCppSyntax,
  buildCCppStructuralAST,
  getCCppCodeGenInfo,
};
