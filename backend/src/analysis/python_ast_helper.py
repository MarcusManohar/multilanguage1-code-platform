import sys
import json
import io
import ast
import tokenize
import keyword
import dis

def analyze(code):
    result = {
        "language": "python",
        "analysisLevel": "full",
        "syntax": {"valid": True, "errors": []},
        "lexical": {
            "tokenCount": 0,
            "identifiers": [],
            "keywords": [],
            "operators": [],
            "literals": []
        },
        "ast": {
            "available": False,
            "nodeCount": 0,
            "depth": 0,
            "nodeTypes": {}
        },
        "metrics": {
            "linesOfCode": len([l for l in code.splitlines() if l.strip() and not l.strip().startswith('#')]),
            "functions": 0,
            "variables": 0,
            "loops": 0,
            "conditionals": 0,
            "complexity": 1
        },
        "optimization": {
            "observations": []
        },
        "codeGeneration": {
            "available": False,
            "information": []
        }
    }

    # Lexical Analysis
    identifiers = set()
    keywords_found = set()
    operators_found = set()
    literals_found = set()
    token_count = 0

    try:
        tokens = list(tokenize.tokenize(io.BytesIO(code.encode('utf-8')).readline))
        for tok in tokens:
            tok_type = tok.type
            tok_val = tok.string
            if tok_type in (tokenize.ENCODING, tokenize.ENDMARKER):
                continue
            token_count += 1
            if tok_type == tokenize.NAME:
                if keyword.iskeyword(tok_val):
                    keywords_found.add(tok_val)
                else:
                    identifiers.add(tok_val)
            elif tok_type == tokenize.OP:
                operators_found.add(tok_val)
            elif tok_type in (tokenize.NUMBER, tokenize.STRING):
                literals_found.add(tok_val[:50]) # cap literal representation length

        result["lexical"] = {
            "tokenCount": token_count,
            "identifiers": sorted(list(identifiers)),
            "keywords": sorted(list(keywords_found)),
            "operators": sorted(list(operators_found)),
            "literals": sorted(list(literals_found))
        }
    except Exception as lex_err:
        pass

    # Syntax & AST
    try:
        tree = ast.parse(code)
        result["ast"]["available"] = True
        
        node_counts = {}
        max_depth = 0
        functions = 0
        variables = set()
        loops = 0
        conditionals = 0
        complexity = 1
        observations = []

        def get_depth(node, current_depth=1):
            nonlocal max_depth
            if current_depth > max_depth:
                max_depth = current_depth
            for child in ast.iter_child_nodes(node):
                get_depth(child, current_depth + 1)

        get_depth(tree)
        result["ast"]["depth"] = max_depth

        total_nodes = 0
        for node in ast.walk(tree):
            total_nodes += 1
            type_name = type(node).__name__
            node_counts[type_name] = node_counts.get(type_name, 0) + 1

            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                functions += 1
            elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
                variables.add(node.id)
            elif isinstance(node, (ast.For, ast.While, ast.AsyncFor)):
                loops += 1
                complexity += 1
            elif isinstance(node, (ast.If, ast.IfExp)):
                conditionals += 1
                complexity += 1
            elif isinstance(node, (ast.And, ast.Or, ast.ExceptHandler)):
                complexity += 1

            # Optimization observations
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                has_return = False
                for stmt in node.body:
                    if has_return:
                        observations.append(f"Dead code detected after return in function '{node.name}'.")
                        break
                    if isinstance(stmt, (ast.Return, ast.Raise)):
                        has_return = True

        result["ast"]["nodeCount"] = total_nodes
        result["ast"]["nodeTypes"] = node_counts
        result["metrics"]["functions"] = functions
        result["metrics"]["variables"] = len(variables)
        result["metrics"]["loops"] = loops
        result["metrics"]["conditionals"] = conditionals
        result["metrics"]["complexity"] = complexity

        if not observations:
            observations.append("Code structure is clean and syntactically sound.")
        result["optimization"]["observations"] = observations

        # Code Generation (Bytecode compilation info without execution)
        try:
            compiled = compile(code, '<string>', 'exec')
            instructions = list(dis.Bytecode(compiled))
            result["codeGeneration"]["available"] = True
            result["codeGeneration"]["information"] = [
                f"Generated {len(instructions)} CPython bytecode instructions.",
                f"Constant pool size: {len(compiled.co_consts)} constants.",
                f"Variable names count: {len(compiled.co_names)} names."
            ]
        except Exception:
            pass

    except SyntaxError as syn_err:
        result["syntax"]["valid"] = False
        result["syntax"]["errors"].append({
            "line": syn_err.lineno,
            "column": syn_err.offset,
            "message": syn_err.msg or "Syntax Error",
            "text": syn_err.text.strip() if syn_err.text else ""
        })

    return result

if __name__ == '__main__':
    input_code = sys.stdin.read()
    output = analyze(input_code)
    print(json.dumps(output))
