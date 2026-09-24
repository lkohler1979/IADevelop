# PRD00N — <Nome da fatia> — <épico> — <nome da atividade>

> Épico: `<epico-NN-nome>` · Camada(s): `api` e/ou `app` e/ou `scripts` (declare todas as que esta fatia toca) · Domínio(s) AMBION: `<ex.: integrador, iqar>` · Branch: `<nome-da-branch>` · Fatia N de M do épico.
> Contexto compartilhado da atividade inteira (objetivo geral, contrato de dados, status dos épicos) está em `STAGE.md`, na raiz de `docs/<feature>/` — não repita aqui, só referencie.
> Todo caminho de arquivo citado nesta fatia leva o prefixo da camada real no repositório, ex.: `api/src/models/Peca.ts`, `app/src/pages/PecaForm.tsx`, `scripts/migrations/2026xxxx_pecas.sql`.

## 1. Objetivo desta fatia
<O que esta fatia especificamente entrega — um incremento pequeno e testável, não o épico inteiro.>

## 2. PRDs relacionados neste épico
<Outros `PRD00N.md` do mesmo épico (de camada igual ou diferente) que compartilham contrato/dependência com esta fatia (ex.: "PRD002.md (app) consome o endpoint definido aqui"). "Nenhum" se esta fatia for autônoma — não pode ser omitido.>

## 3. Estratégia de reaproveitamento
<O que já existe no domínio (tipo/fluxo irmão) que resolve um problema parecido ao desta fatia? O que herdar/estender vs. o que é novo? Se nada existir, declare isso explicitamente.>

## 4. Plano de implementação desta fatia
<Lista de arquivos/métodos concretos a criar ou alterar, com prefixo de camada em cada caminho (`api/...`, `app/...`, `scripts/...`), só os desta fatia, na ordem de dependência técnica.>

## 5. Fora do escopo desta fatia
<O que fica para uma fatia posterior, outra camada, ou fora da atividade.>

## 6. Pontos a validar antes de codar esta fatia
<Decisões/confirmações bloqueantes específicas desta fatia.>

## 7. Critério de pronto desta fatia
<Como saber que esta fatia está pronta — comportamento observável, teste a rodar, regressão a checar.>
