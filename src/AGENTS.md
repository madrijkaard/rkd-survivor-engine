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
| `world.js` | Integra os catálogos das oito vias, pontos, fachadas compartilhadas, lugares nomeáveis, árvores, carros, postes, áreas transitáveis e obstáculos. Exporta `routes`, `allPoints`, `buildings`, `places`, `getPlace`, `locationAt`, `imagePath`, `walkable`, `moveActor`, `clearLine` e `findPath`. É o ponto central da localização e navegação. |
| `road-dimensions.js` | Referência comum: carro de 32 × 65 unidades, perfil de rua (128) ou avenida (160), calçadas por pessoa de 20 unidades (40/80 por lado), plantas dos veículos e bordas perpendiculares de ruas curvas. |
| `road-profiles.js` | Lê `roadType` e `sidewalkType` dos oito JSONs antes da construção dos catálogos, via HTTP no navegador e arquivos locais em Node. Exporta perfis usados no desenho e geometria, sem geração ou build. |
| `map-manifests.js` | Exporta `MAP_DIRECTIONS`, `validateMapManifest` e `loadMapManifests`. Lê `maps/<route.folder>/manifest.json`, valida esquema e associação dos IDs e carrega metadados de rua/bairro/GPS sem alterar posições artísticas. Aceita uma função de fetch injetada para testes. |
| `server-clock.js` | Consulta `/api/time` sem cache, valida a hora/fuso do servidor e avança a amostra com `performance.now()`. Compensa metade do tempo de ida/volta e compartilha sincronizações concorrentes. Não usa o relógio civil ou fuso do navegador. |
| `place-names.js` | Cadastro `PLACE_NAMES` por ID estável e função `withPlaceName`. Acrescenta `displayName` opcional e `placeType`, preservando a descrição antiga em `name`. Não cria etiquetas na interface nem altera letreiros desenhados. |

### Projeção, renderização e movimento

| Arquivo | Responsabilidade e relações |
| --- | --- |
| `projection.js` | Define as quatro `CAMERA_VIEWS`, a projeção ativa `PROJECTION`, `project`/`unproject`, seleção de câmera e escopos temporários `withCameraView`/`withCrossStreetFrame`. Converte o plano do mundo em tela e permite desenhar fachadas transversais em um referencial local. |
| `render.js` | Carrega fotografias selecionadas, cria texturas e canvases estáticos, calcula limites e profundidade, prepara as quatro vistas em `createScene`, reexporta `createActorFrames` de `actor-animation.js` e compõe o quadro em `renderWorld`. Integra desenho das ruas, prédios, vegetação, sombras, fios e interior do bar. |
| `lighting.js` | Regras puras do horário em minutos, posição artística do Sol, deslocamento das sombras, escurecimento e postes ligados entre 18:00 e 05:29. Define as posições das lâmpadas usadas no desenho e no brilho. |
| `lighting-render.js` | Projeta volumes do cenário em sombras no chão, preservando plantas inclinadas. Mantém um caminho de sombras por câmera/horário e uma camada de luz do tamanho da tela, com ocultação pelos sprites. Aplica o ambiente noturno; a camada emissiva também recebe as janelas preparadas por `render.js`. |
| `home-lighting.js` | Seleciona aproximadamente 70% das residências com janelas existentes, por ordenação determinística de IDs. Exclui usos comerciais/públicos e conta fachadas locais, transversais e traseiras uma só vez. |
| `architecture.js` | `drawDetailedBuilding` projeta as texturas de fachadas, faces laterais/traseiras e telhados no volume do prédio. Usa a planta comum de `building-geometry.js` e a orientação de câmera para decidir faces visíveis. Trata fachadas transversais e de fundos. |
| `facades.js` | `makeDetailedFacade` desenha a textura plana de uma fachada: pintura, desgaste, portas, janelas, grades, revestimentos e inscrições. As fotos podem contribuir sutilmente com a textura. Usa detalhes específicos de `antonio-facades.js`. |
| `building-geometry.js` | Fonte comum da planta dos prédios: `buildingFootprint`, `buildingPlanPoint`, `footprintBounds`, `footprintObstacle` e `hitsFootprint`. Suporta retângulos e quadriláteros; a interpolação da planta mantém paredes, cobertura e colisão coerentes em lotes inclinados. |
| `street-details.js` | Desenha árvores, canteiros, conjunto de poste/banco, muro ajardinado, demolição, recuo de tijolos, arbustos, lixeiras e placa. `drawPlanter` encaminha o monumento para `cinema-monument.js`. Usa dados do mundo/catálogo, em vez de controlar a personagem. |
| `actor-animation.js` | Seleciona uma das oito orientações de tela com `directionFromScreen` e desenha caminhada/corrida com `createActorFrames`. Frente, costas, perfis e diagonais compartilham o canvas de 38 × 54 e a âncora dos pés (19, 48). |
| `click-navigation.js` | Reconhecimento puro de clique simples/duplo, com `createClickNavigation().select/reset`; exporta `WALK_SPEED = 100` e `RUN_SPEED = 125`. Preserva o destino do primeiro clique quando o segundo inicia corrida, evitando que o movimento da câmera desloque o destino. |

