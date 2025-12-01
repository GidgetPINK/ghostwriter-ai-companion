import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/ai", async (req, res) => {
    console.log("Request received");

    try {
        const { model, messages } = req.body;

        // Extract user message as plain text for Groq
        const userContent = messages
            .filter(m => m.role === "user")
            .map(m => m.content)
            .join("\n\n");

        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
              // high-quality free model
            messages: [
                {
                    role: "system",
                    content:
                        "You are a professional romance-writing editor who writes emotionally, cinematically, and helps with depth, tension, and sensuality."
                },
                {
                    role: "user",
                    content: userContent
                }
            ]
        });

        const output = chatCompletion.choices[0].message.content;

        return res.json({ output });

    } catch (error) {
        console.error("GROQ ERROR:", error);
        res.status(500).json({
            error: error?.message || "Groq request failed"
        });
    }
});

app.listen(3001, () => {
    console.log("AI server (Groq) running on http://localhost:3001");
});
