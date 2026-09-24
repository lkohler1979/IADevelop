/**
 * MCP Server — PostgreSQL Multi-Servidor
 * Integração com Claude Cowork Desktop
 *
 * Configuração 100% via .env — sem editar código.
 * Adicione servidores declarando PG_SERVERS=nome1,nome2
 * e os blocos PG_<NOME>_HOST, _DATABASE, etc.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import pg from "pg";
import { z } from "zod";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });
// ─── Leitura dinâmica do .env ─────────────────────────────────────────────────
function loadConfigs() {
    const serversRaw = process.env.PG_SERVERS ?? "";
    const names = serversRaw
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
    if (names.length === 0) {
        console.error("⚠️  PG_SERVERS não definido ou vazio. Defina no .env: PG_SERVERS=principal,analytics");
        process.exit(1);
    }
    const configs = [];
    for (const name of names) {
        const get = (field) => process.env[`PG_${name}_${field}`] ?? "";
        const host = get("HOST");
        const database = get("DATABASE");
        const user = get("USER");
        const password = get("PASSWORD");
        // Validação dos campos obrigatórios
        const missing = [];
        if (!host)
            missing.push(`PG_${name}_HOST`);
        if (!database)
            missing.push(`PG_${name}_DATABASE`);
        if (!user)
            missing.push(`PG_${name}_USER`);
        if (!password)
            missing.push(`PG_${name}_PASSWORD`);
        if (missing.length > 0) {
            console.error(`❌ Servidor "${name}" ignorado — variáveis faltando: ${missing.join(", ")}`);
            continue;
        }
        configs.push({
            name: name.toLowerCase(),
            label: get("LABEL") || name.toLowerCase(),
            host,
            port: Number(get("PORT") || 5432),
            database,
            user,
            password,
            ssl: get("SSL").toLowerCase() === "true",
            poolMax: Number(get("POOL_MAX") || 5),
            readonly: get("READONLY").toLowerCase() === "true",
        });
    }
    if (configs.length === 0) {
        console.error("❌ Nenhum servidor configurado corretamente. Verifique o .env.");
        process.exit(1);
    }
    console.error(`✅ Servidores carregados: ${configs.map((c) => `${c.name} (${c.label})`).join(" | ")}`);
    return configs;
}
const DB_CONFIGS = loadConfigs();
const DEFAULT_DB = DB_CONFIGS[0].name;
// ─── Pool manager ─────────────────────────────────────────────────────────────
const pools = new Map();
function getPool(dbName) {
    const key = dbName.toLowerCase();
    if (!pools.has(key)) {
        const cfg = DB_CONFIGS.find((c) => c.name === key);
        if (!cfg) {
            const available = DB_CONFIGS.map((c) => `"${c.name}"`).join(", ");
            throw new Error(`Servidor "${dbName}" não encontrado. Disponíveis: ${available}`);
        }
        const pool = new pg.Pool({
            host: cfg.host,
            port: cfg.port,
            database: cfg.database,
            user: cfg.user,
            password: cfg.password,
            ssl: cfg.ssl ? { rejectUnauthorized: false } : false,
            max: cfg.poolMax,
            idleTimeoutMillis: 30_000,
        });
        pool.on("error", (err) => {
            console.error(`[Pool:${key}] erro:`, err.message);
        });
        pools.set(key, pool);
    }
    return pools.get(key);
}
function getConfig(dbName) {
    const cfg = DB_CONFIGS.find((c) => c.name === dbName.toLowerCase());
    if (!cfg) {
        const available = DB_CONFIGS.map((c) => `"${c.name}"`).join(", ");
        throw new Error(`Servidor "${dbName}" não encontrado. Disponíveis: ${available}`);
    }
    return cfg;
}
// ─── Helpers de formatação ────────────────────────────────────────────────────
function formatRows(rows) {
    if (rows.length === 0)
        return "(nenhum resultado)";
    const cols = Object.keys(rows[0]);
    const widths = cols.map((col) => Math.max(col.length, ...rows.map((r) => String(r[col] ?? "NULL").length)));
    const pad = (s, w) => s.padEnd(w);
    const header = cols.map((c, i) => pad(c, widths[i])).join(" │ ");
    const divider = widths.map((w) => "─".repeat(w)).join("─┼─");
    const body = rows
        .map((r) => cols.map((c, i) => pad(String(r[c] ?? "NULL"), widths[i])).join(" │ "))
        .join("\n");
    return `${header}\n${divider}\n${body}\n\n(${rows.length} linha${rows.length !== 1 ? "s" : ""})`;
}
function serverInfo(cfg) {
    return `${cfg.label} [${cfg.name}] → ${cfg.host}:${cfg.port}/${cfg.database}${cfg.readonly ? " 🔒 somente leitura" : ""}`;
}
// ─── MCP Server ───────────────────────────────────────────────────────────────
const server = new McpServer({
    name: "postgres-server",
    version: "2.0.0",
});
// ── TOOL: list_databases ──────────────────────────────────────────────────────
server.tool("list_databases", "Lista todos os servidores PostgreSQL configurados e disponíveis.", {}, async () => {
    const rows = DB_CONFIGS.map((c, i) => ({
        "#": i === 0 ? "★ padrão" : String(i + 1),
        nome: c.name,
        label: c.label,
        host: c.host,
        porta: c.port,
        banco: c.database,
        usuario: c.user,
        ssl: c.ssl ? "sim" : "não",
        pool_max: c.poolMax,
        readonly: c.readonly ? "🔒 sim" : "não",
    }));
    return {
        content: [{
                type: "text",
                text: `🗄  Servidores PostgreSQL configurados:\n\n${formatRows(rows)}\n\n💡 Use o campo "nome" para selecionar o servidor nas ferramentas.`,
            }],
    };
});
// ── TOOL: query ───────────────────────────────────────────────────────────────
server.tool("query", "Executa SELECT no PostgreSQL. Use list_databases para ver os servidores disponíveis.", {
    sql: z.string().describe("Query SELECT a executar"),
    params: z.array(z.unknown()).optional()
        .describe("Parâmetros para a query ($1, $2, ...)"),
    database: z.string().optional()
        .describe(`Nome do servidor (padrão: "${DEFAULT_DB}"). Use list_databases para ver os disponíveis.`),
    limit: z.number().int().min(1).max(500).optional().default(100)
        .describe("Máximo de linhas retornadas (padrão: 100, max: 500)"),
}, async ({ sql, params = [], database = DEFAULT_DB, limit = 100 }) => {
    const normalized = sql.trim().toUpperCase();
    if (!normalized.startsWith("SELECT") &&
        !normalized.startsWith("WITH") &&
        !normalized.startsWith("EXPLAIN")) {
        return {
            content: [{
                    type: "text",
                    text: "❌ Apenas SELECT, WITH e EXPLAIN são permitidos aqui. Use 'execute' para modificações.",
                }],
        };
    }
    const finalSql = normalized.includes("LIMIT") ? sql : `${sql} LIMIT ${limit}`;
    try {
        const cfg = getConfig(database);
        const pool = getPool(database);
        const result = await pool.query(finalSql, params);
        return {
            content: [{
                    type: "text",
                    text: `✅ Query executada — ${serverInfo(cfg)}\n\n${formatRows(result.rows)}`,
                }],
        };
    }
    catch (err) {
        return { content: [{ type: "text", text: `❌ Erro: ${err instanceof Error ? err.message : err}` }] };
    }
});
// ── TOOL: execute ─────────────────────────────────────────────────────────────
server.tool("execute", "Executa INSERT, UPDATE, DELETE ou DDL no PostgreSQL. Requer confirm: true. Bloqueado em servidores readonly.", {
    sql: z.string().describe("SQL a executar"),
    params: z.array(z.unknown()).optional()
        .describe("Parâmetros ($1, $2, ...)"),
    database: z.string().optional()
        .describe(`Nome do servidor (padrão: "${DEFAULT_DB}")`),
    confirm: z.boolean()
        .describe("Deve ser true para confirmar a execução"),
}, async ({ sql, params = [], database = DEFAULT_DB, confirm }) => {
    if (!confirm) {
        return { content: [{ type: "text", text: "⚠️  Defina confirm: true para executar." }] };
    }
    try {
        const cfg = getConfig(database);
        if (cfg.readonly) {
            return {
                content: [{
                        type: "text",
                        text: `🔒 O servidor "${cfg.label}" está configurado como somente leitura (READONLY=true). Alterações não são permitidas.`,
                    }],
            };
        }
        const pool = getPool(database);
        const result = await pool.query(sql, params);
        return {
            content: [{
                    type: "text",
                    text: `✅ Executado — ${serverInfo(cfg)} | linhas afetadas: ${result.rowCount ?? 0}`,
                }],
        };
    }
    catch (err) {
        return { content: [{ type: "text", text: `❌ Erro: ${err instanceof Error ? err.message : err}` }] };
    }
});
// ── TOOL: list_tables ─────────────────────────────────────────────────────────
server.tool("list_tables", "Lista tabelas e views de um schema, com tamanho em disco.", {
    schema: z.string().optional().default("public")
        .describe("Schema (padrão: public)"),
    database: z.string().optional()
        .describe(`Nome do servidor (padrão: "${DEFAULT_DB}")`),
}, async ({ schema = "public", database = DEFAULT_DB }) => {
    const sql = `
      SELECT
        table_name        AS tabela,
        table_type        AS tipo,
        pg_size_pretty(
          pg_total_relation_size(
            quote_ident(table_schema) || '.' || quote_ident(table_name)
          )
        ) AS tamanho
      FROM information_schema.tables
      WHERE table_schema = $1
        AND table_type IN ('BASE TABLE','VIEW')
      ORDER BY table_type, table_name;
    `;
    try {
        const cfg = getConfig(database);
        const pool = getPool(database);
        const result = await pool.query(sql, [schema]);
        return {
            content: [{
                    type: "text",
                    text: `📋 Tabelas — ${serverInfo(cfg)} | schema: ${schema}\n\n${formatRows(result.rows)}`,
                }],
        };
    }
    catch (err) {
        return { content: [{ type: "text", text: `❌ Erro: ${err instanceof Error ? err.message : err}` }] };
    }
});
// ── TOOL: describe_table ──────────────────────────────────────────────────────
server.tool("describe_table", "Descreve colunas, tipos, PKs, FKs e índices de uma tabela.", {
    table: z.string().describe("Nome da tabela"),
    schema: z.string().optional().default("public")
        .describe("Schema (padrão: public)"),
    database: z.string().optional()
        .describe(`Nome do servidor (padrão: "${DEFAULT_DB}")`),
}, async ({ table, schema = "public", database = DEFAULT_DB }) => {
    const colSql = `
      SELECT
        c.ordinal_position                                   AS "#",
        c.column_name                                        AS coluna,
        c.data_type ||
          COALESCE('(' || c.character_maximum_length || ')', '') AS tipo,
        c.is_nullable                                        AS nullable,
        c.column_default                                     AS default_val,
        CASE WHEN pk.column_name IS NOT NULL THEN '✔ PK' ELSE '' END AS pk,
        CASE WHEN fk.column_name IS NOT NULL THEN '✔ FK' ELSE '' END AS fk
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT kcu.column_name FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = $1 AND tc.table_schema = $2
      ) pk ON pk.column_name = c.column_name
      LEFT JOIN (
        SELECT kcu.column_name FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1 AND tc.table_schema = $2
      ) fk ON fk.column_name = c.column_name
      WHERE c.table_name = $1 AND c.table_schema = $2
      ORDER BY c.ordinal_position;
    `;
    const idxSql = `
      SELECT indexname AS indice, indexdef AS definicao
      FROM pg_indexes
      WHERE tablename = $1 AND schemaname = $2;
    `;
    const fkSql = `
      SELECT
        kcu.column_name           AS coluna,
        ccu.table_name            AS tabela_ref,
        ccu.column_name           AS coluna_ref,
        rc.delete_rule            AS on_delete
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = $1 AND tc.table_schema = $2;
    `;
    try {
        const cfg = getConfig(database);
        const pool = getPool(database);
        const [cols, idxs, fks] = await Promise.all([
            pool.query(colSql, [table, schema]),
            pool.query(idxSql, [table, schema]),
            pool.query(fkSql, [table, schema]),
        ]);
        const parts = [
            `🗂  ${schema}.${table} — ${serverInfo(cfg)}`,
            "",
            "── COLUNAS ──────────────────────────────",
            formatRows(cols.rows),
        ];
        if (fks.rows.length > 0) {
            parts.push("── FOREIGN KEYS ─────────────────────────", formatRows(fks.rows));
        }
        parts.push("── ÍNDICES ──────────────────────────────", formatRows(idxs.rows));
        return { content: [{ type: "text", text: parts.join("\n") }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: `❌ Erro: ${err instanceof Error ? err.message : err}` }] };
    }
});
// ── TOOL: transaction ─────────────────────────────────────────────────────────
server.tool("transaction", "Executa múltiplos SQL em transação ACID. ROLLBACK automático em qualquer erro. Bloqueado em servidores readonly.", {
    statements: z.array(z.object({
        sql: z.string(),
        params: z.array(z.unknown()).optional(),
    })).min(1).describe("Statements a executar em ordem"),
    database: z.string().optional()
        .describe(`Nome do servidor (padrão: "${DEFAULT_DB}")`),
    confirm: z.boolean()
        .describe("Deve ser true para confirmar"),
}, async ({ statements, database = DEFAULT_DB, confirm }) => {
    if (!confirm) {
        return { content: [{ type: "text", text: "⚠️  Defina confirm: true para executar a transação." }] };
    }
    try {
        const cfg = getConfig(database);
        if (cfg.readonly) {
            return {
                content: [{
                        type: "text",
                        text: `🔒 O servidor "${cfg.label}" é somente leitura. Transações de escrita não são permitidas.`,
                    }],
            };
        }
        const pool = getPool(database);
        const client = await pool.connect();
        const results = [];
        try {
            await client.query("BEGIN");
            for (let i = 0; i < statements.length; i++) {
                const { sql, params = [] } = statements[i];
                const r = await client.query(sql, params);
                results.push(`[${i + 1}/${statements.length}] ✅ linhas afetadas: ${r.rowCount ?? 0} — ${sql.slice(0, 60)}...`);
            }
            await client.query("COMMIT");
            return {
                content: [{
                        type: "text",
                        text: `✅ COMMIT — ${serverInfo(cfg)}\n\n${results.join("\n")}`,
                    }],
            };
        }
        catch (err) {
            await client.query("ROLLBACK");
            return {
                content: [{
                        type: "text",
                        text: `❌ ROLLBACK automático — ${serverInfo(cfg)}\nErro: ${err instanceof Error ? err.message : err}\n\nResultados parciais:\n${results.join("\n") || "(nenhum statement concluído)"}`,
                    }],
            };
        }
        finally {
            client.release();
        }
    }
    catch (err) {
        return { content: [{ type: "text", text: `❌ Erro: ${err instanceof Error ? err.message : err}` }] };
    }
});
// ─── Inicialização ────────────────────────────────────────────────────────────
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("✅ MCP PostgreSQL Server v2.0 iniciado");
    console.error(`   Servidor padrão: "${DEFAULT_DB}"`);
}
main().catch((err) => {
    console.error("❌ Erro fatal:", err);
    process.exit(1);
});
