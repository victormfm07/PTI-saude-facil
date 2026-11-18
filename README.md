# Saúde Fácil

### Plataforma Digital de Agendamento de Consultas em Unidades de Saúde Pública

O **Saúde Fácil** é uma aplicação web desenvolvida como Produto Mínimo Viável (MVP) para o Projeto Integrador do curso de Tecnologia em Análise e Desenvolvimento de Sistemas do Centro Universitário Senac.

A solução tem como objetivo facilitar a busca por unidades de saúde e organizar o fluxo de agendamento de consultas por meio de uma interface simples, clara e acessível.

---

## Funcionalidades

O MVP permite:

- Cadastro e login de usuários;
- Busca e visualização de unidades de saúde;
- Consulta das especialidades disponíveis;
- Agendamento de consultas em três etapas;
- Conferência dos dados antes da confirmação;
- Visualização da próxima consulta;
- Histórico de agendamentos;
- Cancelamento de consultas;
- Validação de datas, horários e conflitos de agenda.

---

## Tecnologias utilizadas

| Camada | Tecnologia |
| --- | --- |
| Front-end | HTML5, CSS3 e JavaScript |
| Back-end | Node.js e Express |
| Banco de dados | SQLite |
| Acesso ao banco | better-sqlite3 |
| Proteção de senhas | bcryptjs |
| Comunicação | API REST |

A interface foi desenvolvida seguindo uma abordagem **mobile first**, com foco em simplicidade e facilidade de navegação.

---

## Como executar o projeto

### Pré-requisito

É necessário possuir **Node.js 22 LTS ou superior** instalado.

O projeto utiliza o pacote `better-sqlite3`. Em alguns ambientes Windows, o processo padrão de instalação pode tentar compilar o pacote localmente por meio do `node-gyp`, exigindo ferramentas adicionais de desenvolvimento.

Para evitar essa compilação desnecessária no ambiente de demonstração, recomenda-se utilizar o comando `npm ci --ignore-scripts`, que instala exatamente as versões registradas no arquivo `package-lock.json` sem executar scripts adicionais de instalação.

### 1. Acesse a pasta do back-end

```bash
cd backend
```

### 2. Instale as dependências

```bash
npm ci --ignore-scripts
```

### 3. Inicie a aplicação

```bash
npm start
```

### 4. Abra o sistema no navegador

```text
http://localhost:8080
```

---

## Usuário de demonstração

Para facilitar a avaliação do MVP, existe um usuário de teste previamente cadastrado:

| Campo | Valor |
| --- | --- |
| E-mail | `maria@email.com` |
| Senha | `123456` |

---

## Estrutura do projeto

```text
PTI-saude-facil/
│
├── backend/
│   ├── src/
│   │   ├── database.js
│   │   ├── repositories.js
│   │   ├── services.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── api.js
│   ├── index.html
│   ├── cadastro.html
│   ├── home.html
│   ├── unidades.html
│   ├── agendamento.html
│   └── historico.html
│
├── .gitignore
└── README.md
```

### Organização do back-end

- `database.js`: criação das tabelas e dados iniciais do banco;
- `repositories.js`: consultas e operações de acesso aos dados;
- `services.js`: regras de negócio da aplicação;
- `server.js`: configuração do servidor e rotas da API REST.

---

## Regras de negócio implementadas

- O login exige e-mail e senha cadastrados;
- As senhas são armazenadas utilizando hash;
- E-mail e CPF não podem ser cadastrados mais de uma vez;
- Não é possível selecionar uma especialidade não oferecida pela unidade escolhida;
- Não é possível agendar consultas em datas ou horários que já tenham passado;
- Não é possível realizar dois agendamentos para a mesma unidade, especialidade, data e horário;
- Não é possível cancelar uma consulta já cancelada;
- Não é possível cancelar uma consulta após a data e o horário do atendimento.

### Regra de conflito de horários

Um horário é considerado ocupado quando já existe um agendamento com a mesma combinação de:

**unidade + especialidade + data + horário**

Especialidades diferentes podem possuir atendimentos no mesmo horário dentro de uma mesma unidade.

---

## Limitações conhecidas do MVP

O Saúde Fácil foi desenvolvido com **escopo acadêmico** e utiliza dados fictícios para demonstração.

Nesta versão:

- A sessão do usuário é mantida no navegador por meio de `sessionStorage`. A autorização individual das requisições ainda não utiliza token ou sessão validada pelo servidor;
- Os horários disponíveis são previamente definidos e ainda não são obtidos de uma agenda dinâmica armazenada no banco;
- As especialidades oferecidas por cada unidade são armazenadas de forma simplificada, sem uma tabela associativa própria.

Esses pontos permanecem como possibilidades de evolução para versões futuras.

---

## Escopo funcional

O MVP implementado concentra-se principalmente na jornada da persona **Maria Aparecida**, representando o cidadão que utiliza o Saúde Fácil para localizar unidades e realizar seus próprios agendamentos.

Os fluxos relacionados a familiares, dependentes e profissionais das unidades também foram considerados nas personas e nos protótipos do projeto, permanecendo como possibilidades de evolução da solução.

---

## Projeto Integrador

Projeto desenvolvido para a disciplina **Projeto Integrador: Análise de Soluções Integradas para Organizações**, do curso de Tecnologia em Análise e Desenvolvimento de Sistemas — Centro Universitário Senac.

**Professor orientador:** Anderson Clayton Garcia Lopes  
**Ano:** 2026

### Integrantes

- Leonardo Amaral de Souza
- Ingrid Franco de Oliveira
- Vinicius Gabriel Varone
- Victor Mendes Ferreira Mello
- Gabriel Strolego Queiroz
- Mauricio Zarpelon Antunes dos Santos
