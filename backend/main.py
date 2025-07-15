# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx  # To make HTTP requests

app = FastAPI()

# Allow frontend (on a different server/port) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Entry(BaseModel):
    entry: str

@app.post("/analyze")
async def analyze_mood(entry: Entry):
    # Call OpenRouter (you'll add your API key here)
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": "Bearer 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",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistralai/mistral-7b-instruct:free", 
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are a professional expert in psychology and physical health.\n\n"
                            "Given a personal journal entry, respond in exactly two sections, clearly labeled like this:\n\n"
                            "Summary:\n"
                            "[Write exactly two sentences summarizing the user's emotional and physical state. Be concise, professional, and specific.]\n\n"
                            "Recommendation:\n"
                            "[Write 2–4 sentences with a practical suggestion to improve wellbeing. If both mental and physical aspects are relevant, address both. Be clear and empathetic, but do not use greetings or markdown formatting.]\n\n"
                            "Important: Only respond using this format. Do not add any extra text, markdown, or closing phrases. Speak directly to the user using 'you'—do not refer to them as 'the user' or in the third person."
                        )

                    },

                    {
                        "role": "user",
                        "content": entry.entry
                    }
                ],
            },
        )
        result = response.json()
        response_text = result["choices"][0]["message"]["content"]

        # Clean and split the response
        parts = response_text.strip().split("Recommendation:", 1)
        summary = parts[0].replace("Summary:", "").strip()
        recommendation = parts[1].strip() if len(parts) > 1 else ""

    return {"summary": summary, "recommendation": recommendation}
