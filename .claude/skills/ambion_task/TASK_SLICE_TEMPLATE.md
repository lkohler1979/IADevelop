# TASK00N — <Nome da fatia> — <épico> — <nome da atividade>

> **Status: ⏳ não iniciado / 🔄 em andamento / ✅ concluído / ⛔ bloqueado** — atualize esta linha ao iniciar e ao encerrar a tarefa (legenda igual em `PRD00N.md`/`SPEC00N.md`).
> Baseado em `PRD00N.md` (negócio/UX) e `SPEC00N.md` (técnico), nesta mesma pasta. Épico: `<epico-NN-nome>` · Camada(s): `api` e/ou `app` e/ou `scripts` · Branch: `<nome-da-branch>`.
> **Não leia PRDs, SPECs ou TASKs anteriores para executar esta tarefa** — tudo que você precisa do histórico já está em `docs/<feature>/STAGE.md`. Se `STAGE.md` não for suficiente, é ele que deve ser corrigido, não esta regra.
> Todo caminho de arquivo citado leva o prefixo da camada real no repositório (`api/...`, `app/...`, `scripts/...`).

## 0. Leia o STAGE.md primeiro
- [ ] Abra `docs/<feature>/STAGE.md` e confirme: objetivo geral, contrato de dados (se houver), status/próxima etapa deste épico e notas para esta etapa.

## 1. Bloqueantes — confirmar antes de codar
<Um checkbox por item da seção "Pontos de negócio a validar antes de especificar a técnica" do `PRD00N.md` que ainda não tenha sido resolvido, mais um checkbox por item da seção "Pontos a validar antes de codar esta fatia" do `SPEC00N.md`.>

## 2. Implementação desta fatia
<Checkboxes concretos, um por arquivo/método a criar ou alterar (com prefixo de camada em cada caminho), extraídos da seção "Plano de implementação desta fatia" do `SPEC00N.md`, na ordem de dependência.>

## 3. Validação desta fatia (critério de pronto)
<Um checkbox por item da seção "Critério de sucesso desta fatia" do `PRD00N.md` (comportamento observável pelo usuário) e um checkbox por item da seção "Critério de pronto técnico desta fatia" do `SPEC00N.md` (contrato/schema/segurança), incluindo regressão explícita se esta fatia tocar código compartilhado com outro fluxo já existente.>

## 4. Atualize o STAGE.md antes de encerrar
- [ ] Marque a linha deste épico em `docs/<feature>/STAGE.md`: última tarefa concluída = `TASK00N`.
- [ ] Aponte "Próxima etapa" desse épico para `PRD00(N+1)` / `TASK00(N+1)` (ou marque o épico como `concluído` se esta era a última fatia pendente).
- [ ] Some o "Tempo gasto" e os "Tokens" desta tarefa (seção 5 abaixo) na linha do épico em `STAGE.md`.
- [ ] Liste, de forma curta, arquivos criados/alterados (com prefixo de camada) e decisões tomadas nesta fatia que a próxima tarefa precisa saber.
- [ ] Remova do `STAGE.md` qualquer nota de fatia anterior que não seja mais relevante — ele deve continuar enxuto, não virar um log acumulado.

## 5. Métricas de execução
<Preenchido por `ambion_execute`: registre o horário real (`date`/relógio da sessão) ao começar e ao terminar esta tarefa — não estime de memória depois do fato.>

| Campo | Valor |
|---|---|
| Status | `⏳ / 🔄 / ✅ / ⛔` |
| Início | `<AAAA-MM-DD HH:MM>` |
| Fim | `<AAAA-MM-DD HH:MM>` |
| Tempo gasto | `<Fim − Início, ex.: 1h45>` |
| Tokens de entrada | `<valor, se a sessão expuser essa métrica; senão "não disponível nesta sessão">` |
| Tokens de saída | `<valor, se a sessão expuser essa métrica; senão "não disponível nesta sessão">` |

> Tokens de entrada/saída só existem se a sessão/ferramenta expuser essa contagem para a tarefa executada — não invente um número. Quando não disponível, registre "não disponível nesta sessão" em vez de deixar em branco, para diferenciar de "esquecido de preencher".