### Catálogos e desenho de cada rua

| Arquivo | Responsabilidade e relações |
| --- | --- |
| `simeao-points.js` | Gerado por `generate-simeao-points.mjs`: 31 posições, preservando as 17 originais e usando distância geográfica × 14 na extensão. |
| `simeao-extension.js` | Casas, muros, escola, árvores, carros, postes e limite na Henrique Figueiredo, baseados nos pontos 18–31. Atualiza os dois volumes compartilhados da esquina sem duplicá-los. `residential: false` exclui serviços/muros da luz de janelas. |
| `simeao-facades.js` | Motivos observados na extensão: pintura do Cristo Rei, revestimentos amadeirados, frisos e tijolos expostos. |
| `street-data.js` | Catálogo manual da Simeão: `streetBuildings`, `specialBuildings`, muros, lote de demolição, recuos, arbustos e lixeiras. Contém fachadas dos dois lados, cores, aberturas, alturas, coberturas e referências fotográficas. |
| `mendonca-points.js` | **Arquivo gerado** dos 37 pontos da Cônego Mendonça. O gerador preserva os 15 originais e ancora a extensão oeste 16–22 à Fernando. Preserva esses 22 ao acrescentar 23–31 até a Praça Alcebíades Silva, usando distâncias do manifesto e a ancoragem da Fernando. É enriquecido com descrições em `world.js`. |
| `mendonca-data.js` | Geometria e catálogo da Cônego: `CROSS_Y`, extensão/limites do mundo, construções, fachadas de esquina, árvores e postes, praça da igreja, nave, torre, bancos e monumento da praça. Define também suas ruas de contorno. |
| `mendonca-render.js` | Desenho específico do chão transversal e praça (`drawMendoncaGround`), torre/nave da igreja, bancos e estátua. A igreja permanece dentro da praça, com ruas livres em seu entorno. |
| `antonio-points.js` | **Arquivo gerado** dos 34 pontos da Antônio Alexandre. Conserva registros dos panoramas e projeta suas coordenadas no referencial artístico, ajustando o percurso às junções existentes. |
| `antonio-data.js` | Catálogo e geometria da Antônio: `antonioCenter(y)` interpola a curva, `onAntonioRoad` delimita a rua e `alignAntonioCorner` ajusta esquinas compartilhadas. Define plantas dos lotes, casas, escola, fachadas, cinema, jardim, conexão com a Vinte e Oito de Julho, vegetação, carros e outros objetos. |
| `antonio-facades.js` | `drawAntonioOpeningDetails` e `drawAntonioFacade` acrescentam os motivos específicos observados: portões, cobogós, revestimentos, pilares, mural da escola e detalhes de estabelecimentos. É chamado pelo desenho comum de fachadas. |
| `antonio-render.js` | `drawAntonioGround` desenha rua curva, calçadas, jardins junto ao cinema e ligação final; `drawAntonioCactus` desenha os cactos. Deve acompanhar os mesmos limites geométricos usados no catálogo e na navegação. |

