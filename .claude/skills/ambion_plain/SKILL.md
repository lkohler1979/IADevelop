---
name: ambion_plain
description: Planning conversation for a new AMBION change, before any PRD or code exists. Grounds the discussion in AMBION's domain map (CONTEXT-MAP.md / docs/agents/domain.md) and, when it exists, the project constitution (docs/agents/constituicao.md, from ambion_constituir), and saves goal, scope, deliverable epics, rules, and files as a planning doc under docs/<feature>/. Trigger when the user wants to plan or scope a new AMBION feature/change, is about to start a new branch for AMBION work, or invokes /ambion_plain.
---

# ambion_plain — Planejamento de atividade AMBION

Segunda etapa da cadeia `ambion_constituir` → `ambion_plain` → `ambion_spec` → `ambion_techspec` → `ambion_task` → `ambion_execute` → `ambion_review`. Esta skill não escreve PRD nem código — só conduz a conversa de planejamento, grava o resultado e aciona a próxima etapa.

## Passos

0. **Checar a constituição do projeto.** Procure `docs/agents/constituicao.md`. Se não existir, avise o usuário que os padrões do projeto (frameworks, qualidade, testes, banco de dados, arquitetura, premissas inegociáveis) ainda não foram definidos e pergunte se quer rodar `ambion_constituir` primeiro (recomendado) ou seguir sem ela por enquanto. Se existir, leia-a — as premissas inegociáveis (seção 8) e o papel dos agentes especializados (seção 7) valem para todo o planejamento a seguir.
1. **Nome da feature.** Pergunte ao usuário o nome da feature/atividade (não deduza da branch). Gere um slug kebab-case (minúsculo, sem acento, sem espaço) — esse slug nomeia a pasta `docs/<feature>/` e o arquivo `<feature>-planejamento.md`. Confirme o slug com o usuário antes de seguir.
2. **Branch (referência).** Rode `git rev-parse --abbrev-ref HEAD` só para registrar no cabeçalho do documento; não é mais usado para nomear pastas/arquivos.
3. **Ancorar no mapa de domínios.** Leia `CONTEXT-MAP.md` (raiz do projeto) e `docs/agents/domain.md` para listar os domínios/serviços existentes (hoje: `aermod`, `api`, `app`, `estatistica`, `integrador`, `iqar`, `migris`, `mqtt-server`). Pergunte ao usuário quais domínios a atividade deve afetar. Se não estiver óbvio, leia o `CONTEXT.md` do(s) domínio(s) candidato(s) antes de perguntar — proponha com base no que o domínio realmente faz, não por suposição.
4. **Conduzir o planejamento, uma pergunta por vez**, até cobrir:
   - **Objetivo** — o quê e por quê.
   - **Escopo** — o que entra e o que fica de fora.
   - **Domínios/repositórios afetados** — confirmados contra o mapa do passo 3.
   - **Épicos entregáveis** — quebre o objetivo em incrementos pequenos e independentemente entregáveis (`epico-01-nome`, `epico-02-nome`, ...). Cada épico deve poder ser testado/demonstrado sozinho. Para cada épico, anote quais camadas técnicas ele deve tocar: `api`, `app` e/ou `scripts` (essa é a classificação usada nas próximas etapas — não confundir com os domínios do passo 3, que continuam servindo de contexto de domínio dentro de cada camada).
   - **Regras e restrições** — regras de negócio, requisitos não-funcionais, segurança/compliance. Se uma regra de negócio ficar ambígua e a constituição/domínio não resolverem, considere acionar o agente `ambion-analista-negocio` antes de assumir uma interpretação.
   - **Arquivos/módulos conhecidos** — o que já se sabe que será tocado, e o que ainda precisa de investigação.
   - **Pontos em aberto** — perguntas/decisões que precisam de validação antes de implementar.
   Não avance para o registro final enquanto o usuário não confirmar, explicitamente, que o plano está completo.
5. **Gravar o plano** em `docs/<feature>/<feature>-planejamento.md` (crie a pasta se não existir). Estruture o arquivo com as sete seções do passo 4 (incluindo a lista de épicos com suas camadas).
6. **Acionar a próxima etapa.** Depois que o usuário confirmar que o plano está completo, invoque a skill `ambion_spec` (via `Skill`) para gerar os PRDs por épico/camada a partir deste plano — não é preciso pedir confirmação adicional para esse acionamento, ele é parte do fluxo.

## Critério de conclusão

`docs/<feature>/<feature>-planejamento.md` existe, cobre as sete seções do passo 4 (incluindo épicos entregáveis e suas camadas), o usuário confirmou explicitamente que não falta nada, e a skill `ambion_spec` foi acionada em seguida.
