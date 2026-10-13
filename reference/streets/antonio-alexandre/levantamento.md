# Rua Antônio Alexandre — 22 de setembro de 2026

Levantamento da esquina da Cônego Mendonça até a Rua Vinte e Oito de Julho: **20 panoramas consecutivos, 160 fotografias de 900 × 600**, imagens do Google Street View de junho de 2025. Os arquivos estão em `maps/antonio-alexandre/ponto-01` a `ponto-20`. Em cada pasta: **1=N, 2=NE, 3=L, 4=SE, 5=S, 6=SO, 7=O, 8=NO**.

O ponto inicial é `k6BHFWpglP1DnMesHhpImQ`, fornecido pelo usuário. A ligação direta do Street View levava aos vizinhos da Cônego; foi necessário selecionar no mapa a primeira posição imediatamente ao sul (`5POlF5rEoifL4FrpaIzEnQ`, cerca de 9 metros adiante). A partir dela, cada avanço usou a posição vizinha da Antônio Alexandre. O último panorama, `WJLDwWseqC6nt98aIPhy2A`, mostra a inscrição R. Vinte e Oito de Julho no cruzamento e a Clínica Reabilitar à frente. Não foram incluídos os panoramas da Cônego visitados durante o ajuste inicial.

O manifesto preserva identificadores e coordenadas. As vinte pranchas em `reference/streets/antonio-alexandre/comparacoes/` mostram as oito direções de cada posição e foram revisadas visualmente. O catálogo não atribui uma casa nova a cada fotografia: a mesma fachada aparece em várias posições.

| Posições | Leste (esquerda no percurso para o sul) | Oeste (direita no percurso para o sul) |
|---|---|---|
| 01–03 | Lateral da clínica amarela: três portas, três conjuntos de janelas, degraus individuais, reboco descascado e rodapé cinza. | Lateral cinza sem aberturas da Igreja Família IDE; casa amarela com garagem branca, faixa preta e colunas escuras. |
| 03–04 | Muro de tijolos, faixas de pintura branca, trepadeiras e vegetação atrás. | Casa creme com uma garagem, uma porta estreita, faixas de pedra e calçada elevada. |
| 04–05 | Garagem marrom junto ao canteiro com flores e cactos altos. | Casa 1690 com porta e portão de faixas diagonais; fachada verde Stetmed. |
| 05–06 | Casa 1709 de muro creme, portão vertical e rampa. | Consultório 1708 com frisos verdes; Gráfica Imprima branca com entrada colorida. |
| 07–08 | Trepadeira florida sobre parede ocre; casa de azulejos verdes, aberturas curvas, porta e garagem claras; três árvores podadas. | Casa 1714 verde, janela com grade ornamental, abertura pequena, garagem branca e antenas; casa antiga rosa/branca com platibanda e grades em losangos. |
| 09–10 | Terreno aberto com vegetação. | Muro branco com portão cinza, depois muro de tijolos com pintura gasta e árvores grandes. |
| 11–12 | Continuação do terreno, terminando no muro de alvenaria da escola. | Casa rosa com dois losangos decorativos e garagem; sobrado claro com varanda; sobrado de reboco aparente; construções recuadas atrás de árvores e canteiros. |
| 13–15 | Escola Santa Filomena: muro azul de pequenas peças, duas faixas brancas vazadas, ala baixa de telhas e bloco alto com duas janelas gradeadas, âncora, ondas e lápis pintados. | Passeios de pedra, canteiros floridos, árvores grandes e casa amarela recuada. |
| 16–17 | Entrada de grades escuras com cobertura de telhas. | Canteiros, bacia circular vazia, anexo baixo e início do muro do prédio antigo. |
| 18 | Segunda entrada da escola em revestimento claro, faixa rosa e portão recuado. | Parede alta do cinema com manchas, tijolos expostos, pilastras e pequenos cartazes. |
| 19–20 | Muro de reboco cinza e faixa superior de tijolos até a esquina. | Lateral do mesmo cinema. No cruzamento: Clínica Reabilitar, fachada bege, janelas gradeadas, porta de enrolar e acesso lateral. |

## Integração