A extensão da Antônio junto à Matriz está em `antonio-matriz.js` (catálogo, fachada compartilhada do jardim de esquina, vegetação, postes, descrições e cruzamento final) e `antonio-matriz-facades.js` (cobogós, inscrições, grades onduladas, alvenaria das aberturas fechadas, corações e muros). Os novos objetos usam o desenho, a colisão e a iluminação comuns. `antonioPoints` mantém IDs; `antonioPath` e `parallelPoints` ordenam por posição, do norte ao sul. `ANTONIO_END` continua sendo o ponto 20 e `ANTONIO_NORTH` é o 33. O gerador ancora a escala longitudinal no ponto 20 e mantém a rua ao lado da praça existente, retomando a curva medida após a igreja. Não existe rua atravessando o muro ao norte da praça; `plazaRoads` mantém apenas seus dois acessos laterais. A Henrique é representada só no cruzamento e seus braços curtos, sem unir artificialmente os dois extremos mapeados na Simeão e na Antônio.

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

Sombras solares ficam opostas ao Sol, alongam perto do horizonte e desaparecem à noite. Não devem ser gravadas no chão estático. As plantas compartilhadas também alimentam seus volumes; objetos complexos usam aproximações, e a escultura do cinema tem pedestal e braços separados. O piso interno do bar cobre sombras externas. O ambiente clareia entre 05:00 e 07:00 e escurece gradualmente entre 15:00 e 19:00. Os postes acendem exatamente às 18:00 e apagam às 05:30; essa regra é independente da transição suave do ambiente. No mesmo período, 43 das 62 residências com janelas existentes (70%, arredondado) recebem luz interna quente; não são criadas aberturas em muros ou fachadas vedadas. `home-lighting.js` mantém a escolha determinística por ID, independente da câmera e da ordem do catálogo. `makeDetailedFacade(..., lightPass)` desenha somente emissão nas janelas, contida pelas molduras, grades e frestas das venezianas de madeira. `drawDetailedBuilding(..., lightPass)` reutiliza projeção e visibilidade das fachadas, mascarando cercas, vegetação e outros detalhes próprios. Os canvases emissivos são preparados nas quatro vistas e compostos na ordem de profundidade, com a mesma transparência do prédio; não há halo externo de janela nem iluminação do chão por casas. A camada de brilho é ocultada na mesma ordem de profundidade dos sprites para não iluminar fachadas por cima.

A personagem também recebe luz quente dos postes ligados: `actorLampLight` em `lighting.js` calcula a intensidade gradual pela distância no mundo às lâmpadas reais, sem depender da câmera. `drawActorLampLight` em `lighting-render.js` preserva as cores e a transparência do sprite, favorece o lado voltado à fonte e insere a contribuição na camada de luz na profundidade da personagem. Objetos à frente continuam ocultando essa luz. O efeito não se aplica dentro do bar nem quando os postes estão apagados; reutiliza um único canvas do tamanho do sprite.

## Vinte e Oito de Julho

`julho-points.js` contém 29 posições; `julho-data.js` reúne 21 construções novas, a face compartilhada da Simeão e os objetos/áreas transitáveis; `julho-render.js` desenha pisos, motivos e corrimãos. A rota `vinte-e-oito-de-julho` vai de `x=0` até `x=-2223`, em `y=-95`. `FERNANDO_ROAD` conserva os braços da esquina com a Vinte e Oito; `FERNANDO_WALK` prolonga o percurso ao norte. Volumes transversais usam `axis:'x'`, `originY` e `local`. Carros com esse eixo giram desenho, obstáculos e sombras. O minimapa admite valores negativos de x; a vista aérea usa os limites ampliados. Com a expansão da Fernando, a seleção atual tem 43 de 62 residências elegíveis.

Gere suas posições com `node reference/scripts/generate/generate-julho-points.mjs`. O comando sobrescreve apenas `src/julho-points.js`, preserva os IDs e as posições 1–9 em escala aproximada de 14 unidades/m. O retorno 10–18 interpola a longitude WGS84 entre a praça (x=-2223) e Fernando (x=-1202), sem mover as âncoras existentes. `julhoPath` separa ordem espacial e numeração; `JULHO_END` continua sendo o ponto 9.

