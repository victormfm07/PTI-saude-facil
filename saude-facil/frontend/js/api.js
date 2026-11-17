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
