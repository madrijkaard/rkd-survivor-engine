# Codó Sobrevive

Um passeio por ruas de Codó, Maranhão, transformadas em um cenário navegável com a estética dos jogos de PlayStation 1.

## 1 - Sobre o projeto

**Codó Sobrevive** é um jogo de exploração em terceira pessoa, com visão aérea oblíqua e gráficos 2D pré-renderizados, inspirado na apresentação de jogos como *Parasite Eve*.

O cenário conecta as ruas **Simeão de Macedo**, **Cônego Mendonça** e **Antônio Alexandre**, no bairro **Centro**, com retorno pela Vinte e Oito de Julho. A reconstrução usa 416 fotografias do Google Street View, distribuídas em 52 pontos, para representar casas, fachadas, árvores, praças e estabelecimentos.

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

- Três ruas conectadas, com casas individualizadas, fachadas de esquina compartilhadas e construções acompanhando a curva da Antônio Alexandre.
- Quatro orientações de câmera, vista aérea do conjunto e minimapa navegável.
- Caminhada, corrida moderada e trajetos por clique que desviam dos obstáculos.
- Interior acessível do **Bar O Péricles**, com três mesas de sinuca, balcão e atendimento: “E aí meu chapa, o que vai querer?”.
- **Igreja da Matriz**, **Escola Santa Filomena**, **Praça do Cinema** e a escultura do **Cruzeiro do Sul** integradas ao cenário.
- Associação da posição da personagem ao conjunto de oito fotos da área, disponível pela tecla **E**.
- Bairro atual exibido no cabeçalho a partir dos manifestos, com estrutura para mudanças de bairro e nomes opcionais de construções e monumentos.
- Filtro retrô, som opcional e controles de toque.

| Controle | Ação |
| --- | --- |
| WASD ou setas | Caminhar na direção da tela. |
| Shift | Correr. |
| Clique no chão ou minimapa | Caminhar até o destino. |
| Dois cliques rápidos no mesmo lugar | Correr até o destino; um novo clique simples volta à caminhada. |
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
│   ├── simeao-de-macedo/      # 17 pontos e 136 fotos
│   ├── conego-mendonca/       # 15 pontos e 120 fotos
│   └── antonio-alexandre/     # 20 pontos e 160 fotos
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

Os testes usam os arquivos locais e não precisam do servidor HTTP. Consulte [tests/AGENTS.md](tests/AGENTS.md) para saber o que cada arquivo verifica.
