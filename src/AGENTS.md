# Guia da IA — src

## Escopo e organização

Este diretório contém os módulos ES do jogo. Complemente a leitura com o [guia da raiz](../AGENTS.md). Os nomes de arquivos abaixo são relativos a `src/`; comandos de teste partem da raiz do projeto.

A renderização usa **Canvas 2D**. O catálogo descreve posições no chão e alturas para uma projeção oblíqua; não há WebGL, malhas de um motor 3D, framework ou etapa de compilação. Geometria e regras puras são importadas também por testes Node. Módulos de desenho e interface usam APIs do navegador.

## Função de cada arquivo

### Inicialização, mundo e metadados

| Arquivo | Responsabilidade e relações |
| --- | --- |
| `AGENTS.md` | Este guia: módulos, fluxo de dados, contratos e orientação para mudanças. |
| `game.js` | Entrada carregada por `index.html`. Mantém personagem, câmera, caminho, estado de exploração e interface; registra teclado, ponteiro e toque; controla minimapa, janelas de fotos/ajuda, entrada e diálogo do bar, som sintetizado e loop de animação. Inicializa manifestos e cena, sem implementar sozinho a geometria das casas. |
| `world.js` | Integra os catálogos das três ruas, pontos, fachadas compartilhadas, lugares nomeáveis, árvores, carros, postes, áreas transitáveis e obstáculos. Exporta `routes`, `allPoints`, `buildings`, `places`, `getPlace`, `locationAt`, `imagePath`, `walkable`, `moveActor`, `clearLine` e `findPath`. É o ponto central da localização e navegação. |
| `map-manifests.js` | Exporta `MAP_DIRECTIONS`, `validateMapManifest` e `loadMapManifests`. Lê `maps/<route.folder>/manifest.json`, valida esquema e associação dos IDs e carrega metadados de rua/bairro/GPS sem alterar posições artísticas. Aceita uma função de fetch injetada para testes. |
| `server-clock.js` | Consulta `/api/time` sem cache, valida a hora/fuso do servidor e avança a amostra com `performance.now()`. Compensa metade do tempo de ida/volta e compartilha sincronizações concorrentes. Não usa o relógio civil ou fuso do navegador. |
| `place-names.js` | Cadastro `PLACE_NAMES` por ID estável e função `withPlaceName`. Acrescenta `displayName` opcional e `placeType`, preservando a descrição antiga em `name`. Não cria etiquetas na interface nem altera letreiros desenhados. |

### Projeção, renderização e movimento

| Arquivo | Responsabilidade e relações |
| --- | --- |
| `projection.js` | Define as quatro `CAMERA_VIEWS`, a projeção ativa `PROJECTION`, `project`/`unproject`, seleção de câmera e escopos temporários `withCameraView`/`withCrossStreetFrame`. Converte o plano do mundo em tela e permite desenhar fachadas transversais em um referencial local. |
| `render.js` | Carrega fotografias selecionadas, cria texturas e canvases estáticos, calcula limites e profundidade, prepara as quatro vistas em `createScene`, cria sprites com `createActorFrames` e compõe o quadro em `renderWorld`. Integra desenho das ruas, prédios, vegetação, sombras, fios e interior do bar. |
| `lighting.js` | Regras puras do horário em minutos, posição artística do Sol, deslocamento das sombras, escurecimento e postes ligados entre 18:00 e 05:29. Define as posições das lâmpadas usadas no desenho e no brilho. |
| `lighting-render.js` | Projeta volumes do cenário em sombras no chão, preservando plantas inclinadas. Mantém um caminho de sombras por câmera/horário e uma camada de luz do tamanho da tela, com ocultação pelos sprites. Aplica o ambiente noturno; a camada emissiva também recebe as janelas preparadas por `render.js`. |
| `home-lighting.js` | Seleciona aproximadamente 70% das residências com janelas existentes, por ordenação determinística de IDs. Exclui usos comerciais/públicos e conta fachadas locais, transversais e traseiras uma só vez. |
| `architecture.js` | `drawDetailedBuilding` projeta as texturas de fachadas, faces laterais/traseiras e telhados no volume do prédio. Usa a planta comum de `building-geometry.js` e a orientação de câmera para decidir faces visíveis. Trata fachadas transversais e de fundos. |
| `facades.js` | `makeDetailedFacade` desenha a textura plana de uma fachada: pintura, desgaste, portas, janelas, grades, revestimentos e inscrições. As fotos podem contribuir sutilmente com a textura. Usa detalhes específicos de `antonio-facades.js`. |
| `building-geometry.js` | Fonte comum da planta dos prédios: `buildingFootprint`, `buildingPlanPoint`, `footprintBounds`, `footprintObstacle` e `hitsFootprint`. Suporta retângulos e quadriláteros; a interpolação da planta mantém paredes, cobertura e colisão coerentes em lotes inclinados. |
| `street-details.js` | Desenha árvores, canteiros, conjunto de poste/banco, muro ajardinado, demolição, recuo de tijolos, arbustos, lixeiras e placa. `drawPlanter` encaminha o monumento para `cinema-monument.js`. Usa dados do mundo/catálogo, em vez de controlar a personagem. |
| `click-navigation.js` | Reconhecimento puro de clique simples/duplo, com `createClickNavigation().select/reset`; exporta `WALK_SPEED = 67` e `RUN_SPEED = 100`. Preserva o destino do primeiro clique quando o segundo inicia corrida, evitando que o movimento da câmera desloque o destino. |

