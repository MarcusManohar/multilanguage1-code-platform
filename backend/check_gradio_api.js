const { Client } = require("@gradio/client");

async function checkApi() {
  try {
    const app = await Client.connect("PraneetNS/CodeSentinel");
    const appInfo = await app.view_api();
    console.log(JSON.stringify(appInfo, null, 2));
  } catch (err) {
    console.error("Error connecting to Gradio:", err);
  }
}

checkApi();
