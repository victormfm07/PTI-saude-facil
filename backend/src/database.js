const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'saudefacil.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      telefone TEXT
    );

    CREATE TABLE IF NOT EXISTS unidades_saude (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      endereco TEXT NOT NULL,
      bairro TEXT NOT NULL,
      cidade TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK (tipo IN ('UBS','UPA','Hospital')),
      especialidades TEXT NOT NULL,
      horario_funcionamento TEXT
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      unidade_id INTEGER NOT NULL REFERENCES unidades_saude(id),
      especialidade TEXT NOT NULL,
      data_consulta TEXT NOT NULL,
      horario_consulta TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'AGENDADO' CHECK (status IN ('AGENDADO','CANCELADO')),
      criado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedUsuarios();
  seedUnidades();
}

function seedUsuarios() {
  const count = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total;
  if (count > 0) return;

  const senhaHash = bcrypt.hashSync('123456', 10);
  db.prepare(
    `INSERT INTO usuarios (nome, cpf, email, senha, telefone) VALUES (?,?,?,?,?)`
  ).run('Maria Aparecida Silva', '12345678900', 'maria@email.com', senhaHash, '(11) 99999-0001');
}

function seedUnidades() {
  const count = db.prepare('SELECT COUNT(*) AS total FROM unidades_saude').get().total;
  if (count > 0) return;

  const insertUnidade = db.prepare(
    `INSERT INTO unidades_saude (nome, endereco, bairro, cidade, tipo, especialidades, horario_funcionamento)
     VALUES (?,?,?,?,?,?,?)`
  );
  const unidades = [
    ['UBS Vila Mariana', 'Rua Domingos de Morais, 1500', 'Vila Mariana', 'São Paulo', 'UBS', 'Clínico Geral, Pediatria', 'Seg-Sex 07h às 19h'],
    ['UPA Santana', 'Av. Cruzeiro do Sul, 2000', 'Santana', 'São Paulo', 'UPA', 'Clínico Geral, Ortopedia', '24 horas'],
    ['Hospital Municipal Centro', 'Rua da Consolação, 300', 'Centro', 'São Paulo', 'Hospital', 'Cardiologia, Clínico Geral', '24 horas'],
    ['UBS Vila Madalena', 'Rua Harmonia, 200', 'Vila Madalena', 'São Paulo', 'UBS', 'Clínico Geral, Pediatria', 'Seg-Sex 07h às 17h'],
  ];
  for (const u of unidades) insertUnidade.run(...u);
}

module.exports = { db, init };
