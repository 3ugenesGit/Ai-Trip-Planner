const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.generateItinerary = async (req, res) => {
    const { destination, duration, interests } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: "You are a travel assistant. Return itineraries in JSON format. The JSON should be an array of objects, each with a 'day' (number) and 'activities' (array of strings)." 
                },
                { 
                    role: "user", 
                    content: `Generate a ${duration}-day itinerary for ${destination} with interests in ${interests.join(", ")}.` 
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0].message.content);
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};