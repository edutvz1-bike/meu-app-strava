const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// CONFIGURA A PASTA DA TELA BONITA
app.use(express.static(path.join(__dirname, 'public')));

// ROTA DO STRAVA (WEBHOOK)
app.get('/api/webhook', (req, res) => {
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  if (verifyToken === 'STRAVA') {
    res.status(200).json({ "hub.challenge": challenge });
  } else {
    res.status(403).send('Token inválido');
  }
});

app.post('/api/webhook', (req, res) => {
  console.log("Treino recebido do Strava:", req.body);
  res.status(200).send('EVENT_RECEIVED');
});

// DIZ PARA A PÁGINA INICIAL MOSTRAR O INDEX.HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
