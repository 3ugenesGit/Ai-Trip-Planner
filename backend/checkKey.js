const axios = require("axios");
require("dotenv").config();

async function checkKey() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const res = await axios.get(url);
    console.log("✅ API Key is VALID. Available models:");
    res.data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(` - ${m.name}`);
      }
    });
  } catch (err) {
    console.log("❌ API Key check FAILED.");
    if (err.response) {
      console.log(`Status: ${err.response.status}`);
      console.log(`Message: ${err.response.data.error.message}`);
    } else {
      console.log(err.message);
    }
  }
}

checkKey();