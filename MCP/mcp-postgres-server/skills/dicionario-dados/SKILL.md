---
name: dicionario-dados
description: Gera um dicionario de dados em Markdown a partir do schema do PostgreSQL via MCP. Documenta colunas, tipos, nulabilidade, chaves e indices de uma tabela ou de um schema inteiro. Use quando pedirem documentacao, dicionario de dados ou descricao do banco.
---

# Dicionario de dados

Objetivo: produzir documentacao legivel do schema, pronta para colar em wiki ou README.

## Passo a passo

1. Se o alvo for o schema inteiro, chame `list_tables` para obter a lista. Se for uma tabela especifica, pule para o passo 2.
2. Para cada tabela, chame `describe_table` e colete colunas, tipos, nulabilidade, chave primaria, chaves estrangeiras e indices.
3. Monte uma secao por tabela em Markdown, com uma tabela de colunas: Coluna | Tipo | Nulo | Chave | Observacao.
4. No fim, liste os relacionamentos entre tabelas (FKs) como um indice de ligacoes.

## Boas praticas

- Use apenas leitura (`describe_table` e, se precisar, `query` em catalogos). Nunca chame `execute`.
- Em schemas grandes, gere por partes e confirme com o usuario antes de processar tudo.
- Inclua o tamanho de cada tabela quando relevante (vem do `list_tables`).
