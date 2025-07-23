const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(prompt) {
  const data = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
    return reply;

  } catch (err) {
    return "Error: " + err.message;
  }
}
