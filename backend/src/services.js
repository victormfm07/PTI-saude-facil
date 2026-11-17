// Camada de serviço: regras de negócio da aplicação.
const bcrypt = require('bcryptjs');
const { UsuarioRepository, UnidadeRepository, AgendamentoRepository } = require('./repositories');

const HORARIOS_VALIDOS = ['08:00', '09:30', '11:00', '14:00', '16:00'];

class ErroNegocio extends Error {
  constructor(mensagem, codigo = 400) {
    super(mensagem);
    this.codigo = codigo;
  }
}

// Data/hora local (America/Sao_Paulo no ambiente de produção), não UTC.
// Evita o bug de usar toISOString(), que pode "adiantar" o dia à noite
// no horário de Brasília.
function dataLocalISO(date = new Date()) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function horaLocalHHMM(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function dataValida(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const d = new Date(`${data}T00:00:00`);
  return !Number.isNaN(d.getTime()) && dataLocalISO(d) === data;
}

// Verdadeiro se (data, horario) já ficou no passado em relação a agora.
function jaPassou(data, horario) {
  const agora = new Date();
  const hoje = dataLocalISO(agora);
  if (data < hoje) return true;
  if (data > hoje) return false;
  return horario < horaLocalHHMM(agora);
}

function normalizarCpf(cpf) {
  return String(cpf || '').replace(/\D/g, '');
}

function cpfValido(cpfNormalizado) {
  return /^\d{11}$/.test(cpfNormalizado);
}

function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase();
}

const UsuarioService = {
  cadastrar({ nome, cpf, email, senha, telefone }) {
    if (!nome || !cpf || !email || !senha) {
      throw new ErroNegocio('Nome, CPF, e-mail e senha são obrigatórios.');
    }
    if (senha.length < 6) {
      throw new ErroNegocio('A senha deve ter pelo menos 6 caracteres.');
    }
    const emailNormalizado = normalizarEmail(email);
    if (!/^\S+@\S+\.\S+$/.test(emailNormalizado)) {
      throw new ErroNegocio('Informe um e-mail válido.');
    }
    const cpfNormalizado = normalizarCpf(cpf);
    if (!cpfValido(cpfNormalizado)) {
      throw new ErroNegocio('CPF inválido. Informe os 11 dígitos do CPF.');
    }
    if (UsuarioRepository.buscarPorEmail(emailNormalizado)) {
      throw new ErroNegocio('Já existe um usuário cadastrado com este e-mail.', 409);
    }
    if (UsuarioRepository.buscarPorCpf(cpfNormalizado)) {
      throw new ErroNegocio('Já existe um usuário cadastrado com este CPF.', 409);
    }
    const senhaHash = bcrypt.hashSync(senha, 10);
    return UsuarioRepository.criar({
      nome,
      cpf: cpfNormalizado,
      email: emailNormalizado,
      senha: senhaHash,
      telefone,
    });
  },

  login({ email, senha }) {
    const usuario = UsuarioRepository.buscarPorEmail(normalizarEmail(email));
    if (!usuario || !bcrypt.compareSync(senha || '', usuario.senha)) {
      throw new ErroNegocio('E-mail ou senha inválidos.', 401);
    }
    const { senha: _senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  },
};

const UnidadeService = {
  listar(tipo) {
    return tipo ? UnidadeRepository.buscarPorTipo(tipo) : UnidadeRepository.listarTodas();
  },
};

const AgendamentoService = {
  criar({ usuarioId, unidadeId, especialidade, data, horario }) {
    if (!usuarioId || !unidadeId || !especialidade || !data || !horario) {
      throw new ErroNegocio('Preencha unidade, especialidade, data e horário.');
    }
    const unidade = UnidadeRepository.buscarPorId(unidadeId);
    if (!unidade) throw new ErroNegocio('Unidade de saúde não encontrada.', 404);

    const especialidadesDaUnidade = unidade.especialidades.split(',').map((e) => e.trim());
    if (!especialidadesDaUnidade.includes(especialidade)) {
      throw new ErroNegocio('Esta unidade não atende a especialidade selecionada.');
    }

    if (!dataValida(data)) {
      throw new ErroNegocio('Data inválida.');
    }
    if (!HORARIOS_VALIDOS.includes(horario)) {
      throw new ErroNegocio('Horário inválido.');
    }

    // Compara data + horário (não só a data) com o momento atual, para não
    // permitir marcar um horário de hoje que já passou.
    if (jaPassou(data, horario)) {
      throw new ErroNegocio('Não é possível agendar em uma data/horário que já passou.');
    }

    // Conflito = mesma unidade + mesma especialidade + mesma data + mesmo
    // horário. Especialidades diferentes podem ter profissionais diferentes
    // atendendo ao mesmo tempo, por isso a especialidade entra na checagem
    // (regra escolhida conscientemente para este MVP).
    const conflito = AgendamentoRepository.buscarConflito(unidadeId, especialidade, data, horario);
    if (conflito) {
      throw new ErroNegocio(
        'Este horário já está reservado para esta especialidade nesta unidade. Escolha outro horário.',
        409
      );
    }

    return AgendamentoRepository.criar({ usuarioId, unidadeId, especialidade, data, horario });
  },

  listarPorUsuario(usuarioId) {
    return AgendamentoRepository.listarPorUsuario(usuarioId);
  },

  cancelar(id) {
    const agendamento = AgendamentoRepository.buscarPorId(id);
    if (!agendamento) throw new ErroNegocio('Agendamento não encontrado.', 404);
    if (agendamento.status === 'CANCELADO') {
      throw new ErroNegocio('Este agendamento já está cancelado.');
    }
    if (jaPassou(agendamento.data_consulta, agendamento.horario_consulta)) {
      throw new ErroNegocio('Não é possível cancelar uma consulta que já ocorreu.');
    }
    return AgendamentoRepository.cancelar(id);
  },
};

module.exports = { UsuarioService, UnidadeService, AgendamentoService, ErroNegocio };
