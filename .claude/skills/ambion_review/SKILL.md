---
name: ambion_review
description: Reviews an AMBION feature end to end after ambion_execute — checks every epic/layer implementation against its PRD's "Critério de pronto", confirms STAGE.md and TASK checkboxes match reality, and runs the repo's code-review skill against the diff. Trigger when execution of a planned AMBION activity just finished, the user asks for a full review of a feature, or invokes /ambion_review.
---

# ambion_review — Review da atividade AMBION

Sétima e última etapa da cadeia `ambion_constituir` → `ambion_plain` → `ambion_spec` → `ambion_techspec` → `ambion_task` → `ambion_execute` → `ambion_review`. Só leitura e relatório — não corrige código sozinha, só reporta e, se o usuário pedir, aplica correções pontuais.

Se `docs/agents/constituicao.md` existir, trate as premissas inegociáveis (seção 8) como categoria própria no relatório: qualquer violação delas é bloqueio automático, não um achado negociável como os demais.

## Passos

1. Leia `docs/<feature>/STAGE.md`. Se algum épico não estiver marcado como `concluído`, avise o usuário e pergunte se quer revisar mesmo assim (parcial) ou esperar `ambion_execute` terminar.
2. **Conformidade com o spec, por fatia.** Para cada épico, para cada `PRD00N.md` com `SPEC00N.md` e `TASK00N.md` correspondentes (todos na mesma pasta `docs/<feature>/<epico>/`):
   - Confira se todos os checkboxes de "Implementação" e "Validação" do `TASK00N.md` estão marcados.
   - Releia "Critério de sucesso desta fatia" do `PRD00N.md` (comportamento observável) e "Critério de pronto técnico desta fatia" do `SPEC00N.md` (contrato/schema/segurança), e verifique, no código atual (nos caminhos com prefixo de camada indicados na fatia), se cada critério realmente se sustenta (não confie só nos checkboxes marcados — leia o código/teste correspondente).
   - Se a fatia tinha "SPECs relacionados neste épico", confirme que o contrato entre as camadas foi respeitado de fato (ex.: o payload que a fatia `app` consome bate com o que a fatia `api` implementou no design de API do `SPEC00N.md`).
3. **Revisão de qualidade do código.** Rode a skill `code-review` (via `Skill`) comparando contra o ponto em que a branch da feature divergiu da branch principal, para cobrir os eixos de Standards e Spec do repositório sobre o diff real gerado por `ambion_execute`.
4. **Checar premissas inegociáveis.** Se `docs/agents/constituicao.md` existir, confira cada premissa da seção 8 contra o diff real (não contra a intenção declarada) — qualquer violação vira bloqueio automático no relatório, separado dos demais achados.
5. **Consolidar o relatório** por épico: o que está conforme, o que diverge do PRD, achados do `code-review`, e itens não verificáveis automaticamente (ex.: UI que precisa ser vista no navegador — sinalize isso explicitamente em vez de presumir que passou).
6. Não aplique correções por conta própria além de ajustes triviais e óbvios (ex.: import faltando) — para qualquer coisa que mude comportamento, liste como achado e peça confirmação do usuário antes de alterar. Violação de premissa inegociável nunca é ajuste trivial: sempre pare e confirme com o usuário antes de corrigir.
7. Ofereça ao usuário: aplicar as correções apontadas, marcar a feature como pronta para commit/PR, ou apontar o próximo épico/tarefa pendente caso a execução tenha sido parcial.

## Critério de conclusão

Todo PRD com TASK associada foi conferido contra seu "Critério de pronto" real (não só checkbox), o `code-review` do diff da branch foi executado e reportado, premissas inegociáveis da constituição (quando existente) foram checadas contra o diff real, divergências e itens não verificáveis foram listados explicitamente para o usuário, e nenhuma alteração de comportamento foi aplicada sem confirmação.