### Catálogos e desenho de cada rua

| Arquivo | Responsabilidade e relações |
| --- | --- |
| `street-data.js` | Catálogo manual da Simeão: `streetBuildings`, `specialBuildings`, muros, lote de demolição, recuos, arbustos e lixeiras. Contém fachadas dos dois lados, cores, aberturas, alturas, coberturas e referências fotográficas. |
| `mendonca-points.js` | **Arquivo gerado** dos 15 pontos da Cônego Mendonça. O gerador transforma a distância acumulada entre coordenadas geográficas em posições no eixo transversal do cenário. É enriquecido com descrições em `world.js`. |
| `mendonca-data.js` | Geometria e catálogo da Cônego: `CROSS_Y`, extensão/limites do mundo, construções, fachadas de esquina, árvores e postes, praça da igreja, nave, torre, bancos e monumento da praça. Define também suas ruas de contorno. |
| `mendonca-render.js` | Desenho específico do chão transversal e praça (`drawMendoncaGround`), torre/nave da igreja, bancos e estátua. A igreja permanece dentro da praça, com ruas livres em seu entorno. |
| `antonio-points.js` | **Arquivo gerado** dos 20 pontos da Antônio Alexandre. Conserva registros dos panoramas e projeta suas coordenadas no referencial artístico, ajustando o percurso às junções existentes. |
| `antonio-data.js` | Catálogo e geometria da Antônio: `antonioCenter(y)` interpola a curva, `onAntonioRoad` delimita a rua e `alignAntonioCorner` ajusta esquinas compartilhadas. Define plantas dos lotes, casas, escola, fachadas, cinema, jardim, conexão com a Vinte e Oito de Julho, vegetação, carros e outros objetos. |
| `antonio-facades.js` | `drawAntonioOpeningDetails` e `drawAntonioFacade` acrescentam os motivos específicos observados: portões, cobogós, revestimentos, pilares, mural da escola e detalhes de estabelecimentos. É chamado pelo desenho comum de fachadas. |
| `antonio-render.js` | `drawAntonioGround` desenha rua curva, calçadas, jardins junto ao cinema e ligação final; `drawAntonioCactus` desenha os cactos. Deve acompanhar os mesmos limites geométricos usados no catálogo e na navegação. |

### Bar e Praça do Cinema

| Arquivo | Responsabilidade e relações |
| --- | --- |
| `bar-layout.js` | Define `BAR`: identificação, limites do salão, duas portas, entrada/saída, balcão, três mesas, posição de Péricles e ponto de atendimento. Exporta também `insideBar`, `barWalkAreas` e `barObstacles` para alinhar interação e colisão. Guarda a saudação do atendente. |
| `bar-render.js` | `createBarScene` prepara as camadas exterior/interior do bar; `createPericlesSprite` desenha o atendente. Representa mesas/bolas, tacos, balcão e garrafas. O telhado sai da composição quando a personagem está dentro. Segue a planta de `bar-layout.js`. |
| `cinema-plaza.js` | Define a Praça do Cinema e a posição/dimensões do Cruzeiro do Sul. Esses dados alimentam tanto desenho quanto colisão. É o lugar para deslocar o monumento, sem criar uma segunda posição apenas visual. |
| `cinema-monument.js` | `drawCinemaMonument` representa a escultura: degraus brancos, pedestal com painéis, braços dourados alargados e medalhão central com aros. Sua forma segue as referências fornecidas pelo usuário. |

