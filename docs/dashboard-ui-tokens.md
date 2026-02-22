# Dashboard UI Tokens (Modal de Nova Entrada)

Objetivo: travar padrão visual e evitar regressão.

## 1) Tipografia
| Token | Valor atual | Papel | Regra de uso |
|---|---:|---|---|
| `--entry-label-size` | `11px` | Label de seção/campo | Sempre uppercase, nunca usar para valor. |
| `--entry-label-weight` | `700` | Peso de label | Não variar por campo. |
| `--entry-label-track` | `0.1em` | Tracking de label | Não usar em textos de conteúdo. |
| `--entry-label-case` | `uppercase` | Caixa de label | Aplicar somente em labels. |
| `--entry-label-color` | `mix(text 52%, muted)` | Cor de label | Sempre abaixo do contraste de valor. |
| `--entry-helper-size` | `13px` | Texto de apoio/hint | Uso pontual, nunca competir com label. |
| `--entry-value-size` | `clamp(28px, 6.6vw, 34px)` | Valor de campos (categoria/data) | Uso em `entry-picker-row__value`. |
| `--entry-placeholder-size` | `clamp(17px, 4.2vw, 20px)` | Placeholder de campos | Sempre menor que `--entry-value-size`. |
| `--entry-list-size` | `clamp(19px, 5vw, 22px)` | Itens de lista de categoria | Não exceder valor de campo selecionado. |
| `--entry-amount-symbol-size` | `clamp(24px, 5.8vw, 30px)` | Símbolo `R$` | Sempre menor que o número. |
| `--entry-amount-value-size` | `clamp(60px, 13vw, 72px)` | Número do valor | Elemento tipográfico dominante da tela. |

## 2) Tipografia mobile
| Token | Valor atual | Papel | Regra de uso |
|---|---:|---|---|
| `--entry-value-size-mobile` | `clamp(20px, 5.4vw, 24px)` | Valor em pickers | Não reduzir abaixo de 20px. |
| `--entry-placeholder-size-mobile` | `clamp(15px, 4vw, 18px)` | Placeholder mobile | Sempre >= 15px. |
| `--entry-list-size-mobile` | `17px` | Lista de categoria mobile | Evitar densidade excessiva. |
| `--entry-amount-value-size-mobile` | `clamp(50px, 11.6vw, 60px)` | Número do valor mobile | Deve manter protagonismo. |

## 3) Espaçamento e ritmo
| Token/Regra | Valor atual | Papel | Regra de uso |
|---|---:|---|---|
| `--entry-space-1..6` | tokens globais | Grid vertical do modal | Não criar spacing ad-hoc sem necessidade. |
| `entry-stage padding` | `14px 0 6px` | Separação entre seções | Usar espaço, não card. |
| `entry-field-set border` | `mix(divider 44%)` | Separador leve | Não aumentar contraste sem motivo. |
| `modal-actions padding` | `10px 16px ...` | Rodapé de ação | Mantém ancoragem sem pesar. |

## 4) Camadas e superfície
| Token/Regra | Valor atual | Papel | Regra de uso |
|---|---:|---|---|
| `entry-sheet::part(content)` | gradiente + sem sombra | Superfície principal | Sem card, sem sombra. |
| `entry-picker-sheet::part(content)` | full-height + sem sombra | Seletor categoria/data | Continuidade visual, sem corte agressivo. |
| `entry-sheet::part(backdrop)` | `rgba(15,23,32,0.22)` | Escurecimento de fundo | Não ultrapassar opacidade que “mata” contexto. |
| `box-shadow` | `none` | Regra global de camada | Não reintroduzir sombra no fluxo. |

## 5) Interação e estados
| Item | Estado | Regra |
|---|---|---|
| Picker row | `aria-expanded=true` | Realce sutil de fundo + ícone ativo. |
| Categoria selecionada | `aria-current=true` | Destaque + ícone `check`. |
| Salvar | `disabled / idle / saving` | `saving` deve mostrar texto `Salvando...`. |
| Campos opcionais | sempre habilitados | Não usar “apagado/desabilitado” no fluxo principal. |

## 6) Critérios de aceite (PASS/FAIL)
1. Número do valor visualmente maior que qualquer outro texto funcional.
2. Labels possuem um único padrão (size/weight/track/case/color).
3. Não há sombra em modal principal, picker e headers.
4. Separadores são leves; organização feita por espaçamento.
5. Categoria e Data têm affordance clara (seta + estado ativo).
6. CTA `Salvar` tem estado explícito de envio.

## 7) Anti-regressão
1. Não reutilizar `topbar-title` em modal/picker.
2. Não adicionar estilos de card (`background` + borda + raio + sombra) para “resolver” legibilidade.
3. Não criar novos tamanhos tipográficos fora dos tokens desta tabela sem atualizar este arquivo.
