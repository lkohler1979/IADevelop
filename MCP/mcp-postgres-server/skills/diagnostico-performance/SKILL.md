---
name: diagnostico-performance
description: Analisa a performance do PostgreSQL via MCP. Identifica tabelas sem indice, indices nao utilizados, sequencial scans frequentes e candidatos a otimizacao usando as views pg_stat. Use quando pedirem analise de lentidao, indices ou otimizacao.
---

# Diagnostico de performance

Objetivo: apontar gargalos e oportunidades de otimizacao usando os catalogos de estatistica do PostgreSQL.

## O que investigar (via `query`, somente leitura)

1. Tabelas com muitos sequential scans:
   `SELECT relname, seq_scan, idx_scan, n_live_tup FROM pg_stat_user_tables ORDER BY seq_scan DESC LIMIT 20`
2. Indices nunca usados:
   `SELECT relname, indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0 ORDER BY relname`
3. Tabelas grandes sem indice alem da PK: cruze `list_tables` (tamanho) com `describe_table` (indices).
4. Tamanho de indices vs tabela para detectar bloat:
   `SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 20`

## Como reportar

- Liste achados por impacto provavel: tabela, sintoma, e recomendacao (criar indice em coluna X, revisar query, etc.).
- Sugira o `CREATE INDEX`, mas NAO o execute. Apresente o comando e deixe o usuario decidir (use a skill `edicao-segura` para aplicar).
- Deixe claro que sao indicios estatisticos, nao garantias.
