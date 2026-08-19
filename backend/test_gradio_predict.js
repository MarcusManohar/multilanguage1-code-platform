const { Client } = require("@gradio/client");

async function testApi() {
  try {
    const app = await Client.connect("PraneetNS/CodeSentinel");
    
    // Test payload that we might send
    const message = `Please analyze the following Python code and return a beginner-friendly analysis in JSON format containing:
- overallStatus: (status: Correct/Mostly correct/Has errors, explanation)
- problems: (array of problems)
- whatItDoes
- improvements: (array of objects {suggestion, reason})
- performance: {meaningful, explanation}
- testCases: (array of objects {description, expectedResult})
- beginnerTip

Code:
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
`;

    const result = await app.predict("/generate", [
      message,
    ]);

    console.log("Prediction Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error predicting:", err);
  }
}

testApi();
