// Camada de repositório: consultas SQL isoladas, sem regra de negócio.
const { db } = require('./database');

const UsuarioRepository = {
  buscarPorEmail(email) {
    return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  },
  buscarPorCpf(cpf) {
    return db.prepare('SELECT * FROM usuarios WHERE cpf = ?').get(cpf);
  },
  buscarPorId(id) {
    return db.prepare('SELECT id, nome, cpf, email, telefone FROM usuarios WHERE id = ?').get(id);
  },
  criar({ nome, cpf, email, senha, telefone }) {
    const info = db
      .prepare('INSERT INTO usuarios (nome, cpf, email, senha, telefone) VALUES (?,?,?,?,?)')
      .run(nome, cpf, email, senha, telefone || null);
    return this.buscarPorId(info.lastInsertRowid);
  },
};

const UnidadeRepository = {
  listarTodas() {
    return db.prepare('SELECT * FROM unidades_saude ORDER BY nome').all();
  },
  buscarPorId(id) {
    return db.prepare('SELECT * FROM unidades_saude WHERE id = ?').get(id);
  },
  buscarPorTipo(tipo) {
    return db.prepare('SELECT * FROM unidades_saude WHERE tipo = ? ORDER BY nome').all(tipo);
  },
};

const AgendamentoRepository = {
  listarPorUsuario(usuarioId) {
    return db
      .prepare(
        `SELECT a.*, u.nome AS unidade_nome
         FROM agendamentos a
         JOIN unidades_saude u ON u.id = a.unidade_id
         WHERE a.usuario_id = ?
         ORDER BY a.data_consulta DESC, a.horario_consulta DESC`
      )
      .all(usuarioId);
  },
  buscarPorId(id) {
    return db.prepare('SELECT * FROM agendamentos WHERE id = ?').get(id);
  },
  buscarConflito(unidadeId, especialidade, data, horario) {
    return db
      .prepare(
        `SELECT * FROM agendamentos
         WHERE unidade_id = ? AND especialidade = ? AND data_consulta = ? AND horario_consulta = ?
           AND status = 'AGENDADO'`
      )
      .get(unidadeId, especialidade, data, horario);
  },
  criar({ usuarioId, unidadeId, especialidade, data, horario }) {
    const info = db
      .prepare(
        `INSERT INTO agendamentos (usuario_id, unidade_id, especialidade, data_consulta, horario_consulta)
         VALUES (?,?,?,?,?)`
      )
      .run(usuarioId, unidadeId, especialidade, data, horario);
    return this.buscarPorId(info.lastInsertRowid);
  },
  cancelar(id) {
    db.prepare(`UPDATE agendamentos SET status = 'CANCELADO' WHERE id = ?`).run(id);
    return this.buscarPorId(id);
  },
};

module.exports = { UsuarioRepository, UnidadeRepository, AgendamentoRepository };
