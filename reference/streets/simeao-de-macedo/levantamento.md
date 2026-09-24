# Revisão visual da Rua Simeão de Macedo

Referências: 248 fotografias em `maps/simeao-de-macedo/ponto-01` a `maps/simeao-de-macedo/ponto-31`, oito direções por ponto. Os primeiros 17 conjuntos foram preservados; a extensão 18–31 foi capturada em setembro de 2026. As imagens de 3 (leste) e 7 (oeste) foram comparadas com vistas ao longo da rua para evitar contar novamente uma construção vista em pontos consecutivos. `comparacoes/` contém as pranchas de revisão.

Em 22/09/2026, os identificadores e coordenadas dos 17 panoramas foram recuperados no Street View, partindo do link original (`3Iri8Dp9wEE04GVstk3_lg`) e avançando uma posição por vez até `-OJOOerEbiWq_RwklEIpjg`. Cada panorama foi conferido com a imagem norte já salva: ao comparar miniaturas RGB de 64 × 43 pixels, a imagem correspondente teve a menor diferença em todos os 17 casos (média absoluta entre 0,65 e 0,79 numa escala de 0 a 255). Nenhuma fotografia foi substituída.

`maps/simeao-de-macedo/manifest.json` registra essas coordenadas geográficas, os panoramas e o bairro **Centro**, confirmado pelo usuário. O espaçamento artístico original de 140 unidades entre pontos no jogo foi preservado.

Esquerda e direita abaixo consideram o percurso da praça até a Rua Cônego Mendonça. As divisões correspondem a frentes visíveis, não a matrículas de imóveis ou endereços verificados. Posições, alturas e profundidades continuam sendo aproximações para o cenário 2D.

| Pontos | Esquerda / oeste | Direita / leste |
| --- | --- | --- |
| 01–03 | Casa branca de base vinho, persiana cinza, porta verde e pequeno respiro; outra frente branca/vinho com portão e porta estreita; casa salmão com uma porta gradeada. | Praça: canteiro vazio, muda e árvore jovem; monumento do Cruzeiro do Sul, conforme identificação do usuário, com braços dourados alargados e medalhão em pedestal quadrado branco; poste de quatro luminárias e banco circular; antigo cinema com aberturas vedadas; pavilhão amarelo. |
| 04–06 | Muro longo de tijolos pintados de branco, vegetação atrás, portão verde e abertura vedada ao final. | Área aberta, caminhos claros e arbustos; painel Faxyna; início das casas com reboco rosa/cinza, portão gradeado, persiana e rampa. |
| 07–08 | Frente rosa deteriorada com abertura vedada; casa cinza de grades escuras; azulejo branco com rodapé vinho, janela gradeada longa e porta estreita. | Cerâmica marrom; grades brancas diagonais e piso quadriculado; portão amplo com janela; casa branca de base cinza e uma garagem. |
| 09–10 | Varanda bege de grades estreladas; Aliança Odontologia; cerâmica branca com porta e janela de madeira. | Varanda verde recuada, trepadeiras e parabólica; clínica recuada com porta de madeira, duas janelas estreitas e três vasos. |
| 11–12 | Casa bege com um portão e duas janelas de grades em chevron; muro azul/pêssego; sobrado com grades em losangos e varanda. | Frente de duas garagens; casa amarela descascada com portão e janela de madeira; lote demolido aberto e paredes laterais irregulares. |
| 13–14 | Casa branca com porta e persiana dupla; recuo de tijolos com construção ao fundo; casa creme de porta preta e janela pequena. | Varanda bege de grades brancas; casa verde; casa de revestimento geométrico com porta e janela de madeira. |
| 15–17 | Construção longa creme com base azul, duas portas abertas e persiana azul no extremo. Área indicada pelo usuário: **Bar O Péricles**. | Garagem e porta brancas em muro cinza; casa branca de frisos horizontais e duas janelas; Autoescola Bom Pastor, duas janelas térreas gradeadas, porta de vidro e pavimento superior pêssego. |

## Bar O Péricles

A imagem anotada enviada pelo usuário (`Downloads/1.png`) e sua descrição definem o bar dentro da construção longa: três mesas alinhadas, tacos pendurados, balcão transversal perto do fundo e garrafas na parede atrás do atendente. A identificação atual do usuário prevalece sobre a pintura comercial antiga presente no Street View. O interior é uma interpretação da planta indicada, sem fotografia interna.

Péricles permanece do lado interno do balcão. Tem estatura maior que a personagem, pele morena e bigode. Ao clicar nele, a personagem caminha até o balcão e ele diz: “E aí meu chapa, o que vai querer?”. A mesma navegação atende a rua e o salão; os dois vãos da fachada são passagens reais, com colisões nas paredes, nas mesas e no balcão.

## Conferência para a segunda câmera

As 17 vistas leste (`3.jpg`) foram conferidas novamente para a câmera que revela o lado direito. A mesma lista de 15 frentes oeste e 15 frentes leste alimenta as duas vistas, além dos edifícios da praça e da esquina, do muro de jardim e dos dois recuos modelados separadamente. Uma frente pode ser uma casa, estabelecimento ou muro; essa contagem não representa um cadastro imobiliário.

