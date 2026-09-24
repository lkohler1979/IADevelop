---
name: relatorio
description: Monta relatorios a partir dos dados do PostgreSQL via MCP, como faturamento por periodo, contagens e rankings. Formata o resultado em tabela ou resumo. Use quando o usuario pedir um relatorio, resumo ou consolidado dos dados.
---

# Relatorio

Objetivo: transformar um pedido de negocio em um relatorio claro a partir de consultas SQL.

## Passo a passo

1. Entenda o pedido: metrica (faturamento, quantidade, ticket medio), recorte (por mes, cliente, produto) e periodo.
2. Confirme as tabelas e colunas com `describe_table` se houver duvida.
3. Escreva o `SELECT` com a agregacao adequada (`SUM`, `COUNT`, `AVG`, `GROUP BY`, `ORDER BY`). Parametrize datas e filtros em `params`.
4. Chame `query`. Para relatorios consolidados, o `LIMIT` pode ser maior, mas mantenha um teto razoavel.
5. Formate o retorno como tabela Markdown e adicione um pequeno resumo com os destaques (maior, menor, total, tendencia).

## Boas praticas

- Somente leitura: use apenas `query`.
- Mostre o SQL usado, para o usuario poder reaproveitar ou ajustar.
- Em series temporais, ordene por periodo e use formatacao de data legivel.
