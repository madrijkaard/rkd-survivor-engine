# Rua Cônego Mendonça — levantamento e integração

Captura: 20/09/2026. Imagens do Google Street View de junho de 2025. Partida no panorama informado pelo usuário, ao lado da Autoescola Bom Pastor, seguindo aproximadamente a leste (rumo inicial 70,85°). A continuação acompanha a praça até o fim da rua, diante da Academia Figueiredo.

Foram registrados **15 panoramas consecutivos e 120 fotografias**, com um avanço entre posições. A primeira etapa reuniu os pontos 01–10; a continuação acrescentou 40 fotos nos pontos 11–15. O segundo link do usuário corresponde ao ponto 09 (`HH_IwB3kuGNEdCLXhTzkhQ`), e o ponto 10 já estava salvo. Foram reutilizados sem duplicação. O ponto 15 (`m50EKQjLKjyArRBYMtRRww`) está na junção em T diante da academia: nenhum avanço foi feito pela rua transversal além desse destino.

As fotos ficam em `maps/conego-mendonca/ponto-01` a `ponto-15`. Ordem circular: **1=N, 2=NE, 3=L, 4=SE, 5=S, 6=SO, 7=O, 8=NO**. Cada arquivo tem 900 × 600 pixels, inclinação horizontal e rumo separado por 45°. `manifest.json` registra panorama e coordenadas de cada posição. As pranchas em `reference/streets/conego-mendonca/comparacoes` reúnem as oito direções para comparação.

## Observações nas fotos

| Pontos | Lado norte, à esquerda de quem avança | Lado sul, à direita de quem avança |
| --- | --- | --- |
| 01 | HMB Chaves e Carimbos, revestimento azul, porta e placa; esquina com a Simeão. | Autoescola: cerâmica laranja, porta de vidro, janelas gradeadas e varanda aberta no andar de cima. O Bar O Péricles aparece atrás na outra esquina. |
| 02 | Casa ocre: garagem de metal, faixa clara, varanda de grades curvas, pequena árvore e vegetação. | Fachada lateral laranja da autoescola e início do trecho branco sob a mesma varanda. |
| 03 | Muro creme com base azul escura, portão claro ornamentado, porta estreita no outro extremo e medidores. | Duas portas e janelas gradeadas na faixa branca, pequena porta de enrolar e varanda superior comprida. |
| 04 | Casa amarela antiga e descascada: porta de madeira, janela de venezianas e porta com grade geométrica. | Sobrado verde claro: duas garagens rosadas, pilares revestidos, varanda superior e guarda-corpo horizontal. |
| 05 | Sobrado branco de revestimento horizontal, vidros azulados, portões brancos, vários medidores, painel amarelo e pequeno recuo. | Muro cinza chapiscado, pilares verticais, garagem escura com moldura clara, rampa, concertina e antena. |
| 06 | Início do muro rosa comprido, pilares claros e vegetação atrás. Torre da igreja visível ao fundo. | Final do muro cinza e lateral de tijolos do sobrado rosa. |
| 07 | Muro rosa contínuo, poste, capim no pé da calçada e instalação elétrica. | Sobrado rosa: quatro janelas superiores, grades claras, garagem em cada extremo, porta central, duas janelas inferiores e aparelhos de ar-condicionado. |
| 08 | Muro passa a ter grades na parte superior, jardim com palmeiras e casa recuada. | Final do sobrado rosa e fachada cinza da Igreja Família IDE, letras brancas, frase clara e faixas geométricas. |
| 09 | Jardim termina na esquina; começa a praça com degraus rosados, árvores podadas e canteiros retangulares. | Igreja Família IDE com uma porta de enrolar escura; a rua transversal aparece ao lado. |
| 10 | Esquina transversal, praça, árvores, nave comprida da igreja e torre pontuda ao fundo. | Casa amarela de atendimento clínico, portas, janelas, placa branca e degraus na calçada. |
| 11 | Praça ampla: escadaria rosada, bancos retangulares, piso cinza, caminhos avermelhados e canteiros. A igreja tem base azul, pilastras claras, janelas em arco, duas alturas de telhado e torre. | Final da casa amarela: porta de madeira gradeada, janela verde e janela marrom; começa a fachada branca tomada pelo verde. |
| 12 | Árvores em bases quadradas brancas, bancos rosados, vegetação esparsa e torre visível entre as copas. | Fachada branca antiga quase inteiramente coberta por trepadeiras, porta clara, venezianas de madeira e capim na calçada. |
| 13 | A praça acompanha todo o lado esquerdo. Pedestal, árvores, canteiros e academia escura mais adiante. | Bazar branco com portão de frisos horizontais e medidores; garagem 67 com platibanda e rampa; portão 69 com pequeno revestimento claro. |
| 14 | Final dos degraus da praça; árvores menores e igreja visível atrás. | Muro bege com faixas diagonais brancas, entrada estreita, cerca elétrica, antena e palmeira atrás do muro. |
| 15 | Esquina arredondada da praça e via lateral livre; Academia Figueiredo com fachada escura, letras claras e três faixas brancas. | Portão largo listrado na outra face do muro; do outro lado da rua transversal, casa creme com portão preto, porta e janela gradeadas, seguida por casa rosa. |

## Correspondência com o jogo

- Os quinze pontos mantêm os intervalos relativos medidos pelas coordenadas dos panoramas: aproximadamente 10 m entre posições, 144 m no total (53 m adicionais). A escala artística continua sendo aproximadamente 14 unidades por metro. `reference/scripts/generate/generate-mendonca-points.mjs` gera essas posições a partir do manifesto.
- A nova rua se liga ao final da Simeão no mesmo mundo navegável. A orientação é simplificada como uma rua perpendicular; não é uma planta topográfica.
- Autoescola, loja de chaves e Bar O Péricles ganharam uma segunda fachada no mesmo volume. A autoescola não foi duplicada na esquina.
- As fachadas novas estão individualizadas em `src/mendonca-data.js`. Os trechos do muro rosa pertencem ao mesmo jardim e não representam casas repetidas.
- Os quatro ângulos compartilham os mesmos prédios, pontos e colisões. Duas perspectivas adicionais permitem ver as fachadas do lado sul da rua transversal.
- A igreja foi deslocada para dentro de uma única praça elevada, deixando circulação em volta da nave. Escadaria, piso e caminhos continuam sob a construção. A igreja tem uma só planta de colisão; a torre integra essa planta. As quatro vias que circundam a praça formam uma volta navegável, com verificação de passagem contínua. O antigo poste na faixa de circulação foi recolocado junto ao meio-fio.
- As imagens fornecem a frente da praça e vistas oblíquas da igreja. Profundidade da praça, lado posterior da igreja e extensão das vias laterais são aproximações para representar o entorno livre solicitado; não constituem um novo levantamento fotográfico dessas vias. Não se atribuiu nome à igreja nem à rua transversal sem confirmação.
- A identificação de unidades residenciais independentes, partes ocultas, profundidades, alturas e limites exatos de lotes não pode ser comprovada só pelas fotos; a modelagem desses aspectos é aproximada. A nave e a torre da igreja são representações do que aparece ao fundo, sem atribuição de um nome não confirmado.
- Veículos em movimento e pessoas capturadas em instantes diferentes não foram tratados como obstáculos permanentes.

Verificação: 120 JPEGs distintos; arquivos originais da Simeão preservados; percurso contínuo e retorno; volta completa pelas ruas ao redor da praça; igreja contida na praça; acesso ao piso e colisões de igreja, bancos e muros; referências da rua correta; inversão de projeção nas quatro câmeras; caminhada/corrida e bar.
