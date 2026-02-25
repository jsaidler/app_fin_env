# Design Principles

Este documento define as verdades absolutas de design/UX do projeto.  
Qualquer implementação nova ou ajuste visual deve seguir estes princípios.

## 1. Direção Visual (Visual Language)
- Estética clean finance app: alto controle visual, ruído mínimo, foco em dados.
- Linguagem premium leve: aparência técnica e amigável.
- Paleta curta e coerente: azul como cor de marca, neutros claros no fundo, acentos suaves por categoria/status.
- Contraste por função: cores fortes para estado/ação; cinzas para contexto e estrutura.

## 2. Arquitetura da Tela (Layout System)
- Layout em camadas: header azul separado de canvas claro.
- Leitura em blocos verticais: onde estou, o que posso fazer, o que aconteceu.
- Largura confortável e alinhamentos rígidos em grid invisível.
- Hierarquia por distância: espaçamento maior entre grupos, menor internamente.

## 3. Hierarquia de Informação
- Nível 1: contexto da área (aba ativa, título da seção).
- Nível 2: KPIs e ações primárias.
- Nível 3: listas transacionais detalhadas.
- Fluxo visual: estado atual -> ação -> histórico.

## 4. Tipografia
- Escala tipográfica curta e disciplinada.
- Títulos precisos, sem exagero.
- Labels em caixa alta/cinza para metadados.
- Números financeiros em destaque e com alinhamento consistente.
- Microtipografia controlada (peso, tracking, line-height).

## 5. Espaçamento e Ritmo
- Respiro como estrutura, não decoração.
- Ritmo vertical previsível.
- Densidade equilibrada: informação alta sem aparência apertada.
- Separação com espaço e linhas suaves; evitar caixas pesadas.

## 6. Sistema de Cor
- Azul institucional domina navegação e identidade.
- Fundo neutro para reduzir fadiga visual.
- Cores semânticas discretas (verde/laranja/roxo) para categorias e performance.
- Chips de categoria em tons pastel para não competir com valores.

## 7. Componentização (UI Patterns)
- Top bar com ícones utilitários e branding.
- Segmented control em pílula para troca de contexto.
- Search + filter em barra dedicada.
- Cards leves apenas quando agregam contexto.
- Bottom sheet para detalhes/ações mantendo contexto de fundo.

## 8. Navegação e Descoberta
- Navegação principal sempre visível e estável.
- Estado ativo explícito (pílula branca no header azul).
- Rotas mentais simples: Dashboard, Transactions, Categories, Recurring.
- Progressão padrão: resumo -> detalhe.

## 9. Design de Lista (Transactions/Categories)
- Leitura rápida: descrição, categoria, valor.
- Valor no mesmo eixo visual em toda lista.
- Agrupamento por data para reduzir carga cognitiva.
- Chips compactos substituem textos longos de classificação.

## 10. Tratamento de Dados Financeiros
- Informação monetária em camadas: total, comparação, tendência.
- Visualizações simples e legíveis (linhas, barras, progresso).
- Comparação temporal sempre presente.
- Reforço semântico por cor e posição, não por efeitos pesados.

## 11. Ações e Affordance
- Ação principal sempre evidente.
- Ações secundárias discretas e claras.
- Elementos tocáveis com altura, borda e contraste adequados.
- Estados interativos sutis (hover/pressed/focus), sem ruído.

## 12. Bottom Sheet UX
- Padrão móvel nativo: handle, backdrop escurecido, contexto preservado.
- Hierarquia forte no conteúdo (título, valor, categoria, ações).
- Ações agrupadas no fim com clareza de impacto.
- Edição sem quebrar fluxo da lista.

## 13. Microinterações e Motion
- Transições curtas e utilitárias.
- Mudanças de estado devem explicar o que aconteceu.
- Evitar animação ornamental.
- Abertura de sheet e troca de aba devem reforçar orientação espacial.

## 14. Consistência Sistêmica
- Mesmo idioma visual em todas as telas.
- Mesmo componente para mesma função.
- Tokens consistentes: raio, sombra, borda, cor, tipografia.
- Coerência reduz aprendizado e aumenta confiança.

## 15. UX de Leitura e Escaneabilidade
- Escaneabilidade horizontal: título à esquerda, valor à direita.
- Escaneabilidade vertical: agrupamentos com headers claros.
- Texto curto e funcional.
- Densidade com ordem rigorosa.

## 16. Conteúdo e Copy
- Copy utilitário e orientado a tarefa.
- Labels explicam sem excesso.
- Títulos funcionais, não decorativos.
- Nomenclatura consistente em toda navegação.

## 17. Tom de Interface
- Profissional e calmo.
- Confiança sem agressividade visual.
- Tecnicamente sólido e acessível ao usuário comum.
- Evitar interface barulhenta.

## 18. Acessibilidade Percebida
- Contraste adequado para dados principais.
- Área tocável confortável.
- Estados visuais distinguíveis.
- Organização visual favorável para baixa atenção sustentada.

## 19. Heurísticas de UX (na prática)
- Visibilidade do estado: aba ativa, filtros, totais.
- Correspondência com mundo real: linguagem financeira comum.
- Consistência e padrões: comportamento previsível.
- Reconhecimento > memorização.
- Estética minimalista com precisão.

## 20. Regra de Ouro do Projeto
- Sempre usar o padrão visual consolidado.
- Nunca criar variação de componente quando já existe padrão para a mesma função.
- Caminho mais simples e direto deve ser a primeira escolha.
- Em caso de dúvida, priorizar consistência sistêmica.

## 21. Heranca de Padrao (Paginas e Gavetas)
- Toda pagina nova deve seguir os mesmos padroes estruturais das paginas existentes.
- Toda gaveta nova deve seguir o mesmo modelo de drawer/sheet ja consolidado no app.
- Antes de criar qualquer bloco novo, reutilizar classes, componentes e comportamentos ja existentes.
- Se houver conflito entre "inovar visualmente" e "manter consistencia", manter consistencia.
- A variacao de conteudo e permitida; a variacao de padrao de componente nao e permitida para a mesma funcao.
