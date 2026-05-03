const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateItinerary = async (req, res) => {
    const { destination, duration, interests } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
            message: "Gemini API key is missing on the server.",
            error: "MISSING_API_KEY"
        });
    }

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash"
        });

        const prompt = `
            You are a travel assistant. Generate a ${duration}-day itinerary for ${destination} with interests in ${interests.join(", ")}.
            Return the response as a JSON object with a key 'itinerary' which is an array of objects.
            Each object must have:
            - 'day': number
            - 'activities': array of strings
            
            Example format:
            {
              "itinerary": [
                { "day": 1, "activities": ["Visit Eiffel Tower", "Walk by the Seine"] }
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        console.log("Raw Gemini Response:", text);
        
        // Clean up markdown if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        try {
            const content = JSON.parse(text);
            res.json(content);
        } catch (parseError) {
            console.error("JSON Parse Error:", text);
            res.status(500).json({ 
                message: "AI generated an invalid response format", 
                error: "INVALID_JSON" 
            });
        }
    } catch (err) {
        console.error("Gemini Error:", err.message);
        
        let status = 500;
        let message = "Failed to generate itinerary";
        
        if (err.message.includes("429") || err.message.includes("quota")) {
            status = 429;
            message = "Gemini API quota exceeded. Please try again later.";
        } else if (err.message.includes("API_KEY_INVALID")) {
            status = 401;
            message = "Invalid Gemini API key.";
        }

        res.status(status).json({ message, error: err.message });
    }
};