require('dotenv').config();

const CODE = `#include <stdio.h>
#include <math.h>
int main() {
    double x = 25.0;
    printf("%.2f\\n", sqrt(x));
    return 0;
}`;

async function testDirect() {
  const keysToTest = [
    { compiler_options: '-lm' },
    { options: '-lm' },
    { command_line_arguments: '-lm' },
    { compilerArgs: '-lm' },
    { flags: '-lm' },
    { compile_options: '-lm' },
    { linker_options: '-lm' },
    { "options": { "compilerArgs": "-lm" } },
    { "compiler_args": "-lm" },
    { "compile_args": "-lm" }
  ];

  for (const extra of keysToTest) {
    console.log("Testing with:", extra);
    const res = await fetch('https://api.onlinecompiler.io/api/run-code-sync/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.ONLINECOMPILER_API_KEY
      },
      body: JSON.stringify({
        compiler: 'gcc-15',
        code: CODE,
        input: '',
        ...extra
      })
    });
    const json = await res.json();
    if (json.exit_code === 0 && json.output.includes("5.00")) {
      console.log("SUCCESS!", extra);
      return;
    }
  }
  console.log("None of the keys worked.");
}
testDirect();