## Três sistemas de coordenadas

| Sistema | Onde aparece | Regra de uso |
| --- | --- | --- |
| Latitude/longitude WGS84 | Manifestos e metadados dos pontos | Identifica onde a captura real foi feita. Não passar diretamente para `project`, colisões ou caminhos. |
| Mundo artístico `x/y`, altura `z` | Catálogos, personagem, obstáculos, planta | Define o cenário e as distâncias navegáveis em unidades do jogo. `z` afeta o desenho vertical; o percurso é calculado no chão. |
| Tela/projeção | Canvas, câmera, clique e sprites | Resultado de `project` mais enquadramento/escala da câmera. Converter cliques de volta ao plano antes de navegar. `unproject` corresponde ao chão, não à superfície elevada de um telhado. |

`PROJECTION` é um binding exportado mutável. Use `withCameraView` e `withCrossStreetFrame` para desenho temporário: ambos restauram o estado anterior em `finally`. O escopo de pré-renderização é síncrono; não deixe uma projeção temporária ativa enquanto aguarda tarefas assíncronas.

Girar câmera muda projeção, faces visíveis e profundidade. Não rotacione os dados do mundo, o destino ou a personagem para simular a troca. Cada vista é preparada separadamente; espelhar uma imagem pronta inverteria letras e não revelaria as fachadas corretas.

## Localização, fotos e bairros

`routes` contém `id`, `folder`, `name` e `points`; também contém `roadType`, `carsAcross`, `width`, `halfWidth`, `sidewalkType`, `peopleAcross`, `sidewalkWidth`, `outerHalfWidth` e `totalWidth` derivados do JSON; após carregar manifestos recebe `city` e `neighborhood`. Os pontos recebem `pano`, `latitude`, `longitude` e o bairro efetivo. A rota `simeao` usa a pasta `simeao-de-macedo`; as demais têm ID igual à pasta.

`locationAt(x, y)` compara a distância aos segmentos dos percursos para escolher uma rua e então procura seu ponto mais próximo. Retorna `{ route, point, city, neighborhood }`. Em empate entre segmentos no cruzamento, vence a rota cujo ponto fotografado estiver mais perto. Na junção, a proximidade é geométrica; não existe uma planta cadastral de bairros. `pointAt(y)` é uma função de proximidade limitada aos 31 pontos da Simeão: não a use para localizar o mundo inteiro.

`imagePath(point, direction, street)` recebe o número do ponto e da direção (1–8). Preserve essa associação quando alterar catálogos. Os campos `title`, `detail` e `area` dos pontos continuam sendo metadados mesmo sem o antigo painel inferior esquerdo. O cabeçalho exibe cidade/bairro em `cityNeighborhood` e `route.name` em `currentStreetName`, atualizados por `updateHud()` conforme `locationAt`. O título grande e a frase de apresentação foram removidos; a localização permanece visível também em telas pequenas. E continua usando a mesma rua selecionada.

## Construções, curvas e colisões

As construções possuem IDs estáveis e propriedades como posição, dimensões, altura, cobertura, cores, `openings`, letreiros, `point` e `refs`. Em `street-data.js`, `refs` reúne pares de ponto/direção das imagens que mostram aquela construção. As aberturas usam posição/largura normalizadas na fachada (`u`, `w`) e dados verticais como `bottom`/`h`; consulte o consumidor em `facades.js` antes de adicionar um tipo.

Na Antônio Alexandre, as fachadas acompanham a linha interpolada da rua e compartilham suas divisas. `buildingFootprint` fornece a planta e `buildingPlanPoint` transforma coordenadas da construção para essa planta. `footprintObstacle` e `hitsFootprint` usam o mesmo contorno na colisão. Nas esquinas, respeite o referencial local da fachada transversal e sua conversão para o mundo.

`world.js` combina fachadas de esquina e fundos (`crossFacade`, `backFacade`) com volumes existentes, evitando construir duas vezes a mesma casa ou o cinema. Ao corrigir alinhamento, revise planta, calçada, telhado, sombra e obstáculo, além da aparência frontal.

