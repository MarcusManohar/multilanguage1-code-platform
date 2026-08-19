require('dotenv').config();
const compilerService = require('./src/services/onlineCompiler.service');

async function testCompiler() {
  console.log("\nTesting C++ missing input...");
  try {
    const res = await compilerService.executeCode({
      language: 'cpp',
      code: `#include <iostream>
int main() {
    int x = 42;
    std::cin >> x;
    std::cout << x;
    return 0;
}`
    });
    console.log("C++ Result:", res);
  } catch(e) {
    console.error("C++ Error:", e);
  }
}
testCompiler();