## Fluxo de execução

1. `game.js` importa mundo, renderização, projeção, regras de clique, bar e manifestos. Os catálogos formam o mundo em memória.
2. `init()` ajusta a tela e aguarda `loadMapManifests(routes)` e a primeira sincronização de `/api/time`. O carregador valida todas as ruas antes de modificar metadados; um erro não deve deixar apenas parte das ruas atualizada.
3. `createScene` prepara as quatro vistas usando os mesmos objetos do mundo, com projeções e ordens de profundidade próprias. Fotografias ausentes têm tratamento no carregamento de imagens para permitir desenho de fachada sem essa textura; isso não elimina a necessidade de manter as capturas completas.
4. A cena e os sprites são disponibilizados ao loop `requestAnimationFrame`. A cada quadro, movimento e câmera são atualizados e as camadas já preparadas são compostas com a personagem.
5. `updateHud` consulta `locationAt`, atualiza cidade/bairro, minimapa e estado de interação. A janela de E busca os oito arquivos do ponto associado.

O estado da partida é local à página. Não há sincronização entre jogadores, banco de dados ou sistema de salvamento persistente implementado.

## Horário, Sol e postes

O comprimento projetado das sombras usa escala artística de 70% (redução de 30%), inclusive para árvores e personagem. Esse fator ajusta o deslocamento no chão, preservando a direção solar e as plantas dos objetos.

As árvores da Praça da Matriz, identificadas por `plaza: true` em `mendoncaTrees`, recebem mais 30% de redução no comprimento em `lighting-render.js` (49% da projeção original). O ajuste altera apenas a altura do volume usado para sua sombra, sem mudar a árvore desenhada, o tamanho da copa ou as sombras de outros elementos.

Na Praça do Cinema, árvores (incluindo copas que alcançam a borda), arbustos, canteiros, bancos, poste, pavilhão e Cruzeiro do Sul também recebem redução local de 30% sobre a escala global. `cinemaShadowScale` usa os limites de `CINEMA_PLAZA`; tronco e copa compartilham o mesmo fator, assim como todas as partes do monumento. O ajuste vale ao nascer e ao pôr do Sol e mantém os desenhos e as colisões originais.

O horário acompanha o relógio e o fuso da máquina que executa `server.mjs`. A barra manual foi removida. `/api/time` retorna `timestamp` (Unix em milissegundos) e `timezoneOffsetMinutes` (convenção de `Date.getTimezoneOffset`), com `Cache-Control: no-store`. A sincronização acontece na inicialização, a cada 60 segundos e ao recuperar foco/visibilidade. Entre consultas, a amostra avança por tempo monotônico; falhas posteriores preservam esse avanço e a primeira sincronização é obrigatória. Mudanças de fuso/relógio no servidor entram na próxima amostra. `game.js` atualiza a iluminação uma vez por segundo, evitando refazer os caminhos de sombra a cada quadro. `data-time`, `data-lamps-on` e `data-clock-synced` no canvas permitem verificar o estado sem um painel na interface.

O ciclo solar permanece artístico: Sol nasce às 06:00 no canto inferior direito da câmera inicial, passa pelo zênite às 12:00 e se põe às 18:00 no canto superior esquerdo. Sua direção permanece fixa no mundo quando Q gira a câmera. Após alterar `server.mjs`, reinicie o servidor para disponibilizar a nova rota.

Sombras solares ficam opostas ao Sol, alongam perto do horizonte e desaparecem à noite. Não devem ser gravadas no chão estático. As plantas compartilhadas também alimentam seus volumes; objetos complexos usam aproximações, e a escultura do cinema tem pedestal e braços separados. O piso interno do bar cobre sombras externas. O ambiente clareia entre 05:00 e 07:00 e escurece gradualmente entre 15:00 e 19:00. Os postes acendem exatamente às 18:00 e apagam às 05:30; essa regra é independente da transição suave do ambiente. No mesmo período, 17 das 24 residências com janelas existentes (70%, arredondado) recebem luz interna quente; não são criadas aberturas em muros ou fachadas vedadas. `home-lighting.js` mantém a escolha determinística por ID, independente da câmera e da ordem do catálogo. `makeDetailedFacade(..., lightPass)` desenha somente emissão nas janelas, contida pelas molduras, grades e frestas das venezianas de madeira. `drawDetailedBuilding(..., lightPass)` reutiliza projeção e visibilidade das fachadas, mascarando cercas, vegetação e outros detalhes próprios. Os canvases emissivos são preparados nas quatro vistas e compostos na ordem de profundidade, com a mesma transparência do prédio; não há halo externo de janela nem iluminação do chão por casas. A camada de brilho é ocultada na mesma ordem de profundidade dos sprites para não iluminar fachadas por cima.