Mantenha os recortes do muro azul diante das entradas da Escola Santa Filomena. Um portão fechado pode bloquear a personagem sem ser coberto por outro muro. A casa rosa junto à praça deve encontrar o sobrado no mesmo alinhamento. A base do Cruzeiro do Sul deve permanecer inteiramente dentro da Praça do Cinema.

`walkable` considera limites transitáveis, obstáculos e raio da personagem. `findPath` busca um trajeto numa grade e verifica segmentos com `clearLine`. `moveActor` subdivide deslocamentos em passos menores para evitar atravessar obstáculos durante a corrida. Alterar velocidade ou dimensão da personagem exige conferir portas, mesas e lotes inclinados.

## Clique, bar e nomes próprios

O clique duplo atual exige até 350 ms, distância de até 12 pixels, mesma superfície de entrada e mesmo tipo de ponteiro. O segundo clique reutiliza o destino do primeiro, pois a câmera pode ter se movido. Um clique simples novo anda rápido a 100 unidades/s; clique duplo ou Shift corre a 125 unidades/s (25% a mais). Não existe mais o modo antigo de 67 unidades/s. `createActorFrames` retorna `{walk, run}`, dois conjuntos de oito direções × oito quadros com a mesma âncora dos pés. O clique aceito orienta a personagem para o primeiro segmento válido do caminho; durante o trajeto, a direção acompanha o deslocamento efetivo projetado na câmera ativa. Cada setor de 45° possui postura própria, com braços/pernas no sentido do movimento, perfil do rosto e mochila nas costas. Girar a câmera recalcula a orientação visual sem mudar o destino. O andar rápido usa cadência de 14 quadros/s; a corrida, 18, com braços dobrados, joelhos elevados, fase aérea e inclinação do tronco. Ao parar, retorna ao quadro neutro de caminhada. O sprite selecionado também alimenta ocultação e luz incidente. `data-movement-mode` e `data-movement-speed` permitem verificar o modo/velocidade efetivos. Preserve a reinicialização do gesto quando a interação for interrompida.

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

`simeao-points.js`, `mendonca-points.js` e `antonio-points.js` são saídas destes comandos, executados na raiz:

```sh
node reference/scripts/generate/generate-simeao-points.mjs
node reference/scripts/generate/generate-mendonca-points.mjs
node reference/scripts/generate/generate-antonio-points.mjs
```

Os comandos **sobrescrevem** esses três arquivos. Corrija a entrada em `maps/` ou a transformação no gerador conforme a causa, em vez de manter uma correção apenas na saída que será perdida na próxima geração. A Simeão preserva as posições 1–17 e prolonga a linha até o ponto 31. `world.js` combina os limites originais com o novo fim; `game.js` adapta o minimapa à extensão até a Henrique Figueiredo. Gerar pontos não gera casas, descrições nem colisões automaticamente.

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

## Fernando Carvalho

`fernando-points.js` contém 17 posições, geradas por `reference/scripts/generate/generate-fernando-points.mjs`. A escala acumulada é alinhada à Vinte e Oito e à Cônego sem mover pontos antigos. `fernando-data.js` define 30 novos volumes e amplia as laterais dos IDs `jl-uniodonto` e `jl-esquina-verde`; na revisão de largura, as frentes da Vinte e Oito passaram para `y=9` e `y=-199`, preservando IDs e GPS. `fernando-render.js` desenha pisos e detalhes das fachadas. A rota possui `x=-1202`, início `y=-95` e fim `y=2435`. A travessa intermediária conserva braços curtos; a Cônego agora se conecta à Simeão com os pontos 16–22 fotografados. Fios da Fernando têm sua própria sequência. Objetos participam da geometria, sombras e luz comuns. A seleção residencial atual é 43 de 62 casas elegíveis.

## Largura por tipo de via

O `roadType` obrigatório do manifesto determina a pista: `rua` = 4 × `CAR_WIDTH` = 128; `avenida` = 5 × `CAR_WIDTH` = 160 unidades. A largura exclui passeios, é perpendicular ao eixo e segue a mesma unidade física do carro. Não é medição cadastral ou número de faixas sinalizadas. As sete rotas existentes são ruas. O carro tem 32 de largura e 65 de comprimento no desenho, colisão e sombra; `withCarFrame` aplica sua orientação, inclusive na curva da Antônio. Os carros estacionados foram reposicionados junto aos novos meios-fios.

