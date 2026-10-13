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

## Revisão da largura da pista — 10/10/2026

Por definição do usuário, o manifesto agora registra `roadType: "rua"`. A pista desta rota usa três larguras do carro do jogo: 3 × 32 = 96 unidades, medidas perpendicularmente ao eixo e sem incluir as calçadas. A regra para avenidas é 4 × 32 = 128. É uma proporção artística definida para o jogo, não uma medida extraída do Street View. Fotos, GPS e IDs foram preservados. As larguras e posições de fachadas descritas anteriormente neste levantamento são o registro histórico anterior a essa revisão.


## Nova proporção de pistas e calçadas — 10/10/2026

Substitui a proporção anterior por solicitação do usuário: rua = quatro carros (128 unidades) e avenida = cinco (160). Cada passeio de rua tem duas pessoas (40 unidades); cada passeio de avenida tem quatro (80). Este manifesto mantém `roadType: "rua"` e registra explicitamente `sidewalkType: "calcada-de-rua"`, aplicado a ambos os lados e a todos os pontos do trajeto. A referência é artística: carro de 32 unidades e corpo com braços de 20, não uma nova medição geográfica. Pisos, limites transitáveis, fachadas e esquinas foram reconstruídos mantendo IDs, fotos e eixos. Praças e recuos existentes somam áreas além da faixa de calçada.

## Expansão Fernando Carvalho → Simeão — interrompida em 11/10/2026

Solicitação do usuário: partir do cruzamento da Fernando Carvalho com a Cônego Mendonça e seguir pela Cônego até a esquina da Simeão de Macedo. Trecho ainda não capturado nem integrado.

Referências de retomada, obtidas dos manifestos e levantamentos existentes (sem nova observação no navegador nesta tentativa):

- Início: Fernando Carvalho/ponto-17, panorama `D1r1lkX0CXEqrnzaI8CeKQ`, latitude -4.45114, longitude -43.8861508. O levantamento anterior situa esse panorama logo ao norte do cruzamento. Reabrir a interseção e confirmar a entrada na Cônego rumo leste antes de avançar.
- Destino: esquina da Simeão, junto à Cônego/ponto-01, panorama `WOqiStV1h5j9BGtjJxUU6A`, latitude -4.4509722, longitude -43.8854794. Confirmar o limite nas imagens; preservar os pontos 1–15 e suas posições artísticas.
- Próximo ID livre da Cônego nesta tentativa: 16. A sequência geométrica da extensão deverá ser separada da numeração histórica, sem renumerar fotos existentes.

Interrupção antes do primeiro avanço: a ferramenta de navegador não iniciou por `MODULE_NOT_FOUND` do arquivo interno temporário `kernel.js`, inclusive após reinicialização. O leitor Node apresentou a mesma falha. A leitura local dos documentos foi possível pelo terminal fora do executor restrito. Não foram descobertos panoramas intermediários, capturadas novas imagens ou modificados manifesto e cenário nesta tentativa.

Ao retomar, navegar um panorama por vez, salvar e conferir as oito direções antes do avanço seguinte, examinar todas as fotos e os volumes compartilhados das duas esquinas, integrar o trecho e executar as verificações da skill. Este registro não declara a expansão concluída nem comprova cobertura entre as referências.

## Retomada Simeão → Fernando — bloqueio de acesso em 11/10/2026

Nova solicitação: partir da esquina da Cônego Mendonça com a Simeão de Macedo e seguir para oeste até a próxima esquina, Rua Fernando Carvalho. Esse sentido substitui o ponto de partida da tentativa anterior; o trecho a reconstruir é o mesmo.

A leitura do mapa do Google Maps nesta tentativa confirmou a ligação da Cônego entre Simeão e Fernando, sem uma interseção intermediária exibida. A camada azul mostra cobertura de Street View no trecho. Isso não comprova acesso às fotografias nem permite levantar as fachadas.

Tentativas de acesso:

