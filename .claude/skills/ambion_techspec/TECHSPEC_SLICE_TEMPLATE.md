# SPEC00N — <Nome da fatia> — <épico> — <nome da atividade>

> **Status: 📝 rascunho / 👀 em revisão / ✅ aprovado** — atualize esta linha conforme o documento avança (legenda igual em `PRD00N.md`/`TASK00N.md`).
> Baseado em `PRD00N.md`, nesta mesma pasta. Épico: `<epico-NN-nome>` · Camada(s): `api` e/ou `app` e/ou `scripts` (declare todas as que esta fatia toca) · Domínio(s) AMBION: `<ex.: integrador, iqar>` · Branch: `<nome-da-branch>`.
> Contexto compartilhado da atividade inteira (objetivo geral, contrato de dados, status dos épicos) está em `STAGE.md`, na raiz de `docs/<feature>/` — não repita aqui, só referencie.
> Todo caminho de arquivo citado nesta fatia leva o prefixo da camada real no repositório, ex.: `api/src/models/Peca.ts`, `app/src/pages/PecaForm.tsx`, `scripts/migrations/2026xxxx_pecas.sql`.

## 1. SPECs relacionados neste épico
<Outros `SPEC00N.md` do mesmo épico (de camada igual ou diferente) que compartilham contrato/dependência técnica com esta fatia (ex.: "SPEC002.md (app) consome o endpoint definido aqui"). "Nenhum" se esta fatia for autônoma — não pode ser omitido.>

## 2. Arquitetura recomendada
<Como esta fatia se encaixa no padrão arquitetural já definido na constituição (seção "Arquitetura"). Se propor um desvio, justifique explicitamente por que o padrão padrão não serve aqui.>

## 3. Modelagem de banco de dados
<Tabelas/colunas/índices/relacionamentos criados ou alterados por esta fatia, com nome, tipo e nulabilidade. "Nenhuma" se a fatia não tocar schema. Toda mudança de schema exige revisão do agente `ambion-analista-bd` antes de fechar esta seção — registre o resultado da revisão aqui.>

## 4. Design de API
<Para fatias que tocam `api`: endpoints (método + rota), payload de request, payload de response, códigos de status relevantes. "Não aplicável" se a fatia não expuser API.>

## 5. Requisitos de segurança
<Autenticação/autorização exigida, dados sensíveis envolvidos, validação de entrada obrigatória. "Nenhum requisito além do padrão do domínio" é resposta válida, mas precisa ser explícita, não omitida.>

## 6. Estratégia de reaproveitamento
<O que já existe no domínio (tipo/fluxo irmão) que resolve um problema parecido ao desta fatia? O que herdar/estender vs. o que é novo? Se nada existir, declare isso explicitamente.>

## 7. Plano de implementação desta fatia
<Lista de arquivos/métodos concretos a criar ou alterar, com prefixo de camada em cada caminho (`api/...`, `app/...`, `scripts/...`), só os desta fatia, na ordem de dependência técnica.>

## 8. Fora do escopo técnico desta fatia
<O que fica para uma fatia técnica posterior, outra camada, ou fora da atividade.>

## 9. Pontos a validar antes de codar esta fatia
<Decisões/confirmações técnicas bloqueantes específicas desta fatia (ex.: aprovação do `ambion-analista-bd`, decisão de infraestrutura pendente).>

## 10. Critério de pronto técnico desta fatia
<Como saber que a implementação desta fatia está tecnicamente correta — contrato de API respeitado, migration aplicada e reversível, teste de integração alvo. Complementa (não substitui) o "Critério de sucesso" de negócio do `PRD00N.md`.>
