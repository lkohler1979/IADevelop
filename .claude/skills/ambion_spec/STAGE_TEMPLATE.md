# STAGE — <nome da atividade>

> Arquivo vivo, **único para toda a feature** (`docs/<feature>/STAGE.md`): é **reescrito** a cada tarefa concluída, não é um log que só cresce. Deve caber inteiro na cabeça de quem for executar a próxima etapa de qualquer épico, sem precisar reabrir PRDs/TASKs anteriores.

## Objetivo geral (estável — não muda entre épicos/fatias)
<1-3 frases: o que esta atividade faz e por quê.>

## Contrato de dados/interface (estável — compartilhado entre camadas/épicos quando aplicável)
<Formato exato de payload/enum/nomes de campo compartilhado entre `api`, `app` e/ou `scripts`, ou entre épicos diferentes. Omitir se não houver contrato compartilhado.>

## Épicos
| Épico | Camadas | Status | Próxima etapa |
|---|---|---|---|
| `<epico-01-nome>` | `api, app` | `não iniciado / em andamento / concluído` | `PRD00N` ou `TASK00N` |
| `<epico-02-nome>` | `scripts` | ... | ... |

## Decisões tomadas durante a execução que não estavam no plano/PRD original
<Lista curta ou "nenhuma".>

## Bloqueios pendentes
<Lista curta ou "nenhum".>

## Notas para a próxima etapa
<1-5 frases: o que quem for gerar ou executar a próxima fatia (de qualquer épico) precisa saber, sem reler o histórico completo.>
