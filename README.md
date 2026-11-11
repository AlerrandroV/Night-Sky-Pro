# Night Sky Pro

Gere, direto no navegador, um mapa do céu noturno como ele estava (ou estará) em uma data, hora e local específicos, e exporte o resultado como imagem ou vetor para imprimir em um quadro ou pôster.

O Night Sky Pro é uma versão melhorada do projeto [NightSky](https://github.com/Denisolt/NightSky), de Denisolt, que por sua vez se baseia no planisfério de [Ernie Wright](http://www.etwright.org/astro/plani.html).

## Funcionalidades

- **Momento e local:** escolha data, hora, latitude e longitude, ou use os botões de hora atual e localização atual (geolocalização do navegador).
- **Objetos do céu:** estrelas, planetas, Lua, linhas e nomes de constelações, nomes de estrelas e objetos de céu profundo (DSOs), cada um podendo ser ligado ou desligado.
- **Personalização visual:** cor do céu, cor e escala das estrelas, cor e tamanho de cada tipo de rótulo, cor e espessura das linhas de constelação.
- **Informações no pôster:** coordenadas, data, hora e uma mensagem personalizada, todas opcionais.
- **Formatos de quadro:** A4, A3, A2, 15×15, 30×40, 40×50, 50×70, 60×90 cm ou tamanho personalizado.
- **Exportação:** salve como imagem (PNG) em resolução configurável ou como vetor (SVG).

## Como usar

Não precisa de instalação nem de build: é HTML, CSS e JavaScript puro.

```bash
git clone https://github.com/AlerrandroV/Night-Sky-Pro.git
cd Night-Sky-Pro
```

Depois abra o `index.html` no navegador. Para que o botão de localização atual funcione, alguns navegadores exigem que a página seja servida por HTTP, por exemplo:

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
js/plani.js      Desenho do céu, controles e exportação
js/jscolor.js    Seletor de cores (jscolor)
```

## Créditos

- **Ernie Wright**: autor dos cálculos astronômicos, do catálogo de objetos e do planisfério original em que todo o projeto se baseia ([etwright.org/astro/plani.html](http://www.etwright.org/astro/plani.html)).
- **Denisolt**: autor do [NightSky](https://github.com/Denisolt/NightSky), projeto que adaptou o planisfério para gerar pôsteres do céu noturno e que serviu de ponto de partida para este.
- **Jan Odvarko (East Desire)**: autor do [jscolor](https://jscolor.com), biblioteca usada no seletor de cores.

Muito obrigado a eles pelo trabalho aberto.

## Licença

O NightSky original foi distribuído sob a licença *"DO I LOOK LIKE I GIVE A SHIT PUBLIC LICENSE"*, que permite copiar, modificar e redistribuir o código, desde que o nome do projeto seja alterado. O texto completo está em [`LICENSE.original`](LICENSE.original).

As modificações feitas no Night Sky Pro são distribuídas sob a licença MIT, disponível em [`LICENSE`](LICENSE). Os créditos e avisos de autoria presentes no código original foram mantidos.

O `js/jscolor.js` é um componente de terceiros e segue a sua própria licença (GPLv3 para uso open source; uso comercial requer a licença comercial do jscolor).
