---
name: edicao-segura
description: Conduz alteracoes de dados no PostgreSQL via MCP com seguranca. Exige WHERE em updates e deletes, mostra preview antes de aplicar e usa transacao quando ha varios passos. Use quando o usuario pedir para inserir, atualizar, apagar ou rodar DDL.
---

# Edicao segura

Objetivo: aplicar mudancas (`INSERT`, `UPDATE`, `DELETE`, DDL) sem acidentes.

## Passo a passo

1. Confirme o servidor alvo (`list_databases`) e lembre que servidores `readonly` bloqueiam escrita.
2. Antes de qualquer `UPDATE`/`DELETE`, valide o escopo com um `SELECT` equivalente usando `query`: mostre quantas linhas seriam afetadas e quais.
3. Exija `WHERE` em updates e deletes. Se o usuario pedir algo sem `WHERE`, alerte que afeta a tabela toda e peca confirmacao explicita.
4. Para uma unica operacao, chame `execute` com `confirm: true`. Use `params` para os valores.
5. Para varias operacoes interdependentes (ex: transferencia entre contas), use `transaction` com `confirm: true` para garantir ROLLBACK automatico se algo falhar.
6. Apos aplicar, confirme o resultado (linhas afetadas) e, se fizer sentido, rode um `SELECT` de verificacao.

## Regras

- Sempre faca o preview por `SELECT` antes de mutar. Nunca pule essa etapa em massa.
- Nunca use `confirm: true` sem o usuario ter visto e aceitado o impacto.
- Prefira `params` a concatenar valores no SQL.
