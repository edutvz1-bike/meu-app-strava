const express = require('express');
const { Redis } = require('@upstash/redis');
const app = express();
app.use(express.json());

let redis;
try {
  redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
  });
} catch (e) {
  console.error("Erro Redis:", e);
}

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
                    <h3 class="text-3xl font-black text-orange-500 tracking-tight">258 <span class="text-lg font-normal text-slate-400">Watts</span></h3>
                </div>
                <div class="text-slate-700 text-4xl font-bold">⚡</div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-xl">
                <div>
                    <p class="text-sm text-slate-400 font-medium mb-1">Frequência Cardíaca Limiar (FTHR)</p>
                    <h3 class="text-3xl font-black text-rose-500 tracking-tight">167 <span class="text-lg font-normal text-slate-400">bpm</span></h3>
                </div>
                <div class="text-slate-700 text-4xl font-bold">❤️</div>
            </div>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-bold tracking-tight">Gráfico de Carga e Fadiga (Intervals.icu)</h2>
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden flex justify-center items-center min-h-[250px]">
                <img src="/api/intervals-chart" alt="Gráfico de Fadiga" class="w-full h-auto rounded-xl max-h-[400px] object-contain">
            </div>
        </section>

        <section class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold tracking-tight">Última Atividade Recebida</h2>
                <span class="text-xs text-slate-500">Atualizado agora mesmo</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div>
                    <span class="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider mb-2 inline-block">
                        ${dadosTreino ? dadosTreino.statusEsporte : 'Aguardando Treino'}
                    </span>
                    <h4 class="text-base font-bold text-slate-200">${dadosTreino ? 'Resumo do Exercício Coletado!' : 'Seu próximo treino aparecerá aqui'}</h4>
                    <p class="text-xs text-slate-400 mt-1">${dadosTreino ? 'Dados vindos diretamente da API do Strava.' : 'O circuito com o Strava já está pronto para receber treinos de bike ou academia.'}</p>
                </div>
                
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div class="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                        <p class="text-xs text-slate-500">Distância / Registros</p>
                        <p class="text-sm font-bold text-slate-200 mt-0.5">${dadosTreino ? dadosTreino.distancia : '--'}</
