const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
//express.static(__dirname) says:"Whenever someone asks for a file, search inside this folder."
//"Whenever someone asks for a file, search inside this folder."
const mongoUri = process.env.MONGODB_URI || "mongodb://mongodb:27017/moodtracker";

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log("Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const MoodSchema = new mongoose.Schema({
  mood: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Mood = mongoose.model("Mood", MoodSchema);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

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

module.exports = app;
