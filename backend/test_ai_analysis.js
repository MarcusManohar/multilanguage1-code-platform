require('dotenv').config();
const analysisService = require('./src/services/analysis.service');

const tests = [
  {
    name: '1. Correct Python code',
    language: 'python',
    code: `def fibonacci(n):
    if n <= 0: return []
    elif n == 1: return [0]
    result = [0, 1]
    while len(result) < n:
        result.append(result[-1] + result[-2])
    return result

print(fibonacci(5))`
  },
  {
    name: '2. Python code containing a bug',
    language: 'python',
    code: `def divide(a, b):
    return a / b

print(divide(10, 0))`
  },
  {
    name: '3. Correct C++ code',
    language: 'cpp',
    code: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello World!" << endl;
    return 0;
}`
  },
  {
    name: '4. C code with a compilation error',
    language: 'c',
    code: `#include <stdio.h>
int main() {
    printf("Missing semicolon")
    return 0;
}`
  },
  {
    name: '5. Java code with a runtime/logical error',
    language: 'java',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        System.out.println(arr[3]); // Index out of bounds
    }
}`
  }
];

async function runTests() {
  for (const t of tests) {
    console.log(`\n\n--- Running Test: ${t.name} ---`);
    try {
      const result = await analysisService.analyzeCodeWithAI({ language: t.language, code: t.code });
      console.log('Model Used:', result.aiReport.model);
      console.log('Result:', JSON.stringify(result.aiReport.report, null, 2));
    } catch (e) {
      console.error('Test failed:', e);
    }
  }
}

runTests();
