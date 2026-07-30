const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const client = require('prom-client');

// counts requests, memory usage, and execution time.
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
//express.static(__dirname) says:"Whenever someone asks for a file, search inside this folder."
//"Whenever someone asks for a file, search inside this folder."
// Aceita MONGO_URI ou MONGODB_URI, com fallback padrão do Docker Compose
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/moodtracker';

client.collectDefaultMetrics();
// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const MoodSchema = new mongoose.Schema({
  mood: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Mood = mongoose.model("Mood", MoodSchema);
const PORT = process.env.PORT || 4000;


app.use(express.static(path.join(__dirname, "public")));

app.post("/submit", async (req, res) => {
  console.log("Dado recebido do frontend:", req.body);
  try {
    const newMood = new Mood({
      mood: req.body.mood
    });

    const moodSalvo = await newMood.save();
    res.json({ status: "success", data: moodSalvo });
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
    res.status(500).json({ status: "error", message: "Erro interno ao salvar." });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/entries", async (req, res) => {
  try {
    const entries = await Mood.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao carregar o histórico." });
  }
});

app.delete("/entries/:id", async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ status: "success", message: "Registro deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar registro." });
  }
});


// Rota de métricas que o Prometheus vai chamar
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;