- `src/antonio-data.js`: fachadas, aberturas explícitas, vegetação, postes, veículos, canteiros e informações das construções compartilhadas.
- `src/antonio-points.js`: posições geradas a partir das coordenadas; o eixo é rotacionado para o desenho existente e ajustado aos dois cruzamentos.
- `src/antonio-render.js` e `src/antonio-facades.js`: curva da rua, terreno aberto, caminhos, detalhes da escola e desgaste das paredes.
- `src/world.js`: seleção da rua mais próxima, colisões e conexão nas duas pontas.
- `tests/antonio.test.mjs`: 160 arquivos distintos, percurso completo nas duas direções, seleção das referências e colisões.

A clínica, a Igreja Família IDE e o cinema são volumes únicos com mais de uma fachada. O cinema foi ampliado para alcançar a nova lateral do quarteirão. A Praça do Cinema ganha seu lado voltado para Antônio Alexandre, distinto da praça da igreja ao norte. A faixa da Vinte e Oito de Julho conecta os percursos; esta rua transversal não foi objeto de um levantamento completo.

Dimensões, fundos dos lotes e alturas continuam sendo aproximações artísticas. As fotografias permitem conferir fachadas e sua sequência, mas não determinar com exatidão limites de propriedade, interiores ou toda a geometria escondida pela vegetação. O terreno vazio foi mantido sem casas inventadas. A imagem aérea enviada pelo usuário orientou a relação entre as ruas e as praças.

Validação: **26 testes aprovados**, incluindo a entrada e saída do bar, quatro câmeras, corrida por clique duplo e circulação entre as três ruas. São **416 fotos** de referência no projeto; 107 vistas selecionadas são carregadas para preparar as texturas, e todas as oito direções de cada posição podem ser abertas com E. No navegador, foram verificadas as quatro vistas, a navegação até a escola e as oito referências do ponto 13 (todas carregadas em 900 × 600), sem erros no console. A revisão visual ajustou as copas largas das árvores da praça, a vegetação do terreno vazio, os cactos junto à garagem e os contornos curvos do muro verde.

Repetir captura de panorama identificado: `node --use-system-ca reference/scripts/capture/capture-antonio.mjs PANORAMA LATITUDE LONGITUDE`. Atualizar posições: `node reference/scripts/generate/generate-antonio-points.mjs`. Preparar pranchas: executar `reference/scripts/generate/antonio-contact.py` com Python e Pillow.

A navegação por clique duplo também foi percorrida no navegador até o ponto 20: a personagem alcançou a Vinte e Oito de Julho e o aviso de conclusão apareceu. A visão geral registrada está em `reference/screenshots/antonio-alexandre-aereo.png`.

## Correção do alinhamento dos lotes

A primeira versão posicionava retângulos paralelos ao eixo global ao lado de uma rua curva, produzindo degraus entre fachadas. Cada lote agora possui uma planta quadrilateral: as extremidades da fachada acompanham o eixo medido da rua e coincidem com a vizinha quando não há recuo real. A calçada alcança essa linha contínua. As paredes permanecem retas dentro de cada fachada, com margem para as pequenas mudanças do eixo entre panoramas.

A lateral da Igreja Família IDE foi estreitada em direção ao sul, preservando sua outra divisa, e a clínica de esquina e os fundos do cinema também acompanham a rua. São os mesmos volumes compartilhados. A planta em `src/building-geometry.js` é usada para paredes, telhados, limites das imagens, sombras e colisões. As fotografias, aberturas e sequência das construções foram preservadas.

Os **29 testes** incluem fachadas contíguas, passagem livre junto aos dois meios-fios, a área antes invadida pelo prédio cinza, colisões junto às paredes inclinadas e equivalência das plantas local/global das esquinas.

Conferência visual no navegador: quatro câmeras durante a inspeção dos pontos 5 e 2, incluindo o deslocamento até a lateral cinza corrigida, sem erros no console. Comparação registrada em `reference/screenshots/antonio-alexandre-alinhamento.png`.

## Revisão da casa rosa, da entrada e do monumento

A casa rosa foi recuada até a mesma linha do sobrado vizinho, conferida na foto oeste do ponto 12. O muro azul da escola passou a ter dois trechos, ao norte e ao sul da entrada coberta, sem atravessar o portão. A entrada permanece fechada e é possível chegar até ela pela calçada.

O monumento do Cruzeiro do Sul foi redesenhado com base nas duas imagens adicionais fornecidas pelo usuário: três degraus brancos, pedestal de painéis bege e placa, braços dourados alargados com relevos e anéis em volta do medalhão claro. Toda a base está dentro da Praça do Cinema, com colisão quadrada correspondente aos degraus. Os 32 testes verificam também esses alinhamentos, a ausência de muro diante da entrada e a circulação junto ao monumento.

