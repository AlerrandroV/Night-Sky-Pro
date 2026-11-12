# Night Sky Pro: regras do projeto

Gerador gratuito de pôsteres do céu noturno em HTML, CSS e JavaScript puro, sem build. Abra o `index.html` no navegador para testar.

## Personalização da arte

Quanto mais personalizável for a arte, melhor.

- Todo elemento visual novo do pôster (grade, moldura, rótulos, textos etc.) vem com:
  - um interruptor para **habilitar/desabilitar**;
  - uma opção de **cor**;
  - uma opção de **escala** (espessura para linhas, tamanho para textos e símbolos).
- Sub-elementos com aparência própria (por exemplo, os rótulos da grade) ganham o mesmo trio.

## Painel de configurações

- As opções ficam agrupadas em **seções expansíveis** (`<details class="group">`), uma por assunto.
- Uma opção que não tem efeito na situação atual fica **oculta**. Exemplo: a espessura das linhas de constelação só aparece com as linhas ligadas. Use `data-show-if="id_do_interruptor"` no `.set-item`; vários ids separados por espaço exigem todos ligados.
- Toda configuração do pôster é registrada na tabela `SETTINGS` em `js/plani.js`. Ela liga o campo do formulário à variável global. Não leia nem grave campos de configuração fora dela.
- Textos da interface em português.
