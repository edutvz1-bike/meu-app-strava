const express = require('express');
const { Redis } = require('@upstash/redis');
const app = express();
app.use(express.json());

// INICIALIZA O BANCO DE DADOS UPSTASH AUTOMATICAMENTE
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

// MAPA DE TRADUÇÃO DE ESPORTES DO STRAVA
const traduzirEsporte = (tipo) => {
  const esportes = {
    'Ride': 'Pedal Realizado 🚴‍♂️',
    'MountainBikeRide': 'Mountain Bike Realizado 🚵‍♂️',
    'WeightTraining': 'Treino de Academia 💪',
    'Workout': 'Treino Funcional 🏋️‍♂️',
    'Crossfit': 'Crossfit Concluído 👟',
    'Run': 'Corrida Realizada 🏃‍♂️'
  };
  return esportes[tipo] || 'Atividade Realizada 🎉';
};

// CÓDIGO DA TELA BONITA INTELIGENTE (ATUALIZADO COM 275W)
const gerarHtml = (dadosTreino) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eduardo | Painel de Treinos</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans">
    <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 py-4">
        <div class="max-w-5xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="bg-orange-500 text-slate-950 p-2 rounded-xl font-black text-xl">💪</div>
                <div>
                    <h1 class="text-lg font-bold tracking-tight">Eduardo</h1>
                    <p class="text-xs text-slate-400">Análise de Treinos</p>
                </div>
            </div>
            <span class="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Sincronizado
            </span>
        </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-xl">
                <div>
                    <p class="text-sm text-slate-400 font-medium mb-1">Limiar de Potência (FTP)</p>
                    <h3 class="
