# STAGE — <nome da atividade>

> Arquivo vivo, **único para toda a feature** (`docs/<feature>/STAGE.md`): é **reescrito** a cada tarefa concluída, não é um log que só cresce. Deve caber inteiro na cabeça de quem for executar a próxima etapa de qualquer épico, sem precisar reabrir PRDs/TASKs anteriores.

**Legenda de status** (mesma usada em `PRD00N.md`/`SPEC00N.md`/`TASK00N.md` desta feature): ⏳ não iniciado · 🔄 em andamento · ✅ concluído · ⛔ bloqueado.

## Objetivo geral (estável — não muda entre épicos/fatias)
<1-3 frases: o que esta atividade faz e por quê.>

## Contrato de dados/interface (estável — compartilhado entre camadas/épicos quando aplicável)
<Formato exato de payload/enum/nomes de campo compartilhado entre `api`, `app` e/ou `scripts`, ou entre épicos diferentes. Omitir se não houver contrato compartilhado.>

## Épicos
| Épico | Camadas | Status | Próxima etapa | Tempo gasto | Tokens (entrada/saída) |
|---|---|---|---|---|---|
| `<epico-01-nome>` | `api, app` | `⏳ não iniciado` | `PRD00N`, `SPEC00N` ou `TASK00N` | `—` | `—` |
| `<epico-02-nome>` | `scripts` | `🔄 em andamento` | ... | `2h30` (soma das TASKs concluídas deste épico) | `12.4k / 3.1k` (soma; "não disponível" se a sessão não expuser essa métrica) |

> "Tempo gasto" e "Tokens" de cada épico são a soma dos mesmos campos registrados na seção "Métricas de execução" de cada `TASK00N.md` concluída do épico — não recalcule do zero aqui, só some o que já está nas tarefas.

## Panorama visual dos épicos
<Gerado a partir da tabela acima — atualize a contagem sempre que um épico mudar de status. Se o visualizador de markdown não renderizar mermaid, a tabela acima já é suficiente; este bloco é um complemento opcional.>

```mermaid
pie showData
    title Épicos por status
    "✅ Concluído" : <N>
    "🔄 Em andamento" : <N>
    "⏳ Não iniciado" : <N>
    "⛔ Bloqueado" : <N>
```

## Decisões tomadas durante a execução que não estavam no plano/PRD original
<Lista curta ou "nenhuma".>

## Bloqueios pendentes
<Lista curta ou "nenhum".>

## Notas para a próxima etapa
<1-5 frases: o que quem for gerar ou executar a próxima fatia (de qualquer épico) precisa saber, sem reler o histórico completo.>
