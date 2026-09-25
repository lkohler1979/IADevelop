---
name: ambion_spec
description: Generates small, sequentially numbered PRDs (PRD001, PRD002, ...) per deliverable epic of an AMBION feature, from a completed ambion_plain planning doc, plus a single feature-wide STAGE.md tracking every epic. Each PRD covers business rules and UX only (objective, personas/target audience, scope in/out, success criteria, macro user stories) for one small increment — no architecture or implementation detail. Trigger when the user asks to write the PRD or business spec for a planned AMBION activity, or invokes /ambion_spec.
---

# ambion_spec — PRD (negócio/UX) da atividade AMBION

Terceira etapa da cadeia `ambion_constituir` → `ambion_plain` → `ambion_spec` → `ambion_techspec` → `ambion_task` → `ambion_execute` → `ambion_review`. Consome o planejamento já salvo; não inventa escopo novo.

**Esta skill só cobre negócio e experiência do usuário.** Arquitetura, modelagem de banco, design de API e requisitos de segurança são responsabilidade da etapa seguinte, `ambion_techspec` — não antecipe nenhum desses assuntos aqui, mesmo que pareçam óbvios. Se durante a conversa surgir uma decisão técnica, anote como pendência para `ambion_techspec` em vez de resolver.

**Por que PRDs pequenos e numerados, e não um PRD único por épico:** um PRD grande obriga qualquer tarefa futura (gerar tech spec, tarefas, executar código) a carregar o documento inteiro na janela de contexto. Quebrando em fatias pequenas (`PRD001`, `PRD002`, ...) e mantendo o contexto compartilhado (objetivo geral, contrato de dados, status de cada épico) em um único `STAGE.md` enxuto na raiz da feature, cada etapa futura só precisa ler a fatia atual + o `STAGE.md` — não o histórico inteiro.

**Não há subpasta por camada.** `api`, `app` e `scripts` **não** são pastas de documentação — são apenas o prefixo usado dentro de cada PRD/SPEC/TASK para apontar o caminho real do arquivo no repositório (ex.: `api/src/models/Peca.ts`, `app/src/pages/PecaForm.tsx`). Os documentos (`PRD00N.md`, `SPEC00N.md`, `TASK00N.md`) ficam todos direto em `docs/<feature>/<epico>/`, independente de quantas camadas a fatia toque.

## Passos

1. Localize `docs/<feature>/<feature>-planejamento.md`. Se não existir, pare e diga ao usuário para rodar `ambion_plain` primeiro.
2. Releia a lista de **épicos entregáveis** do planejamento e confirme com o usuário (nome e camadas — `api`, `app`, `scripts` — de cada um). Para cada épico, crie a pasta `docs/<feature>/<epico>/` (sem subpastas de camada).
3. Para cada épico, pense o incremento de negócio como uma sequência de **fatias pequenas e independentes do ponto de vista do usuário/negócio** (ex.: "usuário consegue cadastrar peça", "gestor consegue ver relatório de manutenção") — cada fatia vira um arquivo `docs/<feature>/<epico>/PRD00N.md` (numeração com 3 dígitos, começando em `001`, sequencial dentro do épico, cruzando camadas), seguindo [PRD_SLICE_TEMPLATE.md](PRD_SLICE_TEMPLATE.md), com o badge de status inicial `📝 rascunho`. O fatiamento por camada técnica (uma fatia só de `api`, outra só de `app`) é decidido em `ambion_techspec`, não aqui — o PRD descreve o incremento de negócio, mesmo que ele exija mais de uma camada para existir de verdade.
4. **Referencie fatias irmãs.** Sempre que uma fatia depender de, ou for consumida por, outra fatia do mesmo épico (ex.: "PRD002.md" pressupõe que o cadastro de "PRD001.md" já exista), preencha a seção "PRDs relacionados neste épico" de cada uma apontando para a outra pelo número (`PRD00N.md`) — nunca deixe essa dependência implícita.
5. Crie **um único** `docs/<feature>/STAGE.md` para a feature inteira (não um por épico), seguindo [STAGE_TEMPLATE.md](STAGE_TEMPLATE.md), com:
   - Objetivo geral da atividade (estável, não muda entre épicos/fatias).
   - Uma linha por épico na tabela "Épicos", com suas camadas, status em ícone (`⏳ não iniciado` por padrão neste momento), a próxima etapa (`PRD00N`, `SPEC00N` ou `TASK00N`) e as colunas "Tempo gasto"/"Tokens" com `—` (ainda não há execução).
   - Deixe o "Contrato de dados/interface" vazio ou com nota "a preencher em ambion_techspec" — essa seção é técnica e será populada na próxima etapa.
6. Se uma regra de negócio ficar ambígua e a constituição/domínio não resolverem, considere acionar o agente `ambion-analista-negocio` antes de assumir uma interpretação.
7. Antes de listar para o usuário, mude o badge de cada PRD apresentado de `📝 rascunho` para `👀 em revisão`. Liste os PRDs gerados por épico e o `STAGE.md`, e peça revisão explícita.
8. **Acionar a próxima etapa.** Depois que o usuário revisar e confirmar, mude o badge de cada PRD confirmado para `✅ aprovado` e invoque a skill `ambion_techspec` (via `Skill`) para gerar a especificação técnica de cada fatia a partir destes PRDs.

## Critério de conclusão

Cada épico confirmado no planejamento tem sua pasta `docs/<feature>/<epico>/` com `PRD001.md` em diante, cada fatia descrevendo objetivo de negócio, público-alvo/persona (quando fizer diferença), escopo dentro/fora, user stories macro e critério de sucesso observável — sem arquitetura, banco de dados, API ou segurança; `docs/<feature>/STAGE.md` existe com uma linha por épico; dependências entre fatias do mesmo épico estão referenciadas pelo número do PRD; o usuário revisou explicitamente; e a skill `ambion_techspec` foi acionada em seguida.
