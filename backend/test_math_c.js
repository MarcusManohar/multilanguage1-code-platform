require('dotenv').config();
const compilerService = require('./src/services/onlineCompiler.service');

async function testMathC() {
  console.log("Testing sqrt()...");
  try {
    const res = await compilerService.executeCode({
      language: 'c',
      code: `#include <stdio.h>
#include <math.h>
int main() {
    printf("%.2f\\n", sqrt(25.0));
    return 0;
}`
    });
    console.log("sqrt Result:", res);
  } catch(e) {
    console.error("sqrt Error:", e);
  }

  console.log("\\nTesting pow()...");
  try {
    const res = await compilerService.executeCode({
      language: 'c',
      code: `#include <stdio.h>
#include <math.h>
int main() {
    printf("%.2f\\n", pow(2.0, 3.0));
    return 0;
}`
    });
    console.log("pow Result:", res);
  } catch(e) {
    console.error("pow Error:", e);
  }
}
testMathC();