Na varanda verde do ponto 09, a porta está entre as duas janelas; a janela maior fica no lado norte. Esse posicionamento foi corrigido sem acrescentar aberturas. Na autoescola, os dizeres superiores foram ajustados para os serviços de habilitação e categoria visíveis na fotografia. Também foram individualizados o reboco cinza irregular acima da pintura rosa, o painel branco ao redor da porta da clínica malva e os dois medidores junto à porta do muro cinza. Grades diagonais, azulejos em losangos, duas garagens, lote demolido, parede cinza com palmeira e casa branca de duas janelas permanecem nas mesmas posições em ambas as perspectivas.

A troca por Q não espelha o cenário nem modifica sua planta. Fachadas que se afastam da câmera ficam atrás dos telhados. As letras das placas são orientadas para leitura em cada vista, mantendo a posição física das portas e janelas. No bar, a parede que passa para o primeiro plano recebe transparência de recorte para manter mesas e personagem visíveis.


## Continuação após a Cônego até a Henrique Figueiredo

Solicitação do usuário: atravessar a Cônego Mendonça e mapear a Simeão até a próxima esquina, incluindo cenário navegável. A próxima transversal foi identificada no mapa como **Rua Henrique Figueiredo**. O Google Street View mostra imagens de junho de 2025; data de consulta/captura em setembro de 2026, registrada no campo extensions do manifesto.

Foram observados sequencialmente e salvos 14 panoramas novos (18–31), com latitude/longitude WGS84 extraídas da URL de cada posição do Street View e oito orientações fixas por panorama. Nenhum conjunto 1–17 foi renumerado ou substituído. Os 112 JPEGs novos têm 900 × 600 pixels e hashes distintos. A numeração 18 é uma nova captura, sem relação com o antigo conjunto 18 retirado anteriormente.

O primeiro panorama novo é vzkRIz9QJeM24eqygbV2qg (-4.4508922, -43.8855186); o último é TggOZk5xNgGSEQ-pUB8PDQ (-4.4497823, -43.8859137), na aproximação da Henrique Figueiredo. Fonte verificável: [última esquina no Street View](https://www.google.com/maps/@?api=1&map_action=pano&pano=TggOZk5xNgGSEQ-pUB8PDQ&viewpoint=-4.4497823,-43.8859137). A distância acumulada entre os panoramas 17 e 31 é aproximadamente 152,5 m.

| Pontos | Oeste / esquerda no avanço | Leste / direita no avanço |
| --- | --- | --- |
| 18–19 | Muro branco comprido com reboco escurecido, cobertura atrás e poste. | Face azul revestida da HMB, com porta e inscrições de chaves/carimbos; muro amarelo com faixa clara e árvore. |
| 20–21 | Casa de cerâmica bege, janela gradeada e garagem branca; garagem 1644A; casa 1644 de portões diagonais e coluna amadeirada. | Garagem vinho com frisos claros; casa verde clara com porta/janela verdes, detalhes triangulares e telhado aparente. |
| 22–23 | Revestimento claro de pedra, garagens brancas e Tadeu Santos Advogados em fachada amadeirada. | Casa branca com garagem terracota; sobrado de varanda vazada, cobertura de telhas e garagem avermelhada. |
| 23–25 | Início do muro chapiscado longo, árvores atrás e tela acima. | Colégio Cristo Rei: pintura azul, salmão e amarela, porta estreita, acesso principal e portão cinza. Depois, muro deteriorado e portão preto/branco. |
| 26–27 | Muro escuro, vegetação e tela com trepadeiras. | Garagem de reboco, casa cinza de frisos brancos e grades radiais; garagem antiga branca e platibanda. |
| 28–30 | Continuação do mesmo muro/tela/árvores, sem inventar novas casas. | Parede alta sem pintura, depois muro de reboco com tijolos expostos e portão cinza. |
| 31 | Aviso de lixo no muro; na esquina oposta, bar de pintura salmão e base escura. | Fim do muro com portão; na esquina oposta, casa verde de base cinza e janelas gradeadas. |

As divisões de imóveis, alturas, profundidades, plantas internas e o recuo entre o último panorama e o centro do cruzamento são aproximações artísticas. O trecho novo permanece alinhado ao eixo do cenário original; o gerador acumula distâncias geográficas, mas não converte o desenho em planta cadastral. O centro da esquina fica 90 unidades após o ponto 31 no jogo. A Henrique Figueiredo é representada apenas por um trecho curto para concluir o cruzamento; não recebeu uma rota ou mapeamento próprio.

O catálogo simeao-extension.js reutiliza os IDs corner-wall e corner-shop, compartilhados com a Cônego. O muro oeste comprido e o muro final leste são divididos em sprites adjacentes somente para composição e transparência: não representam múltiplos imóveis. Motocicletas e pessoas das fotografias não são um cadastro de habitantes; o cenário mantém os elementos estáticos aproximados. Os postes e casas elegíveis herdam o ciclo de iluminação existente.

Verificação: consulta E no ponto 22, câmeras e vista aérea; testes de continuidade pelo eixo, travessia da Cônego, chegada/retorno à Henrique Figueiredo, localização dos novos pontos, colisões e unicidade das esquinas. As pranchas ponto-18.jpg a ponto-31.jpg e extensao-1.jpg a extensao-4.jpg podem ser regeneradas com simeao-contact.py.
