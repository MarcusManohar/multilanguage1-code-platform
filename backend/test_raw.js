require('dotenv').config();

async function testDirect() {
  const res = await fetch('https://api.onlinecompiler.io/api/run-code-sync/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.ONLINECOMPILER_API_KEY
    },
    body: JSON.stringify({
      compiler: 'python-3.14',
      code: 'print(1/0)',
      input: ''
    })
  });
  console.log("Raw Python Div0 JSON:", await res.json());

  const res2 = await fetch('https://api.onlinecompiler.io/api/run-code-sync/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.ONLINECOMPILER_API_KEY
    },
    body: JSON.stringify({
      compiler: 'python-3.14',
      code: 'x = input()',
      input: ''
    })
  });
  console.log("Raw Python Input JSON:", await res2.json());
}
testDirect();