- A ferramenta integrada de navegador voltou a falhar na inicialização com `MODULE_NOT_FOUND` do arquivo interno `kernel.js`, mesmo após reinicialização.
- Um navegador Edge automatizado alternativo abriu o mapa. Foram tentados os panoramas conhecidos nas duas esquinas, a busca pela coordenada da Simeão e a seleção direta da cobertura azul na esquina inicial.
- A seleção da cobertura azul retornou o panorama histórico `WOqiStV1h5j9BGtjJxUU6A`, mas a interface exibiu “Não há imagens do Street View disponíveis aqui”. A coordenada na URL do mapa não foi usada para substituir o GPS efetivo registrado no manifesto.
- A tentativa de diagnóstico com renderização por software registrou HTTP 500 em `www.google.com/maps/photometa/si/v1` e HTTP 403 em `streetviewpixels-pa.clients6.google.com/v1/tile`. Portanto, não foi possível observar ou navegar pelos panoramas. Esse resultado é uma limitação de acesso nesta sessão, não uma afirmação de ausência de cobertura da rua.

Nenhum panorama intermediário foi descoberto ou capturado. Manifestos, fotografias, geometria e código do jogo permaneceram inalterados por esta tentativa. Não foi iniciada uma ligação navegável baseada apenas no mapa.

Retomar na Cônego/ponto-01 (`WOqiStV1h5j9BGtjJxUU6A`, -4.4509722, -43.8854794), conferindo a direção oeste para a Fernando. Preservar os pontos 1–15; o próximo ID livre continua sendo 16. O destino de referência é a esquina já documentada pela Fernando/ponto-17 (`D1r1lkX0CXEqrnzaI8CeKQ`). Quando as imagens estiverem acessíveis, avançar um panorama por vez, capturar e examinar as oito direções, integrar os volumes compartilhados e conferir o percurso nas quatro câmeras antes de declarar a expansão concluída.

## Expansão concluída: Simeão → Fernando — 11/10/2026

Este levantamento substitui os bloqueios das duas tentativas anteriores. O navegador Edge visível carregou as imagens, confirmadas pelo usuário. A navegação partiu do ponto 01 da Cônego e seguiu para oeste, um panorama por vez, até a interseção da Fernando Carvalho; cada conjunto de oito direções foi salvo antes do avanço seguinte. A captura termina no ponto 22, na boca leste da esquina, sem entrar no próximo quarteirão. As coordenadas vieram dos metadados de cada panorama, não do centro aproximado do mapa.

Foram acrescentados sete pontos (16–22) e 56 fotografias JPEG de 900×600, com imagens de junho de 2025 e captura em 11/10/2026. A Cônego passa a ter 22 pontos e 176 fotos. O panorama inicial e os IDs 1–15 foram preservados. A ordem de captura da extensão é 1→16→17→18→19→20→21→22. Todas as 56 imagens foram examinadas nas sete montagens completas de oito direções em comparacoes/ponto-16.jpg até ponto-22.jpg; também foram conferidas as referências Cônego/01 e Fernando/17 para compartilhar os volumes das esquinas.