## Três sistemas de coordenadas

| Sistema | Onde aparece | Regra de uso |
| --- | --- | --- |
| Latitude/longitude WGS84 | Manifestos e metadados dos pontos | Identifica onde a captura real foi feita. Não passar diretamente para `project`, colisões ou caminhos. |
| Mundo artístico `x/y`, altura `z` | Catálogos, personagem, obstáculos, planta | Define o cenário e as distâncias navegáveis em unidades do jogo. `z` afeta o desenho vertical; o percurso é calculado no chão. |
| Tela/projeção | Canvas, câmera, clique e sprites | Resultado de `project` mais enquadramento/escala da câmera. Converter cliques de volta ao plano antes de navegar. `unproject` corresponde ao chão, não à superfície elevada de um telhado. |

`PROJECTION` é um binding exportado mutável. Use `withCameraView` e `withCrossStreetFrame` para desenho temporário: ambos restauram o estado anterior em `finally`. O escopo de pré-renderização é síncrono; não deixe uma projeção temporária ativa enquanto aguarda tarefas assíncronas.

Girar câmera muda projeção, faces visíveis e profundidade. Não rotacione os dados do mundo, o destino ou a personagem para simular a troca. Cada vista é preparada separadamente; espelhar uma imagem pronta inverteria letras e não revelaria as fachadas corretas.

## Localização, fotos e bairros

`routes` contém `id`, `folder`, `name` e `points`; após carregar manifestos, também contém `city` e `neighborhood`. Os pontos recebem `pano`, `latitude`, `longitude` e o bairro efetivo. A rota `simeao` usa a pasta `simeao-de-macedo`; as demais têm ID igual à pasta.

`locationAt(x, y)` compara a distância aos segmentos dos percursos para escolher uma rua e então procura seu ponto mais próximo. Retorna `{ route, point, city, neighborhood }`. Na junção, a proximidade é geométrica; não existe uma planta cadastral de bairros. `pointAt(y)` é uma função legada limitada aos 17 pontos da Simeão: não a use para localizar o mundo inteiro.

`imagePath(point, direction, street)` recebe o número do ponto e da direção (1–8). Preserve essa associação quando alterar catálogos. Os campos `title`, `detail` e `area` dos pontos continuam sendo metadados mesmo sem o antigo painel inferior esquerdo. O cabeçalho deve usar o bairro carregado, e E deve continuar funcionando.

## Construções, curvas e colisões

As construções possuem IDs estáveis e propriedades como posição, dimensões, altura, cobertura, cores, `openings`, letreiros, `point` e `refs`. Em `street-data.js`, `refs` reúne pares de ponto/direção das imagens que mostram aquela construção. As aberturas usam posição/largura normalizadas na fachada (`u`, `w`) e dados verticais como `bottom`/`h`; consulte o consumidor em `facades.js` antes de adicionar um tipo.

Na Antônio Alexandre, as fachadas acompanham a linha interpolada da rua e compartilham suas divisas. `buildingFootprint` fornece a planta e `buildingPlanPoint` transforma coordenadas da construção para essa planta. `footprintObstacle` e `hitsFootprint` usam o mesmo contorno na colisão. Nas esquinas, respeite o referencial local da fachada transversal e sua conversão para o mundo.

`world.js` combina fachadas de esquina e fundos (`crossFacade`, `backFacade`) com volumes existentes, evitando construir duas vezes a mesma casa ou o cinema. Ao corrigir alinhamento, revise planta, calçada, telhado, sombra e obstáculo, além da aparência frontal.

Mantenha os recortes do muro azul diante das entradas da Escola Santa Filomena. Um portão fechado pode bloquear a personagem sem ser coberto por outro muro. A casa rosa junto à praça deve encontrar o sobrado no mesmo alinhamento. A base do Cruzeiro do Sul deve permanecer inteiramente dentro da Praça do Cinema.

