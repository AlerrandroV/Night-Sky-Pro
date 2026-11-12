# Night Sky Pro: regras do projeto

Gerador gratuito de pôsteres do céu noturno em HTML, CSS e JavaScript puro, sem build. Para testar, sirva a pasta por HTTP (`python3 -m http.server`): por `file://` o navegador bloqueia o carregamento das fontes.

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
- Ao mudar qualquer arquivo de `css/` ou `js/`, atualize o `?v=` de **todos** os links de CSS e JS no `index.html` (mesmo valor em todos, por exemplo a data com uma letra: `?v=20261112a`). O GitHub Pages deixa esses arquivos em cache por até 10 minutos; sem a versão nova, o navegador mistura o HTML novo com CSS ou JS antigos.
- Ícones SVG embutidos no HTML levam `width`, `height`, `fill` e `stroke` como atributos, para não depender do CSS para ter o tamanho certo.

## Textos do pôster

- Textos do pôster são desenhados com `poster_text` (`js/fonts.js`), que converte o texto em contornos com o opentype.js. Assim a fonte fica embutida no PNG e no SVG. Não use `<text>` com fonte personalizada.
- Fontes pré-programadas ficam em `fonts/` (WOFF, licença livre, com o arquivo de licença em `fonts/licenses/`) e são registradas em `FONT_PRESETS`.
- Bibliotecas de terceiros ficam em `js/lib/`, copiadas para o repositório (sem CDN).
