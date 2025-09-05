# Closet Moda Fitness API

API RESTful para o e-commerce Closet Moda Fitness desenvolvida com Node.js, TypeScript, Prisma e PostgreSQL.

## Estrutura do Projeto

```
lojaOn-api/
├── prisma/
│   └── schema.prisma      # Definição do esquema de banco de dados
├── src/
│   ├── controllers/       # Controladores para as operações da API
│   ├── middleware/        # Middlewares para autenticação e tratamento de erros
│   ├── routes/            # Rotas da API
│   ├── scripts/           # Scripts de utilitários (migração de dados)
│   ├── utils/             # Funções e tipos utilitários
│   └── index.ts           # Ponto de entrada da aplicação
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências e scripts
└── tsconfig.json          # Configuração do TypeScript
```

## Requisitos

- Node.js 16+
- PostgreSQL 13+
- MySQL (apenas para migração dos dados)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/closet-modafitness-api.git
cd lojaOn-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env` com suas informações de banco de dados:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/lojaon_db"
JWT_SECRET="sua_chave_secreta_aqui"
```

4. Execute as migrações do Prisma para criar o esquema do banco de dados:

```bash
npm run prisma:migrate
```

## Migração de Dados do MySQL

Para migrar os dados do sistema antigo (PHP/MySQL) para o novo:

1. Configure as variáveis de acesso ao MySQL no arquivo `.env`:

```
MYSQL_HOST="localhost"
MYSQL_USER="seu_usuario"
MYSQL_PASSWORD="sua_senha"
MYSQL_DATABASE="closet_db"
```

2. Execute o script de migração:

```bash
npm run migrate:data
```

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Produção

1. Compile o projeto:

```bash
npm run build
```

2. Inicie o servidor:

```bash
npm start
```

## Rotas da API

### Produtos

- `GET /api/products` - Listar todos os produtos
- `GET /api/products/featured` - Listar produtos em destaque
- `GET /api/products/:id` - Obter produto por ID
- `GET /api/products/:slug` - Obter produto por slug
- `GET /api/products/category/:slug` - Listar produtos por categoria
- `POST /api/products` - Criar novo produto (requer autenticação admin)
- `PUT /api/products/:id` - Atualizar produto (requer autenticação admin)
- `DELETE /api/products/:id` - Excluir produto (requer autenticação admin)

### Categorias

- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/:id` - Obter categoria por ID
- `GET /api/categories/:slug` - Obter categoria por slug
- `POST /api/categories` - Criar nova categoria (requer autenticação admin)
- `PUT /api/categories/:id` - Atualizar categoria (requer autenticação admin)
- `DELETE /api/categories/:id` - Excluir categoria (requer autenticação admin)

### Autenticação

- `POST /api/auth/login` - Autenticar usuário
- `POST /api/auth/register` - Registrar novo usuário (requer autenticação admin)
- `GET /api/auth/verify` - Verificar token JWT (requer autenticação)

## Adaptação do Frontend

Para atualizar o frontend React para utilizar esta nova API:

1. Atualize as URLs de API em seus serviços/fetchers
2. Implemente o fluxo de autenticação usando JWT
3. Atualize os modelos de dados para corresponder às respostas da API

## Implantação

### Configuração do PostgreSQL em Produção

1. Crie um banco de dados PostgreSQL
2. Configure a variável `DATABASE_URL` no `.env` com a URL de conexão
3. Execute as migrações do Prisma:

```bash
npx prisma migrate deploy
```

### Implantação em Servidor

1. Clone o repositório no servidor
2. Configure as variáveis de ambiente
3. Instale as dependências: `npm install --production`
4. Construa o projeto: `npm run build`
5. Inicie o servidor: `npm start` (ou use PM2 para gerenciamento de processos)

## Notas Adicionais

- O sistema utiliza JWT para autenticação
- Endpoints de escrita (POST, PUT, DELETE) são protegidos por autenticação
- Um usuário administrador padrão é criado durante a migração:
  - Email: admin@closetmodafitness.com.br
  - Senha: admin123
