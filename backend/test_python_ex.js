require('dotenv').config();
const compilerService = require('./src/services/onlineCompiler.service');

async function testCompiler() {
  console.log("\nTesting Python Exception...");
  try {
    const res = await compilerService.executeCode({
      language: 'python',
      code: `print(1/0)`
    });
    console.log("Python Exception Result:", res);
  } catch(e) {
    console.error("Python Exception Error:", e);
  }
}
testCompiler();
