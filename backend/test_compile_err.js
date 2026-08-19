require('dotenv').config();
const compilerService = require('./src/services/onlineCompiler.service');

async function testCompiler() {
  console.log("\nTesting C++ compilation error...");
  try {
    const res = await compilerService.executeCode({
      language: 'cpp',
      code: `#include <iostream>
int main() {
    std::cout << "Missing semicolon"
    return 0;
}`
    });
    console.log("C++ Result:", res);
  } catch(e) {
    console.error("C++ Error:", e);
  }
}
testCompiler();
