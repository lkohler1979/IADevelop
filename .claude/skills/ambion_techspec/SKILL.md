---
name: ambion_techspec
description: Generates a technical spec (SPEC001, SPEC002, ...) per PRD slice of an AMBION feature — one SPEC00N.md matching each PRD00N.md, covering recommended architecture, database modeling, API design (endpoints/methods/payloads), security requirements, reuse strategy and the concrete implementation plan. Consumes docs/<feature>/<epico>/PRD00N.md and the feature's STAGE.md. Trigger when the user asks to write the tech spec / arquitetura for a planned AMBION activity, after ambion_spec, or invokes /ambion_techspec.
---

# ambion_techspec — Especificação técnica da atividade AMBION

Quarta etapa da cadeia `ambion_constituir` → `ambion_plain` → `ambion_spec` → `ambion_techspec` → `ambion_task` → `ambion_execute` → `ambion_review`. Consome o(s) `PRD00N.md` e o `STAGE.md` já salvos; não redefine regra de negócio, só desenha como implementá-la.

Se `docs/agents/constituicao.md` existir, leia-a antes de desenhar qualquer fatia — as seções "Arquitetura" e "Banco de dados", e as premissas inegociáveis (seção 8), são vinculantes, não sugestão. Toda fatia que crie ou altere tabela/coluna/índice/migration deve acionar o agente `ambion-analista-bd` antes de o `SPEC00N.md` ser fechado — referencie essa revisão na seção "Pontos a validar antes de codar esta fatia".

**Um `SPEC00N.md` por `PRD00N.md`, mesma numeração, mesma pasta.** Diferente do PRD (que descreve o incremento do ponto de vista de negócio, podendo cruzar camadas), o tech spec é onde o fatiamento por camada técnica realmente acontece: se um PRD exige `api` e `app`, e as duas partes puderem ser implementadas e validadas em momentos diferentes, prefira desenhar duas fatias técnicas ainda referenciando o mesmo `PRD00N` — mas a numeração de `SPEC00N.md` continua 1:1 com `PRD00N.md` (não crie `SPEC001a`/`SPEC001b`; se o PRD realmente precisar virar duas fatias técnicas independentes, volte para `ambion_spec` e divida o PRD primeiro).

## Passos

1. Leia `docs/<feature>/STAGE.md` primeiro. Se não existir, pare e diga ao usuário para rodar `ambion_spec` primeiro. Para cada épico, para cada `PRD00N.md` ainda sem `SPEC00N.md` correspondente na mesma pasta `docs/<feature>/<epico>/`, releia o PRD inteiro (objetivo, escopo, critério de sucesso, pontos de negócio a validar) antes de desenhar a técnica.
2. Use o mapa de domínios (`CONTEXT-MAP.md`) e o(s) `CONTEXT.md` relevante(s), mais a constituição (arquitetura/banco de dados), para escrever `docs/<feature>/<epico>/SPEC00N.md` seguindo [TECHSPEC_SLICE_TEMPLATE.md](TECHSPEC_SLICE_TEMPLATE.md), com o badge de status inicial `📝 rascunho`, cobrindo:
   - **Arquitetura recomendada** desta fatia — como ela se encaixa no padrão arquitetural já definido na constituição, nenhuma decisão nova de estilo arquitetural sem justificar o desvio.
   - **Modelagem de banco de dados** — tabelas/colunas/relacionamentos/migrations que esta fatia cria ou altera (ou "nenhuma" explícito).
   - **Design de API** — quando a fatia tocar `api`: endpoints, métodos HTTP, payloads de request/response, códigos de status. "Não aplicável" se a fatia não expuser API.
   - **Requisitos de segurança** — autenticação/autorização exigida, dados sensíveis envolvidos, validação de entrada. "Nenhum requisito além do padrão do domínio" é uma resposta válida, mas precisa ser explícita.
   - **Estratégia de reaproveitamento** — o que já existe no domínio (tipo/fluxo irmão) que resolve um problema parecido ao desta fatia; o que herdar/estender vs. o que é novo.
   - **Plano de implementação** — lista de arquivos/métodos concretos a criar ou alterar, com prefixo de camada em cada caminho (`api/...`, `app/...`, `scripts/...`), na ordem de dependência técnica.
3. **Referencie fatias técnicas irmãs.** Sempre que uma fatia depender de, ou for consumida por, outra fatia do mesmo épico em camada diferente (ex.: `SPEC002.md` do app consome o endpoint definido em `SPEC001.md` da api), preencha "SPECs relacionados neste épico" de cada uma apontando pelo número — nunca deixe a dependência implícita.
4. Antes de propor arquivos/classes novos, verifique se algum tipo/fluxo irmão já existente no domínio resolve um problema parecido — vai na seção "Estratégia de reaproveitamento", não pode ser omitido nem respondido com "nenhum" por padrão.
5. Toda migration de schema (nova tabela/coluna/índice) exige aprovação do agente `ambion-analista-bd` antes de o `SPEC00N.md` ser considerado fechado — registre o resultado da revisão na própria fatia.
6. Atualize `docs/<feature>/STAGE.md`:
   - Preencha (ou complete) a seção "Contrato de dados/interface" com o que for compartilhado entre camadas/épicos — esta seção nasce técnica e é populada aqui, não em `ambion_spec`.
   - Aponte "Próxima etapa" de cada épico coberto para `TASK00N` assim que todas as suas fatias tiverem `SPEC00N.md`.
7. Antes de listar para o usuário, mude o badge de cada SPEC apresentado de `📝 rascunho` para `👀 em revisão`. Liste os `SPEC00N.md` gerados por épico, e peça revisão explícita.
8. **Acionar a próxima etapa.** Depois que o usuário revisar e confirmar, mude o badge de cada SPEC confirmado para `✅ aprovado`, aponte "Próxima etapa" do épico correspondente para `TASK00N` em `STAGE.md`, e invoque a skill `ambion_task` (via `Skill`) para gerar as tarefas de execução a partir dos PRDs + tech specs.

## Critério de conclusão

Cada `PRD00N.md` confirmado tem um `SPEC00N.md` correspondente na mesma pasta, cobrindo arquitetura, banco de dados, API, segurança, reaproveitamento e plano de implementação — nenhuma seção respondida com afirmação vaga; toda mudança de schema foi revisada por `ambion-analista-bd`; dependências entre fatias técnicas de camadas diferentes estão referenciadas pelo número do SPEC; `docs/<feature>/STAGE.md` tem o "Contrato de dados/interface" preenchido e aponta para `TASK00N` nos épicos prontos; o usuário revisou explicitamente; e a skill `ambion_task` foi acionada em seguida.
