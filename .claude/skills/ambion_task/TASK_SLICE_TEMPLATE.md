# TASK00N — <Nome da fatia> — <épico> — <nome da atividade>

> Baseado em `PRD00N.md`, nesta mesma pasta. Épico: `<epico-NN-nome>` · Camada(s): `api` e/ou `app` e/ou `scripts` · Branch: `<nome-da-branch>`.
> **Não leia PRDs ou TASKs anteriores para executar esta tarefa** — tudo que você precisa do histórico já está em `docs/<feature>/STAGE.md`. Se `STAGE.md` não for suficiente, é ele que deve ser corrigido, não esta regra.
> Todo caminho de arquivo citado leva o prefixo da camada real no repositório (`api/...`, `app/...`, `scripts/...`).

## 0. Leia o STAGE.md primeiro
- [ ] Abra `docs/<feature>/STAGE.md` e confirme: objetivo geral, contrato de dados (se houver), status/próxima etapa deste épico e notas para esta etapa.

## 1. Bloqueantes — confirmar antes de codar
<Um checkbox por item da seção "Pontos a validar antes de codar esta fatia" do `PRD00N.md`.>

## 2. Implementação desta fatia
<Checkboxes concretos, um por arquivo/método a criar ou alterar (com prefixo de camada em cada caminho), extraídos da seção "Plano de implementação desta fatia" do `PRD00N.md`, na ordem de dependência.>

## 3. Validação desta fatia (critério de pronto)
<Um checkbox por item da seção "Critério de pronto desta fatia" do `PRD00N.md`, incluindo regressão explícita se esta fatia tocar código compartilhado com outro fluxo já existente.>

## 4. Atualize o STAGE.md antes de encerrar
- [ ] Marque a linha deste épico em `docs/<feature>/STAGE.md`: última tarefa concluída = `TASK00N`.
- [ ] Aponte "Próxima etapa" desse épico para `PRD00(N+1)` / `TASK00(N+1)` (ou marque o épico como `concluído` se esta era a última fatia pendente).
- [ ] Liste, de forma curta, arquivos criados/alterados (com prefixo de camada) e decisões tomadas nesta fatia que a próxima tarefa precisa saber.
- [ ] Remova do `STAGE.md` qualquer nota de fatia anterior que não seja mais relevante — ele deve continuar enxuto, não virar um log acumulado.
