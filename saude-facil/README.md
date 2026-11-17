# Saúde Fácil – MVP

Aplicação web de agendamento de consultas em unidades de saúde pública.

## Como rodar localmente

```bash
cd backend
npm install
npm start
```

Acesse http://localhost:8080 no navegador.

Login de teste já pré-preenchido:
- E-mail: maria@email.com
- Senha: 123456

## Stack

- **Front-end:** HTML5, CSS3 e JavaScript puro (mobile first)
- **Back-end:** Node.js + Express
- **Banco de dados:** SQLite (better-sqlite3)

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

## Como subir para o GitHub (passo a passo)

1. Crie uma conta em https://github.com (se ainda não tiver).
2. No GitHub, clique em "New repository", dê um nome (ex: `saude-facil`) e deixe como **público** (ou privado, se preferir, mas aí precisa adicionar o professor como colaborador).
3. No seu computador, dentro da pasta `saude-facil` (a que está neste zip), rode:
   ```bash
   git init
   git add .
   git commit -m "MVP Saúde Fácil - 2a entrega"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/saude-facil.git
   git push -u origin main
   ```
4. Copie o link do repositório (ex: `https://github.com/SEU_USUARIO/saude-facil`) e cole na seção 5.3 do documento, no lugar de `[link do repositório GitHub – a inserir]`.