Simeão (incluindo extensão), Cônego, Antônio (incluindo Matriz), Vinte e Oito (incluindo ligação antiga) e Fernando usam os perfis. A Antônio usa bordas paralelas com juntas contínuas, evitando reduzir a medida nas diagonais. O campo obrigatório `sidewalkType` distingue `calcada-de-rua` (2 × `PERSON_WIDTH` = 40) e `calcada-de-avenida` (4 × `PERSON_WIDTH` = 80), por lado, em todos os segmentos da rota. `outerHalfWidth` soma meia pista a um passeio; `totalWidth` inclui ambos. Os dois tipos precisam corresponder; valores ausentes ou incompatíveis são rejeitados antes de aplicar os metadados. Fachadas, volumes compartilhados, pisos e áreas transitáveis usam os mesmos perfis. A translação do Bar O Péricles acompanha salão, mobiliário, portas, colisão e desenho. `fitAntonioFrontages` recua apenas os vértices necessários para que uma fachada reta não corte uma curva, mantendo as divisas compartilhadas. Praças, pátios e recuos são áreas adicionais ao passeio. A busca de caminhos valida também cada aresta da grade, evitando cruzar a ponta de um lote entre dois nós livres. As coordenadas geográficas, IDs de fotos e eixos das rotas foram preservados.

A Praça do Cinema começa após os passeios da Simeão e da Vinte e Oito. A base do Cruzeiro do Sul conserva sua forma e mantém margem de circulação dentro dos novos limites. Os braços curtos da Henrique Figueiredo, Travessa Z. Cardoso e término da Cônego seguem o perfil de rua do acesso, sem acrescentar rotas ou capturas.

## Cônego oeste — Simeão até Fernando

`mendonca-west.js` cataloga oito volumes novos, as quatro faces de esquina compartilhadas, dois postes, três carros e a área transitável do quarteirão. `mendonca-west-render.js` desenha piso e detalhes de pedra, cobertura, varandas e ala do Centro Operário. `crossPoints` em `world.js` é ordenado espacialmente por x (22→16→1→15); o arquivo gerado mantém a ordem dos IDs. `MENDONCA_END` permanece ancorado ao ponto 15; o ponto 22 fica na boca leste da Fernando, x=-1132, y=2345. GPS permanece separado da modelagem artística. A pista de 128 e os passeios de 40 seguem os perfis do manifesto.

## Cônego: da Fernando à Praça Alcebíades Silva

`mendonca-praca.js` reúne seis volumes novos, duas atualizações de esquina, árvores, arbustos, postes, veículos, descrições e limites transitáveis dos pontos 23–31. `mendonca-praca-render.js` desenha a pista, boca da praça, vegetação do terreno e detalhes das fachadas. `withMendoncaPracaCorner` amplia a Clínica Sublime e o terreno conservando a face da Fernando. `MENDONCA_WEST_END` é o ponto 31 (x=-2223, y=2345); `MENDONCA_END` ainda é o 15. O ponto 23 está ancorado ao eixo da Fernando (x=-1202); 24–31 usam distância acumulada × 14. Os pontos 1–22 permanecem idênticos. A rota segue ordenada por x; minimapa e limites aéreos abrangem a expansão. A seleção residencial atual possui 43 de 62 casas com janelas.

## Rota da Praça Alcebíades Silva

`alcebiades-points.js` contém quinze posições geradas de WGS84. O eixo x=-2223 coincide com Cônego/31; os pontos 1–10 vão de y=2345 a 1002.5, alinhando a esquina da Cardoso à boca já existente na Fernando, sem unir o trecho não capturado. `alcebiades-data.js` reúne dezesseis volumes, descrições, jardim, piso, boca da travessa e objetos; `withAlcebiadesCorner` altera somente a referência da face da Metalmar. `alcebiades-render.js` desenha pavimentos, arcos, revestimentos, toldos e canteiros. A biblioteca usa cobertura em dois níveis e composição de arcos nas duas faces curtas em `architecture.js`. `street-details.js` suporta `kind: pollarded` para a árvore podada; sua sombra não recebe uma copa cheia.

