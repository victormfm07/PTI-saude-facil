// Módulo central de comunicação com a API REST do back-end.
const BASE_URL = '/api';

const Api = {
  async cadastrarUsuario(dados) {
    return post(`${BASE_URL}/usuarios/cadastro`, dados);
  },
  async login(email, senha) {
    return post(`${BASE_URL}/usuarios/login`, { email, senha });
  },
  async listarUnidades(tipo) {
    const url = tipo ? `${BASE_URL}/unidades?tipo=${encodeURIComponent(tipo)}` : `${BASE_URL}/unidades`;
    return get(url);
  },
  async criarAgendamento(dados) {
    return post(`${BASE_URL}/agendamentos`, dados);
  },
  async listarAgendamentos(usuarioId) {
    return get(`${BASE_URL}/agendamentos/usuario/${usuarioId}`);
  },
  async cancelarAgendamento(id) {
    return put(`${BASE_URL}/agendamentos/${id}/cancelar`);
  },
};

async function get(url) {
  const res = await fetch(url);
  return handle(res);
}
async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return handle(res);
}
async function put(url) {
  const res = await fetch(url, { method: 'PUT' });
  return handle(res);
}
async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro inesperado.');
  return data;
}

function usuarioLogado() {
  const raw = sessionStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
}

function exigirLogin() {
  if (!usuarioLogado()) window.location.href = 'index.html';
}

function sair() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

// Data local (não usar toISOString(), que é UTC e pode "adiantar" o dia
// à noite no horário de Brasília).
function hojeLocalISO() {
  const d = new Date();
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Converte "2026-11-23" para "23/11/2026", para exibição amigável.
function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Mesma lista de horários aceitos pelo back-end (services.js).
const HORARIOS_VALIDOS = ['08:00', '09:30', '11:00', '14:00', '16:00'];

// Se a data escolhida for hoje, remove da lista os horários que já passaram.
function horariosDisponiveisPara(dataISO) {
  if (!dataISO || dataISO !== hojeLocalISO()) return HORARIOS_VALIDOS;
  const agora = new Date();
  const horaAgora = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
  return HORARIOS_VALIDOS.filter(h => h >= horaAgora);
}
