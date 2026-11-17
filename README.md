# Saúde Fácil – MVP

Aplicação web de busca de unidades de saúde e agendamento de consultas,
desenvolvida como Produto Mínimo Viável (MVP) do Projeto Integrador.

## Como rodar

Pré-requisito: **Node.js 22 ou superior** (o pacote `better-sqlite3` exige
Node ≥ 22 para instalar o binário pré-compilado).

```bash
cd backend
npm install
npm start
```

Acesse http://localhost:8080 no navegador.

Login de teste já pré-preenchido na tela inicial:
- E-mail: maria@email.com
- Senha: 123456

## Stack

- **Front-end:** HTML5, CSS3 e JavaScript puro (mobile first)
- **Back-end:** Node.js + Express
- **Banco de dados:** SQLite (better-sqlite3)
- **Senhas:** armazenadas com hash (bcryptjs), nunca em texto puro

## Estrutura

```
saude-facil/
  backend/
    src/
      database.js      -> schema e seed do banco
      repositories.js   -> acesso a dados (SQL)
      services.js       -> regras de negócio
      server.js         -> rotas da API REST
    package.json
  frontend/
    index.html, cadastro.html, home.html,
    unidades.html, agendamento.html, historico.html
    css/style.css
    js/api.js
```

## Regras de negócio implementadas

- Login exige e-mail e senha cadastrados (senha verificada via hash).
- E-mail e CPF não podem se repetir no cadastro.
- Não é possível agendar uma especialidade que a unidade não oferece.
- Não é possível agendar em data ou horário que já tenha passado.
- Não é possível agendar em um horário já reservado para a mesma especialidade na mesma unidade.
- Não é possível cancelar uma consulta que já está cancelada.
- Não é possível cancelar uma consulta após a data e o horário do atendimento.

## Limitações conhecidas desta versão (MVP)

Por ser um MVP de escopo reduzido, as seguintes simplificações foram
feitas conscientemente e ficam como evolução futura:

- **Autorização por usuário no servidor:** a sessão é mantida apenas no
  navegador (`sessionStorage`). O servidor confia no `usuarioId` enviado
  pelo front-end e **não verifica** se o registro pedido/alterado pertence
  de fato ao usuário autenticado (ex.: `GET /api/agendamentos/usuario/:id`,
  `PUT /api/agendamentos/:id/cancelar`). Login e cadastro funcionam
  normalmente; o que falta é um mecanismo de token/sessão no servidor que
  identifique o usuário a cada requisição, em vez de confiar no valor
  enviado pelo cliente. Fica como próximo passo do projeto.
- Os horários disponíveis por unidade/especialidade ainda são fixos,
  em vez de vir de uma agenda real cadastrada no banco.
- A lista de especialidades de cada unidade é um campo de texto simples,
  em vez de uma tabela associativa separada.

## Regra de conflito de horário (decisão consciente)

Um horário só é considerado ocupado se já existir um agendamento com a
**mesma unidade + mesma especialidade + mesma data + mesmo horário**.
Especialidades diferentes na mesma unidade podem ter o mesmo horário
ocupado ao mesmo tempo (cada uma representa, na prática, um profissional
diferente).
