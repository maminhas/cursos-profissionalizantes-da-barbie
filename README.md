# Salão da Barbie

Site de curso profissionalizante temático do universo Barbie, com catálogo de cursos, cadastro de alunos e gerenciamento de matrículas.

## Tecnologias

- Next.js App Router
- React + TypeScript
- CSS puro
- MySQL + mysql2
- SQL parametrizado em rotas de API

## Requisitos

- Node.js 20.9+ (recomendado)
- MySQL local já configurado no ambiente
- phpMyAdmin acessível em `http://localhost`
- npm

## Configuração local

1. Verifique no phpMyAdmin que o banco `db_augusto` já existe.
2. Caso ele exista, use esse banco sem criar outro.
3. Ajuste o arquivo `.env.local` na raiz do projeto com sua senha real do MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_real
DB_NAME=db_augusto
```

> Não suba esse arquivo para o GitHub. Ele fica apenas no ambiente local.

4. Execute o script em `database/schema.sql` no phpMyAdmin ou em um cliente MySQL conectado ao banco `db_augusto`.

O script usa `CREATE TABLE IF NOT EXISTS` e `INSERT ... ON DUPLICATE KEY UPDATE`, de forma que ele não apaga nem altera tabelas já existentes.

## Execução do projeto

```bash
npm install
npx tsc --noEmit
npm run dev
```

Acesse http://localhost:3000

## Estrutura do banco

As tabelas esperadas no banco `db_augusto` são:

- `alunos` com `id`, `nome` e `idade`
- `cursos` com `id`, `nome`, `duracao`, `descricao`, `categoria` e `valor`
- `matriculas` com relacionamento via `aluno_id` e `curso_id`

## Rotas da API

- `GET /api/alunos` - lista alunos
- `POST /api/alunos` - cadastra aluno
- `PUT /api/alunos` - atualiza aluno
- `DELETE /api/alunos` - exclui aluno
- `GET /api/cursos` - lista cursos
- `GET /api/matriculas` - lista matrículas
- `POST /api/matriculas` - cria matrícula

## Personagens usados como exemplos

- Barbie
- Ken
- Rapunzel
- Tiana
- Velvet

## Observação

O projeto foi desenvolvido para fins escolares e utiliza conexão direta ao MySQL sem ORM.
