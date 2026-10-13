# Avenida São Benedito — Cônego Mendonça até Vinte e Oito de Julho

Sentido sul confirmado pelo usuário: lado oeste da Praça Alcebíades Silva. Cidade Codó, bairro Centro, conforme o cadastro e a continuidade das vias. Captura em 12/10/2026; imagens do Google Street View de junho de 2025. São 14 panoramas e 112 JPEGs de 900 × 600: ponto 1 reutiliza, byte a byte, Cônego/37; pontos 2–14 acrescentam 104 fotografias. As 14 pranchas em `comparacoes/` foram examinadas nas oito direções N, NE, L, SE, S, SO, O e NO antes da modelagem.

## Percurso e limite

Partida no panorama `3tgKt-o2TJxNZ_TY2ywPnQ` (-4.4515245, -43.8873042). Um avanço por vez pelo Street View, gravando oito fotos antes do próximo avanço. O ponto 14, `tmUZjaD99JbHyjIXCJ7LVA` (-4.4526182, -43.8869192), documenta a esquina da Rua Vinte e Oito de Julho, ao lado do Banco do Brasil. Não houve captura no quarteirão seguinte. Uma tentativa de download do ponto 14 expirou; a repetição na mesma posição concluiu o conjunto e sua decodificação, sem lacunas no manifesto.

O mapa mostra uma abertura sem nome junto à SP Closet. Nas fotos 9/6–7 e 10/7–8 ela termina em terreno aberto, acompanhado de muro com anúncio de venda. Foi interpretada como acesso ao terreno, sem interseção viária confirmada; não se criou uma transversal navegável. A próxima esquina confirmada por mapa e fotografias é a Vinte e Oito. Evidências: `../../screenshots/sao-benedito-mapa.png` e `sao-benedito-streetview-final.png`.

## Observações das oito vistas

| Ponto | Norte e retorno | Oeste / fachadas | Leste / praça | Sul e avanço |
| --- | --- | --- | --- | --- |
| 1 | Impacto: sobrado marrom, vents e aparelhos de ar; loja camuflada na outra esquina. | Continuação da Cônego e sobrado branco de arcos. | Estacionamento e pavilhão branco com ala azul. | Avenida junto ao muro de pedra. |
| 2 | Frente da Impacto e faixa vermelha/azul; os dois acessos do cruzamento. | Sobrado compartilhado: varanda de arcos, flores, dois portões claros e cerca elétrica. | Canteiros, vagas de bloquetes, árvores e palmeiras. | Casa de azulejos com janelas altas. |
| 3 | Esquina inicial ainda visível, confirmando o alinhamento. | Quatro janelas ogivais, madeira e grades, azulejos brancos; casa vizinha de grades geométricas. | Biblioteca Pública Municipal Professor Fernando Carvalho: nome legível no pavilhão baixo, base vinho, ala azul. | Fachada gradeada e início do colégio. |
| 4 | Retorno reúne sobrado, janelas e Impacto, sem rua intermediária. | Fachada baixa de azulejos, portão e painel de grades estreladas; início da escola. | Frente da biblioteca, entrada central, rampa, janelas horizontais e jardim. | Fachada creme do C.E. Colares Moreira. |
| 5 | Casas anteriores e biblioteca vista em diagonal. | Frontões, janelas azuis, muro baixo e grade de pontas inclinadas. | Base vinho, árvores, palmeira e motos na praça. | Entrada central e sequência de motos da escola. |
| 6 | Vista de retorno confirma a extensão do mesmo colégio. | Letreiro C.E. COLARES MOREIRA, três arcos e portão central; símbolos do Governo do Maranhão. | Estacionamento de motos, árvores de copa cheia; casarão ao fundo. | Final do colégio e sobrado comercial. |
| 7 | Escola vista de retorno, fachada longa única. | Frontão sul do colégio, poste com transformador e sobrado ocre. | Casarão branco com telhado elevado, janelas em arco, aparelhos de ar e umidade na base. | Lojas e barreira móvel junto à obra na praça. |
| 8 | Biblioteca e motos voltam a aparecer atrás das árvores. | SP Closet rosa e FG Agrogeo branca/verde sob uma mesma varanda ocre; grades e desgaste no reboco. | Árvore de grande copa no estacionamento; casarão parcialmente oculto. | Acesso de terra e muro branco de base vermelha. |
| 9 | Lojas e lateral do mesmo sobrado confirmam a divisa. | Abertura de terreno e muro com anúncio de venda; não há transversal confirmada. | Tronco e copa grande, pavimento em reforma, casarão visto em diagonal. | Joana Maia, instituto, parede amarela e banco. |
| 10 | Acesso ao terreno e retorno para lojas/escola. | Joana Maia Arquitetura: vidro escuro e base azul; IESI branco com faixas vermelhas. | Areia e pilhas de blocos, jardim do casarão, quadra existente. | Quiosque de chapa clara e volumes do banco. |
| 11 | Terreno, lojas e casarão ao retornar. | Instituto Educacional IESI, placa dourada, porta vermelha, cartazes FAEPI/AJES; parede amarela alta e porta baixa. | Quiosque, telefone público, quadra cercada, árvore e materiais da reforma. | Banco do Brasil de dois pavimentos. |
| 12 | Quiosque pelo lado da cobertura e casarão ao fundo. | Banco com faixa azul superior, janelas alinhadas e grades brancas altas. | Cobertura de metal aberta, piso de cerâmica, cadeiras, árvore e motos. | Faixa de pedestres e esquina com a Vinte e Oito. |
| 13 | Instituto, muro amarelo e retorno da avenida. | Continuação do mesmo banco, canteiro baixo e entulho junto à calçada. | Ponta arborizada da praça, quadra, bancos, rampas e canteiros existentes. | Placa do Banco do Brasil, semáforo e fachadas da transversal. |
| 14 | Avenida inteira em retorno; face do banco e quiosque. | Banco de base clara, faixa azul, placa amarela/azul e semáforo. | Borda curva da praça e continuidade da Vinte e Oito. | Casa da Cópia, esquina vermelha com face branca, hotel branco ao fundo. |

