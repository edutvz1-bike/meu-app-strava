const express = require('express');
const app = express();
app.use(express.json());

// O APERTO DE MÃO DO STRAVA
app.get('/api/webhook', (req, res) => {
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  if (verifyToken === 'STRAVA') {
    res.status(200).json({ "hub.challenge": challenge });
  } else {
    res.status(403).send('Token inválido');
  }
});

// RECEBEDOR DE TREINOS
app.post('/api/webhook', (req, res) => {
  console.log("Treino recebido:", req.body);
  res.status(200).send('EVENT_RECEIVED');
});

// Executa o servidor na Vercel
module.exports = app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
