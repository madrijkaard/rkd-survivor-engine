# Codó Sobrevive

Um passeio por ruas de Codó, Maranhão, transformadas em um cenário navegável com a estética dos jogos de PlayStation 1.

## 1 - Sobre o projeto

**Codó Sobrevive** é um jogo de exploração em terceira pessoa, com visão aérea oblíqua e gráficos 2D pré-renderizados, inspirado na apresentação de jogos como *Parasite Eve*.

O cenário conecta as ruas **Simeão de Macedo**, **Cônego Mendonça**, **Antônio Alexandre**, **Vinte e Oito de Julho**, **Fernando Carvalho**, **Praça Alcebíades Silva**, **Coelho Neto** e **Avenida São Benedito**, no bairro **Centro**, com retorno pela Vinte e Oito de Julho e volta completa pela Fernando Carvalho e pela Cônego Mendonça até a Simeão. A reconstrução usa 1592 fotografias do Google Street View, distribuídas em 199 pontos, para representar casas, fachadas, árvores, praças e estabelecimentos.

As fotografias orientam cores e detalhes; dimensões e partes não visíveis são aproximações artísticas. O projeto funciona localmente, para um jogador, sem servidor de partidas online.

## 2 - Tecnologias utilizadas

| Tecnologia | Uso |
| --- | --- |
| JavaScript com módulos ES | Lógica do jogo, navegação, localização e interação. |
| Canvas 2D | Preparação dos cenários, projeção das quatro câmeras e composição com os sprites da personagem. |
| HTML e CSS | Interface, controles, janelas de fotos e adaptação a diferentes telas. |
| Web Audio API | Ambiente sonoro e passos sintetizados. |
| Node.js e npm | Servidor HTTP local e execução dos comandos do projeto. |
| `node:test` | Testes de geometria, movimento, câmeras, manifestos e fotografias. |
| JSON e JPEG | Metadados do mapeamento e imagens de referência. |
| Python e Pillow — opcionais | Geração de montagens fotográficas nas ferramentas de desenvolvimento. |

O jogo não utiliza framework, WebGL ou bibliotecas externas. Os fundos estáticos são preparados em canvases fora da tela e combinados com a personagem durante a navegação.

## 3 - Recursos do jogo

- A Simeão atravessa a Cônego Mendonça e segue até a esquina com a Henrique Figueiredo, com 14 novos pontos fotografados e coordenadas WGS84.
- A Antônio Alexandre também atravessa a Cônego, passa ao lado da Praça da Matriz e alcança a Henrique Figueiredo. A extensão possui 14 pontos e 112 fotos, preservando as referências anteriores.
- Oito vias conectadas, com casas individualizadas, fachadas de esquina compartilhadas e construções acompanhando a curva da Antônio Alexandre.
- A Praça Alcebíades Silva liga a esquina da Metalmar à Vinte e Oito de Julho: quinze pontos, passando pela Policlínica Cortez, biblioteca, Travessa Z. Cardoso, Sicoob, quadra e Crefisa. Pela Vinte e Oito, o retorno até a Fernando está conectado, com farmácia, óticas e fachadas compartilhadas nas esquinas.
- Quatro orientações de câmera, vista aérea do conjunto e minimapa navegável.
- Caminhada e corrida com animações em oito direções: o clique orienta a personagem para o trajeto, que desvia dos obstáculos.
- Interior acessível do **Bar O Péricles**, com três mesas de sinuca, balcão e atendimento: “E aí meu chapa, o que vai querer?”.
- **Igreja da Matriz**, **Escola Santa Filomena**, **Praça do Cinema** e a escultura do **Cruzeiro do Sul** integradas ao cenário.
- Associação da posição da personagem ao conjunto de oito fotos da área, disponível pela tecla **E**.
- Cidade, bairro e rua atual exibidos no cabeçalho a partir dos manifestos; o nome da rua acompanha a mudança de via nas esquinas. Nomes opcionais de construções e monumentos continuam disponíveis.
- Filtro retrô, som opcional e controles de toque.
- Horário sincronizado com o relógio e o fuso do servidor, com sombras solares móveis e postes que acendem às 18:00 e apagam às 05:30. Na câmera inicial, o Sol nasce no canto inferior direito e se põe no superior esquerdo; girar a câmera preserva sua direção no mundo. Cerca de 70% das casas com janelas têm brilho interno quente no mesmo período noturno, sem iluminar paredes ou chão.

| Controle | Ação |
| --- | --- |
| WASD ou setas | Andar rápido na direção da tela. |
| Shift | Correr. |
| Clique no chão ou minimapa | Andar rápido até o destino. |
| Dois cliques rápidos no mesmo lugar | Correr até o destino; um novo clique simples volta ao andar rápido. |
| Q / Girar câmera | Alternar entre as quatro perspectivas. |
| M / Vista aérea | Ver o conjunto das ruas. |
| E | Abrir as oito fotografias do ponto atual. |
| R | Voltar ao início, junto à praça. |
| PS1 | Alternar resolução e filtro retrô. |
| Som | Ativar ou desativar o áudio, inicialmente desligado. |
| ? | Consultar a ajuda. |

Para visitar o bar, clique em uma porta aberta ou use o botão de entrada quando disponível. Dentro dele, clique em Péricles para se aproximar do balcão e conversar; use o botão de saída para retornar à rua.

## 4 - Como está estruturado o projeto

