# Night Sky Pro

Gere, direto no navegador, um mapa do céu noturno como ele estava (ou estará) em uma data, hora e local específicos, e exporte o resultado como imagem ou vetor para imprimir em um quadro ou pôster.

O Night Sky Pro é uma versão melhorada do projeto [NightSky](https://github.com/Denisolt/NightSky), de Denisolt, que por sua vez se baseia no planisfério de [Ernie Wright](http://www.etwright.org/astro/plani.html).

## Por que este projeto existe

Muitos sites vendem quadros com o mapa do céu de uma data especial (um nascimento, um casamento, o dia em que duas pessoas se conheceram) a preços abusivos, quando o que eles fazem é basicamente calcular a posição das estrelas e gerar uma imagem.

O Night Sky Pro faz isso de graça. Ele é e sempre será **100% gratuito**, sem cadastro, anúncios ou venda de qualquer tipo. Você gera o arquivo, e a impressão e a montagem do quadro ficam por sua conta: leve o PNG ou o SVG à gráfica que preferir e pague só pela impressão.

## Funcionalidades

- **Momento e local:** escolha data, hora, latitude e longitude, ou use os botões "Agora" e "Minha localização" (geolocalização do navegador).
- **Elementos do céu:** estrelas e seus nomes, planetas, a Lua desenhada na fase exata do momento, linhas e nomes de constelações, objetos de céu profundo e uma grade de coordenadas equatoriais com rótulos de horas e declinações.
- **Personalização completa:** cada elemento pode ser ligado ou desligado e tem a própria cor e escala (tamanho ou espessura). O painel é organizado em seções expansíveis e esconde as opções que não fazem efeito, como a cor das linhas de constelação quando as linhas estão desligadas.
- **Moldura:** um retângulo perto das bordas do quadro e o contorno do céu, com cor e espessura ajustáveis.
- **Textos no pôster:** mensagem, data, hora e coordenadas, com cor e tamanho ajustáveis.
- **Código do Spotify:** cole o link de uma música, álbum, playlist ou podcast e o quadro ganha o código escaneável pelo app do Spotify, com cor e tamanho ajustáveis. O código é baixado do serviço do próprio Spotify (`scannables.scdn.co`), então precisa de internet.
- **Fontes:** 10 fontes prontas para a mensagem e para os detalhes (data, hora e coordenadas), ou qualquer outra importada de um arquivo (TTF, OTF, WOFF ou o .zip do dafont) ou pelo link de uma fonte do [dafont](https://www.dafont.com). Os textos viram contornos, então a fonte vai embutida no PNG e no SVG.
- **Formatos de quadro:** A4, A3, A2, 15×15, 30×40, 40×50, 50×70, 60×90 cm ou tamanho personalizado, com cor de fundo própria.
- **Exportação:** PNG em resolução configurável ou SVG vetorial, já com o tamanho físico do quadro em cm.

## Como usar

Não precisa de instalação nem de build: é HTML, CSS e JavaScript puro.

```bash
git clone https://github.com/AlerrandroV/Night-Sky-Pro.git
cd Night-Sky-Pro
```

Depois sirva a pasta por HTTP e abra no navegador. Abrindo o `index.html` direto do computador (`file://`), o navegador bloqueia o carregamento das fontes e, em alguns casos, a localização atual. Um servidor local resolve:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

## Estrutura

```
index.html       Página principal e painel de controles
css/             Estilos da interface
js/astro.js      Funções astronômicas base (Ernie Wright)
js/observer.js   Observador: data, hora e posição (Ernie Wright)
js/skypos.js     Posições de Sol, Lua e planetas (Ernie Wright)
js/skydb.js      Catálogo de estrelas, constelações e DSOs (Ernie Wright)
js/plani.js      Desenho do céu, pôster, controles e exportação
js/fonts.js      Fontes: pré-programadas, importadas e do dafont
js/jscolor.js    Seletor de cores (jscolor)
js/lib/          opentype.js (texto em contornos) e JSZip (abrir .zip)
fonts/           Fontes pré-programadas (WOFF) e suas licenças
```

## Créditos

- **Ernie Wright**: autor dos cálculos astronômicos, do catálogo de objetos e do planisfério original em que todo o projeto se baseia ([etwright.org/astro/plani.html](http://www.etwright.org/astro/plani.html)).
- **Denisolt**: autor do [NightSky](https://github.com/Denisolt/NightSky), projeto que adaptou o planisfério para gerar pôsteres do céu noturno e que serviu de ponto de partida para este.
- **Jan Odvarko (East Desire)**: autor do [jscolor](https://jscolor.com), biblioteca usada no seletor de cores.
- **[opentype.js](https://opentype.js.org)** (MIT): converte os textos do pôster em contornos.
- **[JSZip](https://stuk.github.io/jszip/)** (MIT): abre os arquivos .zip de fontes.
- **Fontes** Inter, Montserrat, Josefin Sans, Playfair Display, Cormorant Garamond, Cinzel, Great Vibes, Dancing Script, Pacifico e Caveat, todas sob a [SIL Open Font License](https://openfontlicense.org), obtidas pelo [Fontsource](https://fontsource.org). As licenças estão em `fonts/licenses/`.

Muito obrigado a eles pelo trabalho aberto.

## Licença

O NightSky original foi distribuído sob a licença *"DO I LOOK LIKE I GIVE A SHIT PUBLIC LICENSE"*, que permite copiar, modificar e redistribuir o código, desde que o nome do projeto seja alterado. O texto completo está em [`LICENSE.original`](LICENSE.original).

As modificações feitas no Night Sky Pro são distribuídas sob a licença MIT, disponível em [`LICENSE`](LICENSE). Os créditos e avisos de autoria presentes no código original foram mantidos.

O `js/jscolor.js` é um componente de terceiros e segue a sua própria licença (GPLv3 para projetos open source), que se aplica a este projeto por ele ser gratuito e de código aberto.