Capturas de conferência no navegador: `reference/screenshots/cruzeiro-do-sul-corrigido.png`, com a base sobre o piso da praça, e `reference/screenshots/entrada-santa-filomena-corrigida.png`, com o portão coberto inteiro entre os dois trechos do muro azul.

## Extensão ao lado da Matriz — 24 de setembro de 2026

O usuário esclareceu que a Antônio Alexandre cruza a Cônego Mendonça e acompanha a Praça da Matriz. A navegação no Street View confirmou a continuação para o norte até a **Rua Henrique Figueiredo**, identificada no cruzamento. Foram acrescentados os pontos **21–34**, com **112 JPEGs de 900 × 600**, oito direções geográficas por ponto, de imagens de junho de 2025. A rua agora tem 34 pontos/272 fotos; o projeto, 80 pontos/640 fotos. As contagens nas seções anteriores são registros históricos.

Os IDs 1–20 e suas posições no jogo foram preservados. A ordem de caminhada a partir da Cônego é **1, 21, 34, 22, 24, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33**. Os pontos 24 e 34 foram acrescentados na revisão de intervalos entre panoramas, sem renumerar o acervo. O manifesto registra coordenadas WGS84 obtidas nas URLs dos panoramas, procedência, datas individuais e a ordem em `extensions`. O [panorama final](https://www.google.com/maps/@?api=1&map_action=pano&pano=gpMnjbBRw4Ep5mr1L2gpSA&viewpoint=-4.4495456,-43.8850451) mostra a interseção. A Henrique foi representada apenas por braços curtos do cruzamento; seu quarteirão não foi declarado mapeado.

Todas as oito direções dos 14 pontos foram examinadas nas pranchas `comparacoes/ponto-21.jpg` até `ponto-34.jpg`, junto aos pontos antigos da junção (Antônio 1 e Cônego 9). As vistas diagonais e de retorno relacionam as fachadas repetidas. A tabela abaixo resume observações fotográficas, com pares ponto/direção usados no catálogo; não são medições cadastrais.

| Posições e referências | Oeste, à esquerda no avanço para o norte | Leste, à direita no avanço para o norte |
| --- | --- | --- |
| 21, 34; 21/8, 34/7 | Muro salmão/rosa, grades ornamentais claras, jardim com palmeiras, garagem e porta brancas. É a lateral do mesmo jardim da esquina da Cônego, `cm-n06-jardim-rosa`. | Praça elevada, degraus rosados, bancos e árvores; lateral da igreja creme com pilastras claras, base azul-acinzentada e janelas de arco apontado. |
| 22, 24; 22/7, 24/6–8 | Sobrado ocre/amarelo, varanda superior aberta, portas inferiores marrons gradeadas; canteiros floridos, pilares baixos e grades. Inscrição Santa Rita e Santa Filomena/Diocese de Codó. Garagem marrom ao lado. | Continuação da praça e da nave, rampas/degraus e calçada; a igreja permanece um único volume existente. |
| 23, 25; 23/6–8, 25/6–7 | Salão baixo amarelo sob telhas, cobogós circulares sob o beiral e inscrição avermelhada Santas Missões Populares. Continuação branca com inscrição azul do Grupo Unidade Codoense de Alcoólicos Anônimos, reboco gasto e tijolos expostos junto ao chão. Portão enferrujado de barras sob tijolos aparentes. | Termina a lateral da nave; começam pilares e ruínas de tijolos com vegetação e palmeira atrás. |
| 26; 26/2–3, 26/6–8 | Garagem creme simples com portas claras e pequeno respiradouro. Casa branca com grade larga ondulada, garagem cinza e platibanda, fios sobre o muro. | Ruína sem cobertura, pilares de tijolos, vegetação densa cobrindo aberturas e muros. |
| 27, 28; 27/6–8, 28/3–4 | Casa creme 1578, janela gradeada e porta lateral recuada; depois casa amarelo-vivo com grades pretas ornamentais na porta e janela. | Parede antiga de corações pintados, porta escura e respiradouro; trepadeiras, árvores e materiais descartados junto ao muro. |
| 28, 29; 28/7–8, 29/7 | Antiga Escola Arco-Íris em ocre desbotado, base avermelhada, telhas, aberturas fechadas com alvenaria, mural de figura de cabelos pretos e letreiro gasto. | Muro alto de reboco cinza manchado com pintura branca na parte inferior. |
| 30–33; 30/7, 31/7, 32/7, 33/7–8 | Muro contínuo cinza rústico até a esquina. Do outro lado do cruzamento, parede branca e cobertura de telhas de um pátio. | Muro branco áspero, cerca elétrica e vegetação atrás; medidor próximo à esquina e pequeno canto plantado além da transversal. |

Asfalto remendado, calçadas estreitas, postes do lado oeste e fios acompanham o trecho. A geometria artística mantém o eixo junto à praça já construída e retoma suavemente a curva medida depois da nave. Alturas, profundidades, fundos ocultos, dimensões de jardins e desenho simplificado de inscrições são inferências artísticas; o material descartado e os fios miúdos não foram reproduzidos peça por peça.

### Integração e conferência desta extensão

`src/antonio-matriz.js` reúne os novos lotes, detalhes da face compartilhada, vegetação, postes e descrições. `src/antonio-matriz-facades.js` desenha cobogós, grades onduladas, tijolos, mural, corações e desgaste. Rua, calçadas, esquina e jardim dos fundos usam `src/antonio-render.js`. A passagem transversal anteriormente desenhada atrás da praça foi removida porque atravessava o muro fotografado; os dois acessos laterais da praça continuam livres.

O gerador ancora a escala longitudinal no ponto 20, preservando todas as posições antigas. `antonioPath` ordena o percurso espacialmente, sem alterar os IDs usados pelas fotos. O minimapa, a chegada à Henrique, localização, colisões, sombras, postes e janelas incluem a extensão. Muros, ruínas, salões e prédio paroquial são classificados como não residenciais.

Validação automatizada: **54 testes aprovados**, incluindo integridade de 272 fotos da rua, preservação dos vinte pontos, ida e volta entre Cônego e Henrique, associação das fotos, colisões e ausência de lotes sobre o asfalto. Os 112 novos JPEGs foram decodificados e tiveram suas dimensões conferidas. A inspeção visual percorreu os 14 novos pontos nas quatro câmeras, com revisão de vegetação, fachadas, volumes compartilhados e cruzamento. Foram usadas páginas locais temporárias para comparar perspectivas e horários diurno/noturno, sem alterar o relógio do servidor nem deixar controles de teste no jogo.

No navegador, o minimapa conduziu a personagem do ponto 21 ao 33 e de volta pela posição 27 até a junção 1. E exibiu as referências corretas no início, meio, fim e junção; as oito imagens dos pontos 27 e 33 carregaram em 900 × 600. A cópia temporária da entrada do jogo repetiu passos normais de simulação para compensar a limitação de quadros da aba em segundo plano, mantendo busca de caminho, colisões e eventos reais de clique. Essa aceleração não integra `src/game.js`. Console sem erros nas páginas de conferência.

Para atualizar apenas as novas pranchas, execute `python reference/scripts/generate/antonio-contact.py 21` com Pillow instalado. A ausência do argumento continua gerando a coleção completa.

## Revisão da largura da pista — 10/10/2026

Por definição do usuário, o manifesto agora registra `roadType: "rua"`. A pista desta rota usa três larguras do carro do jogo: 3 × 32 = 96 unidades, medidas perpendicularmente ao eixo e sem incluir as calçadas. A regra para avenidas é 4 × 32 = 128. É uma proporção artística definida para o jogo, não uma medida extraída do Street View. Fotos, GPS e IDs foram preservados. As larguras e posições de fachadas descritas anteriormente neste levantamento são o registro histórico anterior a essa revisão.


## Nova proporção de pistas e calçadas — 10/10/2026

Substitui a proporção anterior por solicitação do usuário: rua = quatro carros (128 unidades) e avenida = cinco (160). Cada passeio de rua tem duas pessoas (40 unidades); cada passeio de avenida tem quatro (80). Este manifesto mantém `roadType: "rua"` e registra explicitamente `sidewalkType: "calcada-de-rua"`, aplicado a ambos os lados e a todos os pontos do trajeto. A referência é artística: carro de 32 unidades e corpo com braços de 20, não uma nova medição geográfica. Pisos, limites transitáveis, fachadas e esquinas foram reconstruídos mantendo IDs, fotos e eixos. Praças e recuos existentes somam áreas além da faixa de calçada.
