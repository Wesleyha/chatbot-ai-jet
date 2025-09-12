import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// rota raiz (teste rápido)
app.get("/", (req, res) => {
  res.send("✅ API do Chatbot está online!");
});

// rota de chat
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // modelo seguro
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Sem resposta da IA", details: data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