`walkable` considera limites transitáveis, obstáculos e raio da personagem. `findPath` busca um trajeto numa grade e verifica segmentos com `clearLine`. `moveActor` subdivide deslocamentos em passos menores para evitar atravessar obstáculos durante a corrida. Alterar velocidade ou dimensão da personagem exige conferir portas, mesas e lotes inclinados.

## Clique, bar e nomes próprios

O clique duplo atual exige até 350 ms, distância de até 12 pixels, mesma superfície de entrada e mesmo tipo de ponteiro. O segundo clique reutiliza o destino do primeiro, pois a câmera pode ter se movido. Um clique simples novo caminha; a corrida usa 100 unidades/s contra 67 da caminhada. Preserve a reinicialização do gesto quando a interação for interrompida.

`BAR.buildingId` é o ID histórico **`w15-fc-motos-yamaha`**. Embora o estabelecimento agora seja chamado O Péricles, não renomeie o ID apenas para trocar seu nome visível: ele conecta prédio, planta, renderização e cadastro de nomes. Mesas, balcão e atendente têm colisão; o clique no atendente conduz ao ponto de conversa acessível, em vez de colocar a personagem sobre ele.

O cadastro atual em `PLACE_NAMES` inclui:

| ID | Nome próprio |
| --- | --- |
| `w15-fc-motos-yamaha` | O Péricles |
| `cm-igreja-praca` | Igreja da Matriz |
| `praca-do-cinema` | Praça do Cinema |
| `cruzeiro-do-sul` | Cruzeiro do Sul |

Para nomear um objeto existente, acrescente seu ID em `PLACE_NAMES`. `withPlaceName` fornece `displayName: null` quando não houver cadastro, com `placeType` padrão `building`; praças e monumentos usam `square` e `monument`. O registro consultável é `places` em `world.js`; `getPlace(id)` retorna o objeto ou `null`. Um objeto novo também precisa entrar nesse registro. Letreiros pintados na fachada são configurados separadamente.

## Arquivos gerados e mudanças frequentes

`mendonca-points.js` e `antonio-points.js` são saídas destes comandos, executados na raiz:

```sh
node reference/scripts/generate/generate-mendonca-points.mjs
node reference/scripts/generate/generate-antonio-points.mjs
```

Os comandos **sobrescrevem** esses dois arquivos. Corrija a entrada em `maps/` ou a transformação no gerador conforme a causa, em vez de manter uma correção apenas na saída que será perdida na próxima geração. A Simeão mantém suas posições originais em `world.js` e não tem um gerador equivalente. Gerar pontos não gera casas, descrições nem colisões automaticamente.

| Alteração | Comece por | Verifique também |
| --- | --- | --- |
| Cores, portas ou janelas | Catálogo da rua e `facades.js`/`antonio-facades.js` | Fotos de vários pontos e desenho nas quatro vistas. |
| Alinhamento de casas | `antonio-data.js`/catálogo e `building-geometry.js` | Calçadas, lotes vizinhos, telhados, sombras e colisões. |
| Bairro ou dados das capturas | Manifesto e `map-manifests.js` | E, cabeçalho, preservação de `x/y`, testes de manifestos. |
| Câmera | `projection.js`, `render.js`, `game.js` | Cliques, profundidade, letras, minimapa, bar e preservação do destino. |
| Interior do bar | `bar-layout.js` e `bar-render.js` | Duas portas, três mesas, conversa e caminho de saída. |
| Mover monumento | `cinema-plaza.js` | Posição desenhada, base dentro da praça e passagem ao redor. |
| Acrescentar rua | Manifesto, pontos, catálogo, `world.js` e desenho | Junções, volumes compartilhados, minimapa, fotos e testes da rota. |

Evite refazer o cenário estático a cada quadro. Os fundos amplos e fios já usam resolução reduzida para limitar memória; manter quatro canvases de mundo completos em resolução excessiva pode tornar o carregamento pesado. Texturas procedurais usam sementes para manter aparência estável entre as vistas.

## Verificação

Execute os testes pertinentes descritos em [tests/AGENTS.md](../tests/AGENTS.md), ou `npm test` para a integração completa. Para desenho/interface, valide também no navegador: Q nas quatro vistas, M, clique e clique duplo, E, entrada/saída do bar e os locais modificados. Testes de geometria não detectam fachadas pintadas sobre telhados nem textos escondidos por uma janela.