| Ponto | Observações lado norte (1, 2, 8) | Observações lado sul (4, 5, 6) e continuidade (3, 7) |
| --- | --- | --- |
| 16 | Muro branco/bege com revestimento irregular de pedra, portão de garagem e porta estreita com grades diagonais; número 220 e vegetação baixa. | Lateral creme/amarela do Bar O Péricles, telhas vermelhas, duas portas de enrolar azuis próximas da Simeão e pequena janela alta na parte cega. A vista leste confirma a esquina inicial. |
| 17 | Continuação do mesmo muro de pedra e suas grades, com extremidade branca; poste com equipamento. | Garagem 203 de metal marrom, seguida por casa branca com duas janelas e porta de grades escuras ornamentadas. O bar continua visível a leste. |
| 18 | Muro amarelo de alturas diferentes, portão branco na parte baixa e cobertura cinza de uma garagem adjacente. | Casas brancas: porta gradeada e janela ampla de madeira, barras verticais, número 223. A ala comprida e gasta do Centro Operário começa a oeste; não é uma sequência de casas independentes. |
| 19 | Garagem de portão branco sob cobertura metálica, fachada verde mais alta de porta de enrolar branca; restaurante amarelo em seguida. | Ala antiga do Centro Operário, reboco creme/ocre descascado, janelas de venezianas marrom-avermelhadas com barras verticais, platibanda e base avermelhada. |
| 20 | XICO’S PRATOS, letreiro Restaurante Self Service, portão claro ornamentado à esquerda e porta de enrolar branca à direita; pequeno vão gradeado alto. Sobrado contíguo a oeste. | Mesma ala do Centro Operário, três janelas e transição para muro mais baixo, respiradouros estreitos e faixa superior recuada. Carros estacionados junto ao passeio norte. |
| 21 | Sobrado 254, duas varandas superiores de vidro, fachada bege, garagem e porta brancas; revestimento amadeirado na parte cega inferior. Agência azul na esquina seguinte. | Muro envelhecido do Centro Operário, respiradouros e aproximação da varanda ornamentada da esquina. As vistas oeste já mostram a rua transversal. |
| 22 | Agência Regional do Trabalho: azul, faixas brancas, portas de vidro, porta de enrolar clara, condensadora e pequenos elementos vazados. | Varanda de grades ornamentadas do Centro Operário; além do cruzamento, Clínica Sublime e terreno com muro baixo de tijolos caiados, já cadastrados na Fernando. É o limite da expansão. |

### Integração e limites da interpretação

O gerador mantém os x/y históricos dos IDs 1–15 e distribui os novos pontos pelas distâncias geográficas relativas até x=-1132, y=2345, no braço leste da Fernando (eixo x=-1202). A rua é simplificada como transversal reta; alturas, fundos e dimensões dos lotes são aproximações artísticas, não medidas cadastrais. A ordem geométrica em world.js é 22→21→…→16→1→2→…→15.

O catálogo mendonca-west.js acrescenta oito volumes e atualiza quatro existentes: o Bar O Péricles, o muro da esquina da Simeão, o Centro Operário e a Agência Regional do Trabalho. A ala comprida do Centro Operário é parte do mesmo prédio. A Clínica Sublime e o terreno além da esquina continuam sendo os objetos já modelados na Fernando. Não se duplicaram os prédios nem se inventou uma ligação pelo interior dos lotes. Os detalhes de pedra, cobertura, varandas e muro envelhecido estão em mendonca-west-render.js; as aberturas são explícitas e usam fotos da rua correta.

Pista e passeios usam roadType=rua e sidewalkType=calcada-de-rua: 128 unidades de pista e 40 por passeio. Os dois postes acompanham a iluminação e os fios da Cônego; os três carros representam veículos estacionados observados, com posição artística. Pessoas e veículos em movimento nas fotos não se tornaram obstáculos fixos.

### Verificação desta expansão

71 testes Node aprovados, incluindo três regressões novas da extensão. Os 56 JPEGs foram decodificados e conferidos em 900×600, e as 176 imagens da Cônego têm hashes distintos. Os 15 pontos antigos foram comparados com uma cópia anterior à expansão: IDs, x/y, panoramas e GPS iguais.

No navegador HTTP: ida por clique no minimapa do ponto 01 ao 22 e retorno; caminhada por teclado; E nos pontos 01, 19 e 22 (oito direções do ponto final carregadas); quatro rotações Q e vista aérea M. Sem erros JavaScript observados. As quatro câmeras foram comparadas em renderização controlada às 12h e às 20h, sem modificar o relógio do sistema ou persistir horário forçado. Os registros ficam em reference/screenshots/conego-oeste-dia-quatro-cameras.png, conego-oeste-noite-quatro-cameras.png, conego-oeste-vista-aerea.png e conego-oeste-fotos-esquina.png.

## Expansão Fernando Carvalho → Praça Alcebíades Silva — 11/10/2026

