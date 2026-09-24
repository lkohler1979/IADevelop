---
name: ambion_spec
description: Generates small, sequentially numbered PRDs (PRD001, PRD002, ...) per deliverable epic of an AMBION feature, from a completed ambion_plain planning doc, plus a single feature-wide STAGE.md tracking every epic. Each PRD lives directly in its epic folder and references concrete files by layer prefix (api/..., app/..., scripts/...). Trigger when the user asks to write the PRD or spec for a planned AMBION activity, or invokes /ambion_spec.
---

# ambion_spec — Especificação (PRD) da atividade AMBION

Terceira etapa da cadeia `ambion_constituir` → `ambion_plain` → `ambion_spec` → `ambion_task` → `ambion_execute` → `ambion_review`. Consome o planejamento já salvo; não inventa escopo novo.

Se `docs/agents/constituicao.md` existir, leia-a antes de fatiar os épicos — a seção "Banco de dados" e as premissas inegociáveis (seção 8) podem obrigar uma fatia separada de revisão de schema. Toda fatia que crie ou altere tabela/coluna/índice/migration deve acionar o agente `ambion-analista-bd` antes de o PRD ser fechado (referencie essa revisão na seção "Pontos a validar antes de codar esta fatia").

**Por que PRDs pequenos e numerados, e não um PRD único por épico:** um PRD grande obriga qualquer tarefa futura (gerar tasks, executar código) a carregar o documento inteiro na janela de contexto. Quebrando em fatias pequenas (`PRD001`, `PRD002`, ...) e mantendo o contexto compartilhado (objetivo geral, contrato de dados, status de cada épico) em um único `STAGE.md` enxuto na raiz da feature, cada etapa futura só precisa ler a fatia atual + o `STAGE.md` — não o histórico inteiro.

**Não há subpasta por camada.** `api`, `app` e `scripts` **não** são pastas de documentação — são apenas o prefixo usado dentro de cada PRD/TASK para apontar o caminho real do arquivo no repositório (ex.: `api/src/models/Peca.ts`, `app/src/pages/PecaForm.tsx`). Os documentos (`PRD00N.md`, `TASK00N.md`) ficam todos direto em `docs/<feature>/<epico>/`, independente de quantas camadas a fatia toque.

## Passos

1. Localize `docs/<feature>/<feature>-planejamento.md`. Se não existir, pare e diga ao usuário para rodar `ambion_plain` primeiro.
2. Releia a lista de **épicos entregáveis** do planejamento e confirme com o usuário (nome e camadas — `api`, `app`, `scripts` — de cada um). Para cada épico, crie a pasta `docs/<feature>/<epico>/` (sem subpastas de camada).
3. Para cada épico, use o mapa de domínios (`CONTEXT-MAP.md`) e o(s) `CONTEXT.md` relevante(s) para pensar o plano de implementação como uma sequência de **fatias pequenas e independentes** (ex.: "modelo + endpoints da api", "tela + formulário do app", "script de migração") — cada fatia vira um arquivo `docs/<feature>/<epico>/PRD00N.md` (numeração com 3 dígitos, começando em `001`, sequencial dentro do épico, cruzando camadas), seguindo [PRD_SLICE_TEMPLATE.md](PRD_SLICE_TEMPLATE.md). Prefira uma fatia por camada (uma PRD só de `api`, outra só de `app`) para manter o incremento pequeno e testável; só combine camadas na mesma fatia quando elas forem indissociáveis (ex.: script que já nasce chamando um endpoint novo). Todo caminho de arquivo citado na fatia leva o prefixo da camada (`api/...`, `app/...`, `scripts/...`).
4. **Referencie fatias irmãs.** Sempre que uma fatia depender de, ou for consumida por, outra fatia do mesmo épico em camada diferente (ex.: `PRD002.md` do app consome o endpoint definido em `PRD001.md` da api), preencha a seção "PRDs relacionados neste épico" de cada uma apontando para a outra pelo número (`PRD00N.md`) — nunca deixe essa dependência implícita.
5. Crie **um único** `docs/<feature>/STAGE.md` para a feature inteira (não um por épico), seguindo [STAGE_TEMPLATE.md](STAGE_TEMPLATE.md), com:
   - Objetivo geral da atividade (estável, não muda entre épicos/fatias).
   - Contrato de dados/interface compartilhado entre camadas/épicos, quando aplicável.
   - Uma linha por épico na tabela "Épicos", com suas camadas, status e a próxima etapa (`PRD00N` ou `TASK00N`) dentro daquele épico.
6. Antes de propor arquivos/classes novos em qualquer fatia, verifique se algum tipo/fluxo irmão já existente no domínio resolve um problema parecido — isso vai na seção "Estratégia de reaproveitamento" da fatia correspondente, não pode ser omitido nem respondido com "nenhum" por padrão.
7. Liste para o usuário os PRDs gerados por épico e o `STAGE.md`, e peça revisão explícita.
8. **Acionar a próxima etapa.** Depois que o usuário revisar e confirmar, invoque a skill `ambion_task` (via `Skill`) para gerar as tarefas de execução a partir destes PRDs.

## Critério de conclusão

Cada épico confirmado no planejamento tem sua pasta `docs/<feature>/<epico>/` com `PRD001.md` em diante, sem subpastas por camada, cada fatia indicando sua(s) camada(s) e caminhos de arquivo prefixados (`api/...`, `app/...`, `scripts/...`); `docs/<feature>/STAGE.md` existe com uma linha por épico; dependências entre fatias de camadas diferentes de um mesmo épico estão referenciadas pelo número do PRD; o usuário revisou explicitamente; e a skill `ambion_task` foi acionada em seguida.
