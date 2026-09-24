---
name: consultar
description: Converte perguntas em linguagem natural em consultas SELECT seguras no PostgreSQL via MCP e explica os resultados. Use quando o usuario fizer uma pergunta sobre os dados (quantos, quais, total, media, ranking) sem escrever SQL.
---

# Consultar (linguagem natural para SQL)

Objetivo: responder perguntas sobre os dados gerando SELECTs corretos e seguros, e explicando o retorno.

## Passo a passo

1. Identifique as tabelas envolvidas. Se nao tiver certeza da estrutura, chame `describe_table` (ou `list_tables`) antes de escrever o SQL. Nunca adivinhe nomes de coluna.
2. Escreva um `SELECT` parametrizado quando houver valores do usuario, passando-os em `params` (`$1`, `$2`, ...) em vez de concatenar na string.
3. Sempre inclua um `LIMIT` sensato (padrao 100) a menos que o usuario peca uma agregacao total.
4. Chame `query` com o SQL. Se o usuario nao indicar o servidor, use o padrao (`eco`).
5. Explique o resultado em portugues claro: o que a query fez e o que os numeros significam.

## Regras de seguranca

- Esta skill so faz leitura. Nunca use `execute` nem `transaction` aqui.
- Recuse pedidos de escrita educadamente e aponte a skill `edicao-segura`.
- Prefira agregacoes (`COUNT`, `SUM`, `GROUP BY`) a trazer linhas demais.