Continuação solicitada pelo usuário no mesmo sentido oeste. O Street View foi percorrido um panorama de cada vez, partindo do ponto 22, com gravação das oito direções antes de cada avanço. O mapa e as vistas da Metalmar confirmam a próxima interseção em T, para sul, na Praça Alcebíades Silva. A Avenida São Benedito fica adiante e não foi incluída. O último panorama é `xCcGsjV18l1XvvU2AoBxzA`, latitude -4.451360552415614, longitude -43.88676327436415, com imagens de junho de 2025. [Esquina final no Street View](https://www.google.com/maps/@-4.4513606,-43.8867633,3a,75y,250h,90t/data=!3m4!1e1!3m2!1sxCcGsjV18l1XvvU2AoBxzA!2e0).

Foram acrescentados os pontos 23–31: 72 arquivos, dos quais 64 são capturas novas e oito são reutilizados, sem recaptura, do ponto 17 da Fernando Carvalho. Essa reutilização é o ponto 23 da Cônego, com o mesmo panorama e GPS; `capturedAt` permanece 10/10/2026 e `reusedAt` registra 11/10/2026. As datas dos pontos 24–31 distinguem captura em 11/10/2026 de imagens de junho de 2025. O manifesto preserva fonte, URLs, sequência e geolocalização individual. A Cônego passa a 31 pontos e 248 fotos; o acervo total passa a 122 pontos e 976 arquivos.

### Observação das oito direções

Todas as pranchas `comparacoes/ponto-23.jpg` até `ponto-31.jpg` foram examinadas, além das vistas da junção já existentes. Nomes abaixo vêm dos letreiros e do mapa; dimensões não foram medidas nas fotografias.

| Pontos e fotos principais | Lado norte | Lado sul |
| --- | --- | --- |
| 23–25; 1, 2, 7, 8 / 4, 5, 6 | Clínica Sublime: frente azul comprida, ala central cinza com mosaico, janelas altas estreitas, faixas envidraçadas baixas, entradas de vidro; canto branco com painel amadeirado e faixa azul. Palmeiras pequenas, canteiros e piso pavimentado. Mesma clínica da Fernando. | Mesmo terreno murado da Fernando: alvenaria caiada branca, trechos de tijolo aparente, pilares, manchas e vegetação alta atrás do muro. |
| 25–28; 1, 2, 8 / 4, 5, 6 | Casa 314: muro branco, portão vertical castanho/cinza, jardim e palmeira alta. A casa não ocupa todo o pátio visível. | Fim do terreno, parede lateral antiga e ala da Metalmar: reboco creme gasto, pilares rosados, janelas altas de madeira com grades escuras. |
| 28–29; 1, 2, 8 / 4, 5, 6 | Casa de revestimento de pedra rosada/bege, janela larga com grade branca, garagem cinza e faixa vazada acima. | Ala envelhecida da Metalmar, porta fechada com tijolo vermelho e vestígios de letreiro; manchas, base de alvenaria aparente e aberturas repetidas observáveis de ângulos diferentes. |
| 29–30; 1, 2, 8 / 3, 4, 5 | Dr. Cláudio Paz, Fisioterapia: frente clara, grades metálicas, entrada elevada e rampa com corrimãos; ao lado, garagem branca em parede cinza-azulada. | Parte amarela da Metalmar, cobertura de telhas aparente junto à esquina, janelas verticais gradeadas, madeira escura e inscrição desbotada. |
| 30–31; 1, 2, 8 / 3, 4, 5, 6, 7 | CREA-MA: vidro, portal azul e garagem lateral. Girassol Center: moldura amarela, verde e painel reticulado de estabelecimentos; textos pequenos ilegíveis não foram inventados. | Esquina da Metalmar com porta gradeada, abertura clara e placa da praça. Boca transversal livre; recuo pavimentado, motos e árvore de copa larga em canteiro de borda clara. |

A Cônego continua além da última posição, mas este levantamento termina na interseção. A praça foi representada apenas pelo acesso e pelo pequeno recuo arborizado visível. Veículos estacionados foram simplificados; pessoas e tráfego transitório não viraram obstáculos permanentes.

### Tradução ao cenário

`mendonca-praca.js` acrescenta seis volumes e reaproveita os IDs `fc-clinica-sublime` e `fc-terreno-esquina`. Suas frentes para a Fernando foram preservadas; a profundidade foi estendida para representar as fachadas vistas pela Cônego, sem duplicar os edifícios. A Metalmar é um volume de esquina com duas faces e cobertura dividida entre telhas a oeste e platibanda a leste. `mendonca-praca-render.js` desenha os detalhes, terreno e piso; `architecture.js` compõe a cobertura desse volume.

Os pontos 1–22 mantêm suas posições e demais propriedades. O ponto 23 ancora a passagem na Fernando em x=-1202, y=2345; os seguintes usam as distâncias entre panoramas na escala artística de 14 unidades por metro, terminando em x=-2223. A ordem geométrica segue x crescente, independente dos IDs. Pista de 128 e passeios de 40 unidades por lado continuam derivados do perfil do manifesto. Rua, minimapa, chegada e limites do mundo alcançam o ponto 31; a boca da praça permite entrar na esquina e retornar.

Alturas, profundidades, recuos, fundos, o formato em L do terreno e proporções das duas alas da Metalmar são aproximações artísticas. As fotos sustentam as fachadas, a sequência dos imóveis e os elementos visíveis; não sustentam uma planta cadastral nem o interior completo da praça. Os três postes integram os fios, sombras e luz noturna existentes. Comércios, clínica, CREA-MA e muros não recebem iluminação residencial; a casa de pedra mantém a regra de janelas da residência.

### Verificação desta continuação

74 testes Node aprovados, incluindo três novos testes de preservação, acervo, continuidade, retorno, associação das fotos, colisões e volumes compartilhados. Os JPEGs foram decodificados em 900×600; oito arquivos reutilizados são idênticos aos da Fernando/17 e as 64 novas imagens têm hashes distintos. Os pontos 1–22 foram comparados integralmente com a cópia anterior à expansão, sem alteração.

No navegador HTTP: ida pelo minimapa de 23 a 31, retorno passando por 28 e consulta E em 23, 28 e 31. Todas as oito direções do ponto final carregaram. Caminhada pelo teclado e clique no chão foram exercitados; quatro rotações Q e vista aérea M funcionaram sem erros JavaScript observados. As quatro câmeras mostram o trecho completo nos registros controlados de dia e noite, às 12h e às 20h; o relógio do servidor não foi alterado e os controles temporários de inspeção foram removidos.

Evidências em `reference/screenshots/conego-praca-dia-quatro-cameras.png`, `conego-praca-noite-quatro-cameras.png`, `conego-praca-vista-aerea.png`, `conego-praca-fotos-esquina.png`, `conego-praca-esquina-final.png` e `conego-praca-verificacao.json`.

## Praça Alcebíades Silva → Avenida São Benedito — 12/10/2026

O usuário confirmou a continuação a partir da praça para oeste, rumo à Avenida São Benedito. O ponto 31 foi reutilizado sem recaptura; seis avanços consecutivos do Street View produziram os pontos 32–37. Todas as oito direções foram gravadas, decodificadas em 900×600 e examinadas em pranchas antes de modelar. As imagens são de junho de 2025. O mapa identifica a avenida e as fotografias mostram as quatro bocas do cruzamento; o ponto 37 fica no braço oeste, ainda documentando a interseção. A captura encerra ali.

| Ponto | Norte e vistas diagonais/retorno | Sul e continuidade |
| --- | --- | --- |
| 32 | Girassol Center com portal amarelo, vegetação e painel quadriculado; Santander 352 de fachada cinza, faixa vermelha, entrada de vidro e corrimãos. CREA-MA permanece a leste. | Metalmar e boca da praça atrás; árvore grande em canteiro, quiosque leve, mesas e estacionamento pavimentado. São os elementos já cadastrados, sem duplicação. |
| 33 | Muro branco comprido com manchas na base, limite de garagem e edifício baixo atrás; Santander e Girassol à direita. Flores acima do muro adiante. | Vagas diagonais, marca acessível e carros estacionados; o pavilhão público tem frente branca, base azul, porta gradeada e telhas. O sobrado branco de arcos aparece além da próxima esquina. |
| 34 | Placa legível TRE / Cartório Eleitoral da 7ª Zona / Codó, muro branco gasto, flores rosas, portão de madeira e entrada estreita. Poste e fiação densa. | Estacionamento, árvore em canteiro circular, pavilhão de Cultura e Turismo; jardim e caminhos internos permanecem os da praça existente. |
| 35 | Portões amadeirados do cartório ao lado da Impacto Calçados: térreo aberto de vitrines, pequena escada, faixa vermelha com letreiro azul/branco, andar superior marrom com vidro e molduras claras. | Árvores, carros estacionados e ponta ajardinada da praça. Na esquina oposta há muro de pedra cinza, sobrado branco e varandas em arco; o asfalto tem remendos. |
| 36 | Frente da Impacto inteira e a boca norte da avenida; a loja ocupa um único volume de esquina. | Boca sul da avenida, passeio largo e pequeno canteiro na ponta da praça. Sobrado branco de dois níveis, varandas abertas e muro alto de pedra; comércio camuflado na esquina noroeste. |
| 37 | Lateral marrom da Impacto, faixa mais escura, base clara, pequenos vãos horizontais e condensadoras; pilar de canto cinza. Esquina oposta com pintura camuflada azul/cinza, portões verde-escuros e letreiro gasto. | Retorno leste confirma praça/estacionamento; muro de pedra e flores em primeiro plano, varanda branca de pilares retangulares, arcos abatidos, guarda-corpos horizontais claros e telhas. A Cônego continua a oeste, mas o levantamento para na interseção. |

### Modelagem e procedência

`mendonca-benedito.js` acrescenta Santander, muro/portões do Cartório Eleitoral, Impacto e os dois volumes de contexto do lado oeste da avenida. Girassol Center e pavilhão da praça mantêm seus IDs e recebem referências mais próximas. O quiosque, árvore inicial e Metalmar continuam únicos. Veículos estacionados são representados de modo simplificado; motos em movimento e a caminhonete da polícia vista no ponto 37 não são obstáculos fixos. Textos pequenos ilegíveis não foram transcritos.

As 31 posições e os metadados anteriores foram comparados integralmente com a versão anterior à captura e preservados. O gerador fixa a âncora Fernando em Julho/09, independentemente da ordem de novos pontos da Vinte e Oito. Distâncias geográficas acumuladas ×14 determinam 32–37, mantendo `y=2345`. A avenida se alinha à borda artística já existente da praça; o panorama 37 fica dentro da interseção. Sua largura vem do tipo `avenida`/`calcada-de-avenida` registrado em `intersections`, sem criar uma rota própria.

Alturas, profundidades, dimensões do estacionamento, fundos e coberturas ocultas são aproximações artísticas. O muro do Cartório é desenhado como limite de lote, sem inventar seu interior. O volume do sobrado incorpora visualmente o muro frontal de pedra; a planta interna não foi medida. A classificação dos volumes de contexto não permite inferir seu uso residencial a partir das fotos, e suas varandas não recebem luz de janelas.

48 fotos novas; Cônego com 37 pontos/296 arquivos; acervo total 185 pontos/1480 arquivos. Evidências da captura, renderizações diurna/noturna, fotos E, vista aérea e relatório de verificação usam o prefixo `reference/screenshots/conego-benedito-`.

Verificação final: 92 testes aprovados; os três testes da extensão cobrem preservação, ida/volta nas quatro câmeras, interseção e colisões. No navegador, clique no chão, minimapa, caminhada por teclado, Q e M funcionaram; E carregou oito direções em 31, 34 e 37 e selecionou Praça/02 ao entrar na transversal inicial. As quatro vistas carregaram 384/384 referências usadas nas texturas; nenhum erro JavaScript permaneceu. Pranchas diurna e noturna conferidas após ajuste das vitrines e guarda-corpos. O gerador foi executado novamente e produziu saída idêntica. Relatório: `reference/screenshots/conego-benedito-verificacao.json`.
