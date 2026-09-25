---
name: ambion_constituir
description: Define ou revisa a constituição de padrões do projeto AMBION (frameworks, qualidade de código, testes/TDD, qualidade de manutenção, banco de dados, arquitetura) com perguntas ao usuário, grava em docs/agents/constituicao.md, e gera/atualiza os agentes especializados (analista de negócio, desenvolvedor, analista de teste, analista de banco de dados) que as demais skills invocam quando precisam. Etapa zero da cadeia, anterior a ambion_plain. Trigger quando o usuário quer definir/revisar padrões do projeto, estabelecer premissas inegociáveis, criar os agentes especializados do AMBION, ou invoca /ambion_constituir. Também é o gatilho quando ambion_plain detecta que docs/agents/constituicao.md ainda não existe.
---

# ambion_constituir — Constituição de padrões da AMBION

Etapa zero da cadeia `ambion_constituir` → `ambion_plain` → `ambion_spec` → `ambion_techspec` → `ambion_task` → `ambion_execute` → `ambion_review`. Diferente das demais, não é por feature — roda uma vez para o projeto inteiro e é revisada sempre que um padrão mudar, não a cada atividade nova.

Esta skill não planeja nem especifica nenhuma feature — só registra as regras que toda feature futura deve respeitar, e prepara os agentes especializados que o resto da cadeia vai chamar.

## Passos

1. **Verificar se já existe constituição.** Procure `docs/agents/constituicao.md`. Se existir, mostre um resumo curto (título das 9 seções e as premissas inegociáveis atuais) e pergunte ao usuário: revisar do zero, revisar só algumas seções, ou cancelar (nada muda). Se o usuário quiser revisar só algumas seções, pule direto para elas nos passos 3-9 e mantenha o resto do arquivo intacto.
2. **Levantar o estado real do repositório antes de perguntar.** Leia `CONTEXT-MAP.md` e os `CONTEXT.md` de cada domínio/camada (`aermod`, `api`, `app`, `estatistica`, `integrador`, `iqar`, `migris`, `mqtt-server`), e inspecione manifestos de dependência (`package.json`, `requirements.txt`, etc.) e arquivos de configuração de lint/teste já presentes. Chegue nas perguntas dos passos seguintes com uma proposta concreta baseada no que já existe — não pergunte em abstrato o que o repositório já responde sozinho; peça só para confirmar ou corrigir.
3. **Frameworks e stack**, uma pergunta por vez, por camada tocada: linguagem/framework principal, versão-alvo, bibliotecas de uso obrigatório ou proibido. Proponha a partir do passo 2; confirme com o usuário.
4. **Qualidade de código**: regras de lint/formatação, convenções de nomenclatura, limites de tamanho de função/arquivo, política de comentários, quem revisa/aprova. Proponha a partir das ferramentas já configuradas no repo, mas **o piso nunca é negociável para baixo**: código limpo, de fácil entendimento e fácil manutenção, seguindo as melhores práticas da linguagem/framework em uso, é premissa da própria skill — não uma opção entre outras a perguntar ao usuário. Se o repo não tiver lint/convenção configurada, ou tiver uma configuração fraca, proponha um padrão forte (não silencie a lacuna nem replique um padrão ruim só porque já é o que existe).
5. **Estratégia de testes (inclui TDD)**: por camada, que tipos de teste são exigidos e com qual ferramenta; cobertura mínima quando fizer sentido cobrar; em quais situações o ciclo red-green-refactor (escrever o teste que falha antes do código) é **obrigatório** (ex.: toda regra de negócio nova) vs. **opcional** (ex.: script descartável, protótipo); quando um teste de regressão é obrigatório antes de mexer em código existente.
6. **Qualidade de manutenção**: limites de complexidade/duplicação aceitáveis, quando um ADR é obrigatório, documentação mínima exigida por tipo de mudança. Mesmo piso do passo 4: manutenibilidade (baixo acoplamento, nomes que expliquem intenção, sem duplicação evitável) é premissa, não item de preferência.
7. **Banco de dados**: SGBD(s) em uso, convenção de nomenclatura de tabelas/colunas/migrations, estratégia de migração e rollback, regras de índice/performance, quando uma mudança de schema exige revisão do agente `ambion-analista-bd` antes de codar.
8. **Arquitetura**: padrão arquitetural por camada/serviço, limites entre domínios (o que uma camada nunca deve chamar diretamente), quando abrir um ADR para uma decisão arquitetural.
9. **Papel dos agentes especializados**: para cada um dos quatro agentes (negócio, desenvolvedor, teste, banco de dados), pergunte em que situação concreta as próximas skills da cadeia devem chamá-lo em vez de resolver sozinhas (ex.: "toda mudança de schema aciona `ambion-analista-bd` antes do `SPEC00N.md` ser fechado, em `ambion_techspec`"; "toda dúvida de regra de negócio ambígua aciona `ambion-analista-negocio` antes de assumir uma interpretação, tipicamente em `ambion_plain`/`ambion_spec`").
10. **Premissas inegociáveis — pergunta final e obrigatória.** Pergunte explicitamente: "dentre tudo que definimos, quais regras nunca podem ser quebradas, mesmo sob pressão de prazo?". Não aceite uma resposta vaga — cada premissa precisa ser uma regra objetiva e verificável (ex.: "nenhuma migration destrutiva sem backup validado"), não uma aspiração genérica ("ter cuidado com o banco"). Essas são as únicas regras que `ambion_review` tratará como bloqueio automático, não como achado negociável.
11. **Gravar** o resultado em `docs/agents/constituicao.md`, seguindo [CONSTITUICAO_TEMPLATE.md](CONSTITUICAO_TEMPLATE.md) (crie `docs/agents/` se faltar; se já existir um arquivo, preserve as seções não revisadas e registre a mudança na tabela "Histórico de revisões" com a data de hoje e o motivo).
12. **Gerar/atualizar os agentes especializados** em `.claude/agents/` a partir de [AGENT_TEMPLATES.md](AGENT_TEMPLATES.md):
    - `ambion-analista-negocio.md`
    - `ambion-desenvolvedor.md`
    - `ambion-analista-teste.md`
    - `ambion-analista-bd.md`
    Cada arquivo deve referenciar `docs/agents/constituicao.md` no próprio prompt (para carregar os padrões vigentes ao ser invocado) e refletir, na sua descrição, os gatilhos definidos no passo 9. Se os agentes já existirem, atualize-os em vez de recriar do zero — preserve qualquer ajuste manual que não conflite com a constituição nova.
13. **Apontar no `CLAUDE.md` da raiz** (seção "Agent skills") um item "Constituição" apontando para `docs/agents/constituicao.md`, no mesmo estilo dos itens já existentes ("Issue tracker", "Domain docs"), se ainda não existir.
14. Confirme com o usuário que a constituição e os agentes estão prontos, e pergunte se deve acionar `ambion_plain` para começar a planejar uma feature agora, ou encerrar por aqui.

## Critério de conclusão

`docs/agents/constituicao.md` existe (ou foi revisado) cobrindo as 9 seções do template, incluindo uma lista explícita e verificável de premissas inegociáveis; os quatro agentes especializados existem em `.claude/agents/` referenciando a constituição; o `CLAUDE.md` da raiz aponta para a constituição; e o usuário confirmou explicitamente que o resultado está completo.
