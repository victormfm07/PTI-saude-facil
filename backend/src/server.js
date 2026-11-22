const express = require('express');
const path = require('path');
const { init } = require('./database');
const { UsuarioService, UnidadeService, AgendamentoService, ErroNegocio } = require('./services');

init();

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

function handle(res, fn) {
  try {
    const resultado = fn();
    res.json(resultado);
  } catch (err) {
    if (err instanceof ErroNegocio) {
      res.status(err.codigo).json({ erro: err.message });
    } else {
      console.error(err);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
}

// ---- Usuários ----
app.post('/api/usuarios/cadastro', (req, res) => {
  handle(res, () => UsuarioService.cadastrar(req.body));
});

app.post('/api/usuarios/login', (req, res) => {
  handle(res, () => UsuarioService.login(req.body));
});

// ---- Unidades de saúde ----
app.get('/api/unidades', (req, res) => {
  handle(res, () => UnidadeService.listar(req.query.tipo));
});

// ---- Agendamentos ----
app.post('/api/agendamentos', (req, res) => {
  handle(res, () =>
    AgendamentoService.criar({
      usuarioId: req.body.usuarioId,
      unidadeId: req.body.unidadeId,
      especialidade: req.body.especialidade,
      data: req.body.data,
      horario: req.body.horario,
    })
  );
});

app.get('/api/agendamentos/usuario/:usuarioId', (req, res) => {
  handle(res, () => AgendamentoService.listarPorUsuario(Number(req.params.usuarioId)));
});

app.put('/api/agendamentos/:id/cancelar', (req, res) => {
  handle(res, () => AgendamentoService.cancelar(Number(req.params.id)));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Saúde Fácil (MVP) rodando em http://localhost:${PORT}`);
});
