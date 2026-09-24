# MCP Server PostgreSQL — Claude Cowork Desktop
Guia completo de instalação, configuração e uso

---

## Arquitetura

```
Claude Cowork Desktop
        │
        │  stdio (stdin/stdout)
        ▼
MCP PostgreSQL Server  (Node.js / TypeScript)
        │
        │  pg Pool
        ├──▶ Banco "principal"    (localhost:5432)
        └──▶ Banco "analytics"   (analytics-server:5432)
```

O Claude Cowork inicia o servidor como processo filho e se comunica
via stdin/stdout. Nenhuma porta de rede é aberta pelo servidor MCP.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar com        |
|------------|---------------|----------------------|
| Node.js    | 18.x          | `node --version`     |
| npm        | 9.x           | `npm --version`      |
| PostgreSQL | 13+           | qualquer versão      |

---

## 1. Criar a estrutura do projeto

```bash
mkdir mcp-postgres-server
cd mcp-postgres-server
```

### package.json
```json
{
  "name": "mcp-postgres-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/pg": "^8.11.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "tsx": "^4.6.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

---

## 2. Instalar dependências e compilar

```bash
npm install
npm run build
```

---

## 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=meu_banco
PG_USER=meu_usuario
PG_PASSWORD=minha_senha
PG_SSL=false
```

> **Nunca comite o arquivo `.env` no Git!**
> Adicione ao `.gitignore`:
> ```
> .env
> dist/
> node_modules/
> ```

---

## 4. Registrar no Claude Cowork Desktop

No Claude Cowork Desktop, abra **Configurações → MCP Servers → Add Server**
e insira o JSON abaixo (ajuste o caminho):

```json
{
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["/caminho/absoluto/mcp-postgres-server/dist/index.js"],
      "env": {
        "PG_HOST": "localhost",
        "PG_PORT": "5432",
        "PG_DATABASE": "meu_banco",
        "PG_USER": "meu_usuario",
        "PG_PASSWORD": "minha_senha",
        "PG_SSL": "false"
      }
    }
  }
}
```

> **Alternativa com .env:** se preferir manter as senhas no arquivo `.env`,
> omita o bloco `"env"` e certifique-se que o `.env` está na raiz do projeto.

---

## 5. Ferramentas disponíveis após conectar

### `query` — SELECT
Executa queries de leitura. Aceita parâmetros e limita automaticamente a 100 linhas.

**Exemplo de uso no chat:**
> "Liste os 10 clientes com mais pedidos"
> "Mostre o faturamento por mês em 2024"

```
sql: "SELECT cliente_id, COUNT(*) as total FROM pedidos GROUP BY 1 ORDER BY 2 DESC"
database: "principal"   ← opcional
limit: 10
```

---

### `execute` — INSERT / UPDATE / DELETE / DDL
Exige `confirm: true` como proteção contra acidentes.

**Exemplo:**
> "Atualize o status dos pedidos vencidos para 'cancelado'"

```
sql: "UPDATE pedidos SET status = 'cancelado' WHERE vencimento < NOW() AND status = 'pendente'"
confirm: true
```

---

### `list_tables` — catálogo de tabelas
> "Quais tabelas existem no banco de analytics?"

```
schema: "public"
database: "analytics"
```

---

### `describe_table` — estrutura da tabela
> "Como é a estrutura da tabela de pedidos?"

```
table: "pedidos"
schema: "public"
```

Retorna: colunas, tipos, nullable, PK, índices.

---

### `list_databases` — bancos configurados
> "Quais bancos estão disponíveis?"

Lista todos os bancos configurados no servidor MCP.

---

### `transaction` — transação atômica
Executa múltiplos statements em ACID — faz ROLLBACK automático se qualquer um falhar.

**Exemplo:**
> "Transfira R$500 da conta 1 para a conta 2"

```json
{
  "statements": [
    { "sql": "UPDATE contas SET saldo = saldo - $1 WHERE id = $2", "params": [500, 1] },
    { "sql": "UPDATE contas SET saldo = saldo + $1 WHERE id = $2", "params": [500, 2] }
  ],
  "confirm": true
}
```

---

## 6. Suporte a múltiplos bancos

Para adicionar um segundo banco, edite `src/index.ts` e adicione ao array `DB_CONFIGS`:

```typescript
{
  name: "analytics",
  host: process.env.PG_ANALYTICS_HOST ?? "analytics.servidor.com",
  port: 5432,
  database: "analytics_db",
  user: process.env.PG_ANALYTICS_USER ?? "readonly",
  password: process.env.PG_ANALYTICS_PASSWORD ?? "",
  ssl: true,
}
```

Depois: `npm run build` e reinicie o servidor no Cowork.

---

## 7. Banco remoto (VPN / SSH Tunnel)

### Via SSH Tunnel (recomendado para produção)

```bash
# Cria túnel: porta local 5433 → servidor remoto:5432
ssh -L 5433:localhost:5432 usuario@seu-servidor.com -N &

# No .env, aponte para o túnel local:
PG_HOST=localhost
PG_PORT=5433
```

### Via conexão direta com SSL

```env
PG_HOST=db.seu-servidor.com
PG_PORT=5432
PG_SSL=true
```

---

## 8. Permissões recomendadas (PostgreSQL)

Crie um usuário dedicado ao MCP com apenas as permissões necessárias:

```sql
-- Cria usuário com senha
CREATE USER mcp_claude WITH PASSWORD 'senha_segura';

-- Permissões de leitura
GRANT CONNECT ON DATABASE meu_banco TO mcp_claude;
GRANT USAGE ON SCHEMA public TO mcp_claude;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_claude;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO mcp_claude;

-- Permissões de escrita (só se necessário)
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mcp_claude;
```

---

## 9. Resolução de problemas

| Sintoma | Causa provável | Solução |
|---------|---------------|---------|
| "banco não configurado" | nome errado na chamada | use `list_databases` para ver os nomes |
| "connection refused" | PostgreSQL fora do ar ou porta errada | verifique `PG_HOST` e `PG_PORT` |
| "password authentication failed" | credenciais erradas | revise o `.env` |
| "SSL off" em servidor remoto | SSL desativado | defina `PG_SSL=true` |
| Servidor não aparece no Cowork | caminho do `dist/index.js` errado | use caminho absoluto no JSON |

---

## 10. Estrutura de arquivos final

```
mcp-postgres-server/
├── src/
│   └── index.ts          ← servidor MCP principal
├── dist/                 ← gerado pelo build (não editar)
│   └── index.js
├── .env                  ← suas credenciais (não commitar)
├── .env.example          ← template público
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Links úteis

- MCP SDK: https://github.com/modelcontextprotocol/typescript-sdk
- MCP Spec: https://modelcontextprotocol.io/docs
- pg (driver): https://node-postgres.com
- Claude Cowork: https://support.claude.com