```text
rkd-survive-engine/
├── AGENTS.md                  # Guia técnico da raiz para a IA
├── README.md                  # Apresentação e execução do jogo
├── index.html                 # Página e elementos da interface
├── style.css                  # Estilos e apresentação responsiva
├── server.mjs                 # Servidor HTTP local
├── package.json               # Configuração e comandos npm
├── package-lock.json          # Registro do pacote npm
├── maps/
│   ├── AGENTS.md              # Contrato dos manifestos e fotografias
│   ├── simeao-de-macedo/      # 31 pontos e 248 fotos
│   ├── conego-mendonca/       # 37 pontos e 296 fotos
│   ├── antonio-alexandre/     # 34 pontos e 272 fotos
│   ├── vinte-e-oito-de-julho/ # 29 pontos e 232 fotos
│   ├── fernando-carvalho/     # 17 pontos e 136 fotos
│   └── praca-alcebiades-silva/ # 10 pontos e 80 fotos
├── reference/
│   ├── AGENTS.md              # Guia das ferramentas e referências
│   ├── README.md              # Organização e comandos de mapeamento
│   ├── scripts/               # Captura de fotos e geração de dados/montagens
│   ├── streets/               # Levantamentos e comparações por rua
│   └── screenshots/           # Registros históricos do jogo
├── src/
│   ├── AGENTS.md              # Arquitetura e função de cada módulo
│   └── *.js                   # Mundo, desenho, controles e interação
└── tests/
    ├── AGENTS.md              # Cobertura e execução dos testes
    └── *.test.mjs             # Verificações automatizadas
```

Cada rua em `maps/` possui um `manifest.json` com cidade, bairro, nome da rua e coordenadas dos panoramas. Cada `ponto-NN/` contém `1.jpg` a `8.jpg`, na ordem **N, NE, L, SE, S, SO, O, NO**. As coordenadas geográficas das fotos são preservadas separadamente das posições artísticas do cenário.

Para trabalhar no código, comece pelo [guia da raiz](AGENTS.md) e pelo [guia de src](src/AGENTS.md). O [guia de maps](maps/AGENTS.md) explica a associação entre imagens e pontos; o [README de reference](reference/README.md) reúne os comandos de mapeamento. A documentação detalhada das referências e dos testes está em [reference/AGENTS.md](reference/AGENTS.md) e [tests/AGENTS.md](tests/AGENTS.md).

## 5 - Como executar o jogo

Tenha **Node.js 20 ou posterior**, com npm, e um navegador atualizado. Abra um terminal na raiz do projeto e execute:

```sh
npm start
```

Acesse [http://127.0.0.1:4173/](http://127.0.0.1:4173/). Aguarde a preparação das quatro vistas no primeiro carregamento. Mantenha o terminal aberto enquanto joga e use **Ctrl+C** para encerrar o servidor.

Não é necessário executar `npm install` ou um comando de build. Use o endereço HTTP: abrir `index.html` diretamente não carrega corretamente os módulos e manifestos.

O jogo consulta `/api/time` ao iniciar, a cada minuto e ao voltar à aba. A hora e o fuso vêm da máquina que executa `server.mjs`; o relógio continua avançando entre consultas. Não há controle manual de horário. Após atualizar o código do servidor, reinicie `npm start` e recarregue a página.

### Se a porta 4173 já estiver em uso

O erro `EADDRINUSE` indica que já existe um processo nessa porta. Primeiro, veja se o jogo já abre no endereço acima. Para iniciar em outra porta, no **PowerShell**:

```powershell
$env:PORT = "4174"
npm start
```

No **Git Bash**:

```sh
PORT=4174 npm start
```

Nesse caso, acesse [http://127.0.0.1:4174/](http://127.0.0.1:4174/). O servidor atende apenas no computador local.

### Executar os testes

Na raiz, em outro terminal se o servidor estiver ativo:

```sh
npm test
```

Os testes usam os arquivos locais e não precisam de um servidor iniciado manualmente. O teste do relógio abre e encerra seu próprio servidor em uma porta local temporária. Consulte [tests/AGENTS.md](tests/AGENTS.md) para saber o que cada arquivo verifica.

A largura das pistas segue o tipo explícito `roadType` de cada manifesto: ruas comportam quatro carros lado a lado (128 unidades do jogo) e avenidas, cinco (160). Cada calçada de rua comporta duas pessoas (40 unidades); cada calçada de avenida, quatro (80). O campo obrigatório `sidewalkType` registra `calcada-de-rua` ou `calcada-de-avenida` nos dois lados de todos os trechos da rota. Calçadas ficam fora da largura da pista. Sete rotas estão registradas como ruas e a Avenida São Benedito usa o perfil de avenida; carros, colisões e sombras compartilham a referência de largura de 32 unidades.

A caminhada padrão usa a antiga velocidade rápida (100 unidades/s); a corrida usa 125 unidades/s, 25% a mais. Clique simples/toque e WASD/setas andam rápido; clique duplo/duplo toque ou Shift correm com animação própria de passadas, braços dobrados e inclinação do corpo.


A **Rua Coelho Neto** conecta o extremo leste da Vinte e Oito à Cônego Mendonça, junto à Praça da Matriz. São 22 pontos com oito fotos cada, passando pelo ginásio, casas e terrenos arborizados. O acervo total contém 199 pontos e 1592 JPEGs.

A Cônego Mendonça continua para oeste da Praça Alcebíades Silva até a Avenida São Benedito, passando pelo Santander, Cartório Eleitoral e Impacto Calçados. Os seis pontos dessa extensão possuem 48 fotos; o cruzamento conecta a rota própria da avenida descrita abaixo.


## Avenida São Benedito — sentido sul

A oitava rota percorre o lado oeste da Praça Alcebíades Silva, da Cônego Mendonça à Vinte e Oito de Julho, junto ao Banco do Brasil. São 14 pontos e 112 arquivos: oito reutilizados de Cônego/37 e 104 fotos novas. O acervo soma 199 pontos e 1592 JPEGs. O acesso intermediário ao terreno anunciado à venda não foi tratado como rua.
