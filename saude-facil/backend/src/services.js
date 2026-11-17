// Camada de serviço: regras de negócio da aplicação.
const { UsuarioRepository, UnidadeRepository, AgendamentoRepository } = require('./repositories');

class ErroNegocio extends Error {
  constructor(mensagem, codigo = 400) {
    super(mensagem);
    this.codigo = codigo;
  }
}

const UsuarioService = {
  cadastrar({ nome, cpf, email, senha, telefone }) {
    if (!nome || !cpf || !email || !senha) {
      throw new ErroNegocio('Nome, CPF, e-mail e senha são obrigatórios.');
    }
    if (UsuarioRepository.buscarPorEmail(email)) {
      throw new ErroNegocio('Já existe um usuário cadastrado com este e-mail.', 409);
    }
    return UsuarioRepository.criar({ nome, cpf, email, senha, telefone });
  },

  login({ email, senha }) {
    const usuario = UsuarioRepository.buscarPorEmail(email);
    if (!usuario || usuario.senha !== senha) {
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

    const hoje = new Date().toISOString().slice(0, 10);
    if (data < hoje) {
      throw new ErroNegocio('Não é possível agendar em uma data retroativa.');
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
    return AgendamentoRepository.cancelar(id);
  },
};

module.exports = { UsuarioService, UnidadeService, AgendamentoService, ErroNegocio };
