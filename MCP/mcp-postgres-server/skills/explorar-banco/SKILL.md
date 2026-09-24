---
name: explorar-banco
description: Mapeia o banco PostgreSQL conectado pelo MCP. Lista servidores, tabelas, tamanhos e relacionamentos para dar um panorama geral do schema. Use quando o usuario pedir para conhecer, explorar ou entender a estrutura do banco.
---

# Explorar banco

Objetivo: dar ao usuario um panorama claro do banco PostgreSQL acessado pelo servidor MCP `postgres`.

## Passo a passo

1. Chame `list_databases` para descobrir os servidores configurados. Se o usuario nao indicar um, use o padrao (`eco`).
2. Chame `list_tables` no schema `public` (ou no schema pedido) para obter as tabelas e seus tamanhos em disco.
3. Apresente uma visao geral ordenada por tamanho: nome da tabela, tipo (tabela/view) e tamanho.
4. Se o usuario pedir detalhes de uma tabela, chame `describe_table` para mostrar colunas, tipos, chaves e indices.

## Boas praticas

- Nao despeje todas as tabelas se houver muitas: resuma as maiores e ofereca para detalhar.
- Destaque relacionamentos (FKs) ao descrever tabelas, para o usuario entender como elas se ligam.
- Pergunte qual servidor usar somente se houver mais de um configurado e a escolha nao for obvia.
