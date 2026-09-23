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
