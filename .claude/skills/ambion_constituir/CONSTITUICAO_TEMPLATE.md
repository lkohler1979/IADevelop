# Constituição AMBION

> Documento vivo, único para o projeto inteiro (`docs/agents/constituicao.md`). É lido por `ambion_plain`, `ambion_spec`, `ambion_task`, `ambion_execute` e `ambion_review`, e pelos agentes especializados (`ambion-analista-negocio`, `ambion-desenvolvedor`, `ambion-analista-teste`, `ambion-analista-bd`). Revise-o com `ambion_constituir` sempre que um padrão mudar — não edite à mão sem passar pela skill.

## 1. Frameworks e stack por camada
<Para cada camada tocada pelo projeto (`api`, `app`, `scripts`, e demais domínios de `CONTEXT-MAP.md`), liste linguagem, framework principal, versão-alvo e bibliotecas de uso obrigatório/proibido. Baseado no que já existe no repositório (package.json, requirements, etc.), não em preferência abstrata.>

## 2. Qualidade de código
<Regras de lint/formatação, convenções de nomenclatura, limites de tamanho de função/arquivo, política de comentários, revisão obrigatória (quem aprova o quê). Referencie as ferramentas já configuradas no repo (eslint, prettier, tsconfig strict, etc.) em vez de reinventar. Piso não-negociável, independente do que o repo já configura: código limpo, de fácil entendimento e fácil manutenção, seguindo as melhores práticas da linguagem/framework em uso.>

## 3. Estratégia de testes
<Por camada: tipos de teste exigidos (unitário, integração, e2e), ferramenta usada, cobertura mínima quando aplicável. Regras de TDD: em quais situações o ciclo red-green-refactor é obrigatório (ex.: regra de negócio nova) vs. opcional (ex.: script descartável). Quando um teste de regressão é obrigatório antes de mexer em código existente.>

## 4. Qualidade de manutenção
<Limites de complexidade/duplicação aceitáveis, quando um ADR é obrigatório, documentação mínima exigida por tipo de mudança (CONTEXT.md, ADR, comentário), critério para considerar um módulo "manutenível". Mesmo piso da seção 2: baixo acoplamento, nomes que expliquem intenção, sem duplicação evitável — não é item de preferência do time, é premissa.>

## 5. Banco de dados
<SGBD(s) em uso, convenção de nomenclatura de tabelas/colunas/migrations, estratégia de migração (como e quando gerar, como reverter), regras de índice/performance, quando uma mudança de schema exige revisão do `ambion-analista-bd` antes de codar.>

## 6. Arquitetura
<Padrão arquitetural por camada/serviço (ex.: camadas da api, estrutura de pastas do app, papel dos scripts), limites entre domínios (o que uma camada/domínio nunca deve chamar diretamente), quando abrir um ADR para uma decisão arquitetural.>

## 7. Papel dos agentes especializados
<Quando `ambion_plain`/`ambion_spec`/`ambion_task`/`ambion_execute`/`ambion_review` devem invocar cada agente (`ambion-analista-negocio`, `ambion-desenvolvedor`, `ambion-analista-teste`, `ambion-analista-bd`) em vez de resolver a etapa sozinhos. Um agente por linha, com o gatilho concreto (ex.: "toda mudança de schema aciona `ambion-analista-bd` antes do PRD ser fechado").>

## 8. Premissas inegociáveis
<Lista curta e explícita de regras que **nunca** podem ser quebradas, mesmo sob pressão de prazo — as únicas seções deste documento que `ambion_review` trata como bloqueantes automáticos, não como achado sujeito a negociação. Cada premissa em uma linha, redigida como regra objetiva e verificável (não como aspiração). Exemplo de formato: "Nenhuma migration destrutiva sem backup validado" — não "ter cuidado com o banco".>

## 9. Histórico de revisões
| Data | O que mudou | Motivo |
|---|---|---|
| <AAAA-MM-DD> | Versão inicial | Criação da constituição via `ambion_constituir` |
