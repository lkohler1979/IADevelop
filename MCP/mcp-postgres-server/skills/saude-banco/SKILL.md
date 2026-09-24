---
name: saude-banco
description: Verifica a saude operacional do PostgreSQL via MCP. Checa conexoes ativas, locks, transacoes longas, tamanho do banco e bloat. Use quando pedirem status, saude, conexoes, travamentos ou diagnostico geral do servidor.
---

# Saude do banco

Objetivo: dar um retrato rapido do estado operacional do servidor PostgreSQL.

## Verificacoes (via `query`, somente leitura)

1. Conexoes ativas por estado:
   `SELECT state, count(*) FROM pg_stat_activity GROUP BY state ORDER BY 2 DESC`
2. Transacoes/queries longas em andamento:
   `SELECT pid, state, now() - query_start AS duracao, left(query, 100) AS query FROM pg_stat_activity WHERE state <> 'idle' ORDER BY duracao DESC LIMIT 20`
3. Locks que estao bloqueando outros:
   `SELECT blocked.pid AS bloqueado, blocking.pid AS bloqueador FROM pg_locks bl JOIN pg_stat_activity blocked ON blocked.pid = bl.pid JOIN pg_locks kl ON kl.locktype = bl.locktype AND kl.granted JOIN pg_stat_activity blocking ON blocking.pid = kl.pid WHERE NOT bl.granted LIMIT 20`
4. Tamanho do banco:
   `SELECT pg_size_pretty(pg_database_size(current_database()))`

## Como reportar

- Resuma em verde/amarelo/vermelho: conexoes ok, alguma transacao longa, locks bloqueando.
- Se houver query travando outras, mostre o PID e a query, mas NAO mate processos automaticamente.
- Esta skill e somente leitura. Qualquer acao corretiva passa pela skill `edicao-segura` com confirmacao do usuario.
