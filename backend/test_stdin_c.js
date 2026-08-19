require('dotenv').config();
const compilerService = require('./src/services/onlineCompiler.service');

async function testCompiler() {
  console.log("\nTesting C missing input...");
  try {
    const res = await compilerService.executeCode({
      language: 'c',
      code: `#include <stdio.h>
int main() {
    int x;
    scanf("%d", &x);
    printf("%d", x);
    return 0;
}`
    });
    console.log("C Result:", res);
  } catch(e) {
    console.error("C Error:", e);
  }
}
testCompiler();
