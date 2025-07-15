# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
print(f"API Key loaded: {api_key is not None}")
print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")

app = FastAPI()

# Allow frontend (on a different server/port) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Entry(BaseModel):
    entry: str

@app.post("/analyze")
async def analyze_mood(entry: Entry):
    if not api_key:
        return {"summary": "API key not configured", "recommendation": "Please check your environment variables"}

    try:    
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
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
                                "[Write exactly two sentences summarizing the user's emotional and physical state. Be concise, professional, and specific. START your summary with 1-2 relevant emojis that represent the dominant emotion or mood (e.g., 😊 for happiness, 😔 for sadness, 😰 for anxiety, 😌 for calm, 💪 for strength, 🌟 for achievement, 😴 for tiredness, etc.). The emojis should feel natural and supportive.]\n\n"
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

            # Check if the request was successful
            if response.status_code != 200:
                print(f"OpenRouter API error: {response.status_code}")
                print(f"Response: {response.text}")
                return {"summary": "API request failed", "recommendation": "Please try again later"}

            result = response.json()
            response_text = result["choices"][0]["message"]["content"]

            # Clean and split the response
            parts = response_text.strip().split("Recommendation:", 1)
            summary = parts[0].replace("Summary:", "").strip()
            recommendation = parts[1].strip() if len(parts) > 1 else ""

            return {"summary": summary, "recommendation": recommendation}

    except Exception as e:
        print(f"Error in analyze_mood: {e}")
        return {"summary": "Error processing request", "recommendation": "Please try again"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "api_key_configured": api_key is not None}