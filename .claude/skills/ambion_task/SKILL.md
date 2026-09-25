---
name: ambion_task
description: Breaks down each numbered PRD+SPEC slice pair (PRD001.md/SPEC001.md, PRD002.md/SPEC002.md, ...) under docs/<feature>/<epico>/ into a matching TASK00N.md in the same folder, wired to read and update the feature's single STAGE.md so execution never needs the full PRD/SPEC/TASK history in context. Trigger when the user asks to generate tasks or a backlog for a planned AMBION activity, or invokes /ambion_task.
---

# ambion_task — Tarefas de execução da atividade AMBION

Quinta etapa da cadeia `ambion_constituir` → `ambion_plain` → `ambion_spec` → `ambion_techspec` → `ambion_task` → `ambion_execute` → `ambion_review`. Consome o(s) `PRD00N.md`, o(s) `SPEC00N.md` correspondente(s) e o `STAGE.md` já salvos; não redefine escopo nem arquitetura.

Se `docs/agents/constituicao.md` existir, use a seção "Estratégia de testes" ao traduzir "Critério de sucesso"/"Critério de pronto técnico" em checkboxes de validação — se a constituição exige TDD para o tipo de mudança da fatia, o checkbox de implementação deve vir depois do checkbox do teste que falha, não antes. Em fatias com casos de teste difíceis de definir, considere acionar o agente `ambion-analista-teste` para desenhar os casos antes de escrever a tarefa.

Assim como os PRDs e SPECs, as TASKs **não** ficam em subpasta por camada — `TASK00N.md` fica direto em `docs/<feature>/<epico>/`, ao lado do `PRD00N.md`/`SPEC00N.md` que a originaram, e referencia arquivos com o prefixo de camada (`api/...`, `app/...`, `scripts/...`).

## Passos

1. Leia `docs/<feature>/STAGE.md` primeiro (não os PRDs/SPECs de épicos já concluídos) para saber onde a atividade parou. Se não houver `STAGE.md`, pare e diga ao usuário para rodar `ambion_spec` primeiro.
2. Para cada épico, para cada `PRD00N.md` ainda sem `TASK00N.md` correspondente:
   - Confira se existe `SPEC00N.md` do mesmo número na mesma pasta. **Se não existir, pule esta fatia** e avise o usuário que ela precisa passar por `ambion_techspec` antes — não invente a parte técnica aqui.
   - Se existir, escreva `docs/<feature>/<epico>/TASK00N.md` (mesmo número do PRD/SPEC, mesma pasta) seguindo [TASK_SLICE_TEMPLATE.md](TASK_SLICE_TEMPLATE.md):
     - a seção "Pontos de negócio a validar" do `PRD00N.md` + a seção "Pontos a validar antes de codar esta fatia" do `SPEC00N.md` viram, juntas, o bloco `0. Bloqueantes`;
     - a seção "Plano de implementação desta fatia" do `SPEC00N.md` vira checkboxes concretos, um por arquivo/método, mantendo o prefixo de camada (`api/...`, `app/...`, `scripts/...`) em cada caminho;
     - a seção "Critério de sucesso desta fatia" do `PRD00N.md` (comportamento observável pelo usuário) + a seção "Critério de pronto técnico desta fatia" do `SPEC00N.md` (contrato/schema/segurança) viram, juntas, o bloco final de validação;
     - todo `TASK00N.md` **começa** com um passo obrigatório "leia `STAGE.md`" e **termina** com um passo obrigatório "atualize `STAGE.md`" (já inclusos no template — não remova), com badge de status inicial `⏳ não iniciado` e a seção "5. Métricas de execução" em branco (preenchida só por `ambion_execute`).
3. **Fatias de `scripts` recebem menos fatiamento.** Scripts (migrações, cargas, tarefas pontuais) tendem a ser lineares e descartáveis — não crie um `PRD00N`/`SPEC00N`/`TASK00N` por scriptzinho. Agrupe passos correlatos de scripts na mesma fatia sempre que forem executados em sequência e não tiverem valor isolado; só separe em fatias distintas quando houver um ponto de validação real entre elas (ex.: "rodar migração" vs. "validar dados migrados e só então seguir"). Fatias de `api`/`app` continuam uma por incremento testável.
4. Depois de gerar cada `TASK00N.md`, atualize a linha do épico correspondente em `docs/<feature>/STAGE.md`: aponte "Próxima etapa" daquele épico para `TASK00N`, e nada além disso — não copie o conteúdo do PRD/SPEC/TASK para o `STAGE.md`, ele deve continuar enxuto.
5. Se uma fatia depender de um detalhe do "Contrato de dados/interface" de outra fatia/camada/épico, anote essa dependência explicitamente na tarefa (referenciando o `STAGE.md` e o número do PRD/SPEC/TASK relacionado) — para não perder a sincronia quando forem executadas fora de ordem.
6. Apresente a lista de `TASK00N.md` criados por épico, e quais fatias ficaram pendentes de `ambion_techspec` (se houver).
7. **Acionar a próxima etapa.** Pergunte ao usuário se já pode iniciar a execução das tarefas — essa etapa grava/altera código de verdade, então exige confirmação explícita antes de acionar. Se confirmado, invoque a skill `ambion_execute` (via `Skill`).

## Critério de conclusão

Cada `PRD00N.md` com `SPEC00N.md` correspondente tem um `TASK00N.md` na mesma pasta do épico, com os passos de leitura/atualização do `STAGE.md` presentes, respeitando o fatiamento mais grosso de `scripts`; fatias sem `SPEC00N.md` foram sinalizadas ao usuário em vez de puladas silenciosamente; `docs/<feature>/STAGE.md` aponta corretamente para a próxima tarefa pendente de cada épico; e o usuário foi consultado sobre acionar `ambion_execute`.
