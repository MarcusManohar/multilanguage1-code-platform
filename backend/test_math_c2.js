require('dotenv').config();
const compilerService = require('./src/services/onlineCompiler.service');

async function testMathC() {
  console.log("Testing sqrt() with non-constant...");
  try {
    const res = await compilerService.executeCode({
      language: 'c',
      code: `#include <stdio.h>
#include <math.h>
int main() {
    double x;
    scanf("%lf", &x);
    printf("%.2f\\n", sqrt(x));
    return 0;
}`,
      stdin: '25.0'
    });
    console.log("sqrt Result:", res);
  } catch(e) {
    console.error("sqrt Error:", e);
  }
}
testMathC();