Os postes de jardim usam `lampArms: 2`. `poleLamps` fornece as mesmas posições ao desenho, ao brilho e à luz na personagem; postes anteriores mantêm seus braços. Novos arbustos e motos participam das sombras. A praça entra em `routes`, nos perfis de pista/passeio, minimapa e vista aérea. A seleção residencial atual é 43 de 62 casas elegíveis.

`findPath` percorre a grade finita das áreas transitáveis até encontrar o destino ou esgotar os nós. O antigo limite fixo de 18.000 retiradas rejeitava caminhos válidos até a nova esquina. A consulta de ocupação de cada célula agora é reaproveitada dentro da busca; validações das arestas e colisões continuam ativas.

A continuação reta da Cardoso à Vinte e Oito usa `alcebiades-julho.js` e `alcebiades-julho-render.js`. Os cinco novos pontos usam distâncias relativas e escala artística própria até y=-95, preservando 1–10. `ALCEBIADES_CARDOSO_POINT` fixa a junção intermediária; `ALCEBIADES_END` acompanha o fim em 15. Não use o último ponto para reposicionar a Cardoso ou construções antigas.

O Sicoob conserva ID e aresta norte; sua planta cresce para sul para completar o lote observado. Corpus, sobrado Crefisa (uma construção para as duas faces e loja térrea adjacente) e CEO acrescentam três volumes. São serviços/comércios sem emissão residencial. O CEO é transversal (`axis: x`). Cercas da quadra, rampas, corrimão, mesas, placa e abrigo têm plantas usadas por desenho e colisão. A entrada da quadra fica livre; no abrigo, somente os pilares bloqueiam, além das motos cadastradas. Sombras de alambrado usam mureta e postes, sem preencher toda a malha como parede. Os novos postes e árvores usam os sistemas comuns. O mundo inclui y=-460 para enquadrar a esquina oposta. A Vinte e Oito é apenas um cruzamento com braços curtos nessa extremidade; não foi criada passagem até a Fernando.

O retorno da Vinte e Oito usa `julho-west.js` e `julho-west-render.js`: dez lotes adicionais, motivos da farmácia e comércios, pátio azul, casa com jardim, motos e postes. `withJulhoWestCorner` completa quatro volumes únicos e conserva as faces da praça e da Fernando. A interseção Alcebíades/15 coincide com Julho/10; o desempate exibe Julho/10. A sequência de fios da Fernando usa explicitamente seu poste de junção, independentemente do último poste da Vinte e Oito.

Os avisos automáticos centrais de chegada às esquinas foram removidos da interface e de `step()`. Não há elemento `arrival`, temporizador de chegada ou atributo `data-arrived`. A localização continua no cabeçalho dinâmico; as janelas de fotos (E) e ajuda são abertas apenas por ação do jogador.

## Vinte e Oito até Coelho Neto

`julho-east.js` descreve 19 volumes adicionais, os pontos 19–29, vegetação, postes, carro e duas atualizações compartilhadas. `withJulhoEastCorner` completa o muro da escola com a face da Vinte e Oito e alinha a Reabilitar ao passeio de 40 unidades, preservando ambos os IDs. `julho-east-render.js` desenha o chão, terreno/lenha, degraus, acesso de terra e motivos das fachadas. O alpendre tem cobertura e pilares; `architecture.js` também suporta o telhado curvo `barrel` do ginásio visto na interseção. Alturas e interiores sem cobertura fotográfica são aproximações.

O gerador conserva exatamente os pontos 1–18, fixa Julho/19 em x=836/y=-95 e usa diferenças de longitude × cos(latitude) × 14 unidades/m para os demais pontos. `julhoPath` mantém a ordenação espacial separada dos IDs. `JULHO_EAST` é o ponto 29 (x=2292.6); `JULHO_END` continua sendo Fernando/9. `JULHO_EAST_WALK` e `COELHO_MOUTH` delimitam a pista/passeios e apenas os braços visíveis da transversal. A ligação ao norte pela Coelho Neto até a Cônego foi mapeada posteriormente; o acesso de terra a leste permanece fechado. Minimapa e vista aérea incluem a extensão. Há 62 residências elegíveis, das quais 43 recebem luz noturna.