## Tradução para o cenário

`benedito-data.js` acrescenta 12 volumes, vegetação, carros, motos, postes e cobertura leve. `withBeneditoFaces` conserva o sobrado `cm-b-sobrado-arcos` e os dois volumes públicos `as-pavilhao-claro`/`as-biblioteca`; acrescenta suas faces observadas do oeste, sem duplicar a praça, a quadra ou suas construções. O pavilhão baixo tem o nome da biblioteca legível nas novas imagens; o ID anterior permanece. O ID histórico `as-biblioteca` do casarão permanece por compatibilidade, sem afirmar que ele seja o pavilhão identificado pelo letreiro.

As duas casas novas com janelas são residenciais para iluminação. Escola, banco, escritórios, lojas, hotel de contexto e quiosque não recebem emissão residencial. Motos, troncos, postes, grades móveis e pilares da cobertura têm colisão; o centro da cobertura fica aberto. A escola conserva a visão das entradas gradeadas. As mesmas plantas alimentam desenho, sombra e obstáculos.

O manifesto da própria avenida fornece pista de 160 unidades e passeios de 80 por lado. As vagas e canteiros são recuos adicionais. O gerador usa a latitude para distribuir os pontos entre as duas junções artísticas existentes; mantém GPS intacto, x do ponto inicial igual a Cônego/37, demais x alinhados à borda oeste da praça e ponto final em y=-95. Os sete arquivos de posições anteriores permanecem inalterados.

## Aproximações e limites

Dimensões, profundidade dos lotes, alturas, fundos ocultos e interior das lojas são aproximações artísticas. O jogo conserva a implantação anterior da praça, portanto não é uma planta cadastral. A Casa da Cópia e o hotel representam somente o contexto visível da esquina final. A interpretação do acesso ao terreno é visual; seu nome e situação administrativa não foram confirmados. Não se inventou um nome de rua. Estado de obras, veículos e pinturas refletem junho de 2025.

O gerador `generate-benedito-points.mjs` reproduz as posições; `benedito-contact.py` reproduz as pranchas com Python/Pillow. As pranchas desta captura foram produzidas com Sharp no ambiente de desenvolvimento, com as mesmas dimensões e ordem das oito vistas.

## Verificação em 12/10/2026

- `npm test`: 95 casos aprovados. Após os ajustes visuais de frontões, esquina, semáforo e telefone, os 10 casos relacionados à avenida, largura e iluminação também passaram.
- No navegador, ida e volta pelos 14 pontos; clique real no chão e no minimapa; movimento por seta; quatro rotações por Q; vista aérea por M. Todos os destinos foram alcançados e não houve erro de execução. Os passos da caminhada foram acelerados apenas no harness temporário de conferência.
- E abriu as oito direções no início (Cônego/37, desempate preservado), meio (São Benedito/7), fim (São Benedito/14), praça/2 e Cônego/36. Cabeçalho e fotos acompanharam a posição.
- Seis pranchas em `reference/screenshots/sao-benedito-{dia,noite}-{norte,meio,sul}-quatro-cameras.png` cobrem todo o trecho em quatro câmeras; também foi inspecionada `sao-benedito-vista-aerea.png`. Conferidas fachadas, recortes, profundidade, sombras, postes e janelas residenciais. As horas controladas foram usadas somente na renderização de teste.
- Os sete arquivos anteriores de pontos permaneceram byte a byte iguais ao início desta expansão. O novo gerador reproduziu sua saída sem alteração. O relatório está em `reference/screenshots/sao-benedito-verificacao.json`; nenhum gancho de teste foi salvo no código do jogo.