## Coelho Neto: Vinte e Oito → Cônego

A Coelho Neto possui 22 pontos (176 arquivos): oito fotos reutilizadas de Julho/29 e 168 novas. O percurso vai da Vinte e Oito de Julho à Cônego Mendonça, no sentido da Igreja Matriz. Os pontos antigos permanecem fixos. O panorama 22 documenta a interseção, sem capturas no quarteirão seguinte. `coelho-geometry.js` fornece o eixo inclinado, bordas perpendiculares e `onCoelhoRoad`, usado junto às outras áreas em `walkable`. O gerador distribui os panoramas pela latitude entre as âncoras históricas Julho/29 (2292.6, -95) e Cônego/15 (2015, 2345), mantendo GPS e pontos antigos. O ponto 22 fica em (2010.59, 2383.73), dentro da interseção fotografada.

`coelho-data.js` acrescenta quinze volumes e completa quatro existentes: ginásio (`jl-e-ginasio-contexto`), muro (`cm-s11-muro-diagonal`), casa rosa (`cm-final-casa-rosa`) e casa clara (`cm-final-casa-creme`). Os quadriláteros são compartilhados pelo desenho, cobertura, sombra e colisão. Facebar, casa de tijolos e Academia Figueiredo continuam únicos. `coelho-render.js` desenha pista/passeios, terrenos, degraus, fachadas e caminhão. O caminhão tem planta própria 37×133 usada no desenho/colisão/sombra; a referência dos carros comuns continua 32×65. Vegetação, postes, carros e motos usam os sistemas existentes. Há 62 residências elegíveis, 43 iluminadas à noite.

No início, o empate de localização mantém Julho/29; ao entrar na Coelho, o cabeçalho e E passam à nova rota. Ao virar na Cônego, os metadados históricos são retomados. A praça já existente continua transitável; nenhum ponto além da interseção foi acrescentado.

## Continuação da Cônego até São Benedito

`mendonca-benedito.js` define `MENDONCA_BENEDITO_END` (37), pista, braços curtos da avenida, estacionamento, cinco volumes novos, dois complementos compartilhados e objetos. `mendonca-benedito-render.js` desenha o chão e detalhes de banco, muro eleitoral, vitrines, camuflagem, arcos e pedra. `withMendoncaBeneditoCorner` preserva os IDs do Girassol e do pavilhão da praça; os demais prédios anteriores permanecem fixos. A geometria da avenida alinha sua borda leste à borda artística existente da praça.

`BENEDITO_PROFILE` lê o manifesto próprio da São Benedito: pista de 160 e passeios de 80 por lado. A interseção original permanece; a oitava rota agora segue ao sul. As distâncias novas usam o ponto 31 como âncora e escala 14 unidades/m. `MENDONCA_WEST_END` permanece apontando para 31 para preservar a praça; minimapa e limite oeste usam a nova extensão.


## Avenida São Benedito — sentido sul

A oitava rota percorre o lado oeste da Praça Alcebíades Silva, da Cônego Mendonça à Vinte e Oito de Julho, junto ao Banco do Brasil. São 14 pontos e 112 arquivos: oito reutilizados de Cônego/37 e 104 fotos novas. O acervo soma 199 pontos e 1592 JPEGs. O acesso intermediário ao terreno anunciado à venda não foi tratado como rua.
`benedito-data.js` acrescenta 12 volumes e completa três compartilhados em `withBeneditoFaces`; `benedito-render.js` trata piso, fachadas, ogivas, varandas, sinalização e reforma do passeio. Banco, colégio, escritórios e hotel de contexto não são residenciais. São 62 residências elegíveis, 43 iluminadas. O mundo, minimapa, localização, fotos, sombras e fiação usam a nova rota. `BENEDITO_JULHO` encontra a área histórica da Vinte e Oito junto à praça. Nenhum ponto antigo é deslocado.
