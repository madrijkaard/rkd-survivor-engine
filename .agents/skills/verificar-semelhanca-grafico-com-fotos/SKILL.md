---
name: verificar-semelhanca-grafico-com-fotos
description: Comparar o cenário do jogo Codó Sobrevive com as oito fotos de todos os pontos de uma única rua informada pelo usuário e corrigir divergências visuais de fachadas, objetos e espaços públicos. Use para revisar fidelidade gráfica de uma rua já mapeada, sem expandir o trajeto nem revisar outras ruas.
---

# Verificar semelhança do gráfico com as fotos

Revise e corrija o cenário de **uma única rua por execução**, identificada pelo usuário. Compare todos os pontos mapeados, examinando as oito fotos de cada ponto e a representação correspondente no jogo. A entrega inclui as correções verificáveis, não apenas uma lista de diferenças.

Os caminhos abaixo partem da raiz do projeto. Use `AGENTS.md` e os guias de `maps/`, `reference/`, `src/` e `tests/` para entender os contratos relevantes.

## Limite obrigatório: exatamente uma rua

- É proibido verificar mais de uma rua nesta execução, mesmo que sejam vizinhas, façam parte de um percurso conectado ou compartilhem uma esquina.
- Se o usuário não indicar a rua, indicar várias ou houver ambiguidade, peça que escolha **uma** antes de começar a inspeção das fotos. Não selecione uma lista para processar em sequência.
- Identifique a pasta pelo nome solicitado e pelo cadastro de rotas em `src/world.js`. Se necessário, liste somente os nomes das pastas diretamente em `maps/`; não abra manifestos ou fotos de outras ruas para procurar a correspondência. O alias de rota `simeao`, por exemplo, corresponde à pasta `simeao-de-macedo`.
- Fixe a pasta selecionada como limite da leitura do acervo: abra somente `maps/<rua-escolhida>/manifest.json` e as imagens dentro dessa pasta. Não execute buscas recursivas, montagens, análises ou verificações de imagens em todo `maps/`.
- Consulte referências visuais e levantamentos apenas de `reference/streets/<rua-escolhida>/`. Uma referência a outra rua não autoriza segui-la.
- É permitido ler e alterar código compartilhado e documentação técnica quando necessário à correção da rua escolhida. Isso não autoriza inspecionar o acervo, percorrer ou revisar visualmente outras ruas.
- Nas esquinas, examine apenas o que aparece nas fotos da rua escolhida e a representação desses elementos no jogo. Preserve a identidade de volumes compartilhados. Não vire para auditar a transversal nem complete faces ocultas usando seu acervo.
- Não capture novos panoramas, não expanda o trajeto e não altere fotos ou coordenadas para fazê-las concordar com o desenho. Esta skill corrige a representação de um mapeamento existente.

Se a pasta não existir ou não houver mapeamento utilizável, informe essa limitação. Não substitua a rua por outra nem inicie um novo levantamento externo.

## 1. Preparar uma revisão completa da rua selecionada

Leia o manifesto selecionado e relacione todos os seus pontos ao cadastro artístico no jogo. A latitude/longitude WGS84 identifica a captura real; as posições `x/y` identificam o lugar correspondente no cenário. Não use GPS como coordenada de tela.

Para cada ID, confirme a pasta `ponto-NN` e esta ordem de imagens:

| Arquivo | Direção geográfica |
| --- | --- |
| `1.jpg` | Norte, 0° |
| `2.jpg` | Nordeste, 45° |
| `3.jpg` | Leste, 90° |
| `4.jpg` | Sudeste, 135° |
| `5.jpg` | Sul, 180° |
| `6.jpg` | Sudoeste, 225° |
| `7.jpg` | Oeste, 270° |
| `8.jpg` | Noroeste, 315° |

A direção da foto é geográfica; girar Q no jogo muda a câmera, sem mudar a identidade do ponto ou do objeto. Identifique cada fachada pelos seus vizinhos, esquina, aberturas e referências do catálogo antes de concluir que existe uma divergência.

Mantenha um registro de cobertura em `reference/streets/<rua-escolhida>/revisao-grafica.md`. Para cada ponto, registre as direções examinadas, elementos identificados, divergências, arquivos/IDs corrigidos e resultado da conferência no jogo. Use estados claros: pendente, corrigido e conferido, sem divergência observada ou inconclusivo com motivo. Não marque como revisado um ponto examinado apenas parcialmente.

Fotos ausentes, corrompidas ou sem detalhe suficiente devem constar como limitações. Não reutilize outra imagem para completar as oito nem declare fidelidade confirmada onde não há evidência.

## 2. Examinar as oito fotos de cada ponto e comparar com o jogo

Percorra todos os pontos do manifesto, sem amostragem. Abra e examine **cada uma das oito imagens**. Pranchas identificadas por ponto e direção ajudam a leitura; abra os originais quando necessário para contar janelas, distinguir materiais ou observar detalhes pequenos. Gere montagens somente para a rua selecionada, em sua pasta de `comparacoes/`, preservando os JPEGs originais.

Abra o jogo pelo servidor HTTP e navegue até a posição artística correspondente. Confira a associação com a tecla E. Compare ambos os lados e os elementos visíveis ao redor, usando as quatro câmeras Q e a vista aérea M conforme necessário. Screenshots antigos e leitura de código não substituem a inspeção do cenário atual.

Em cada ponto, confronte os seguintes aspectos:

| Elemento | O que comparar e corrigir |
| --- | --- |
| Casas e demais construções | Ordem e quantidade de fachadas, largura e altura relativas, alinhamento com vizinhos, recuos, volumes, coberturas, inclinação dos telhados, platibandas, muros e pilares. |
| Pintura e revestimentos | Cores, faixas, rodapés, tijolos aparentes, azulejos, acabamento e desgaste característico. Considere sombra, exposição e tonalidade da fotografia antes de trocar a cor-base. |
| Portas, janelas e portões | Quantidade, posição relativa, proporções, formato, abertura, material aparente como ferro ou madeira, grades, venezianas, barras e divisões. Não acrescente uma abertura sem evidência. |
| Calçadas e rua | Largura, altura relativa, meio-fio, pavimentação, rampas, entradas de garagem, escadas e número de degraus visíveis. Confira continuidade e desníveis observáveis. |
| Postes e fios | Presença, quantidade, tipo e posição em relação à fachada, porta, árvore e borda da calçada; braços e luminárias. Não aproxime o poste para outro lote por conveniência. |
| Carros e outros objetos | Presença nas capturas, cor, tipo e orientação aproximados, lado da rua e posição em relação às casas. Veículos são registros daquele momento; divergências entre fotos devem ser documentadas, sem duplicar o mesmo carro. |
| Árvores e vegetação | Localização dos troncos, proporção e formato das copas, canteiros, jardins, cercas e relação com os demais objetos. |
| Praças e monumentos | Limites, chão, caminhos, canteiros, bancos, grades e entradas; forma e orientação do monumento, pedestal, base, componentes e degraus. Preserve peculiaridades, sem substituir por uma forma genérica. |
| Implantação | Verifique se casas, carros, postes, árvores, bancos, escadas e monumentos ocupam o lugar observado. Um objeto sobre a praça ou a calçada nas fotos não pode estar deslocado para o asfalto no jogo. |

Relacione discrepâncias à evidência, por exemplo: `ponto-07/3.jpg e ponto-08/2.jpg → prédio ID X → faltam duas barras na grade`. Observe pontos vizinhos **da mesma rua** para resolver oclusões, continuidade dos lotes e objetos repetidos. Uma construção pode aparecer em vários panoramas; não a conte várias vezes.

Separe fatos visíveis de inferências. Perspectiva fotográfica, projeção artística e oclusões podem produzir diferenças aparentes. Preserve o estilo Canvas 2D/PS1 enquanto corrige identidade, disposição, formas e detalhes. Não invente texto ilegível, partes escondidas, medidas exatas ou material que a imagem não permita distinguir.

## 3. Corrigir a representação com base nas evidências

- Localize o dado responsável: catálogo da rua para cores, aberturas e posições; módulos de fachadas para grades, materiais e detalhes; módulos de chão para calçadas e praças; dados de objetos para postes, carros e vegetação; módulo próprio para monumentos.
- Reutilize `building-geometry.js` e as plantas compartilhadas para manter paredes, telhados e colisões coerentes. Ao mover ou redimensionar um objeto, atualize também obstáculos, sombra e pontos de luz afetados, quando aplicável.
- Preserve IDs e as associações `street`, `point`, `photoDirection` e `refs`. Corrija uma associação equivocada somente com evidência da própria rua selecionada.
- Evite mudanças globais em estilos ou dimensões para corrigir uma fachada específica. Prefira parâmetros ou detalhes por objeto. Em módulos compartilhados, restrinja a nova regra aos elementos comprovadamente afetados.
- Para um volume compartilhado de esquina, ajuste somente o que as fotos selecionadas comprovam e preserve contratos e conexões existentes. Se a correção depender de examinar a outra rua, registre a pendência e continue os demais pontos; não ultrapasse o limite de uma rua.
- Use ferramentas de montagem para comparar fotos e jogo; não use imagens geradas como evidência do lugar real. A aparência deve resultar dos dados e desenhos do motor existente.
- Preserve horário do servidor, regras de luz, câmeras e controles. Para distinguir pintura de iluminação, use inspeção controlada do cenário; não altere o relógio do sistema nem deixe horário forçado ou controles temporários na entrega.

Corrija as diferenças comprovadas ao longo da revisão e reconfira os pontos que compartilham cada objeto alterado. Um problema encontrado na última foto também precisa ser corrigido e verificado antes de encerrar.

## 4. Verificar sem ampliar o escopo

Depois das correções, volte aos locais alterados e compare novamente com as fotos da rua escolhida. Confira fachadas e detalhes nas quatro câmeras e use a vista aérea para posições, alinhamento e limites. Verifique que a profundidade não esconde elementos que deveriam aparecer nem desenha detalhes sobre o telhado ou prédio vizinho.

Teste a passagem no trecho afetado, os obstáculos, o clique e a associação das fotos por E quando alguma geometria ou referência mudar. Execute testes pertinentes de código e geometria. Se um teste existente abrir fotos ou manifestos de outras ruas, não o execute nesta revisão: selecione casos isolados ou acrescente uma verificação focada na rua escolhida. Não realize uma auditoria visual de outras ruas como suposta validação de regressão. Registre a cobertura de testes efetivamente executada.

Mudanças apenas de cor ou decoração não exigem testes que repitam a implementação; exigem comparação visual. Mudanças de geometria ou navegação podem exigir regressões de comportamento. Atualize o levantamento da rua e documentação técnica somente quando houver informação ou contrato alterado.

## Critério de conclusão e entrega

A revisão completa exige todos os pontos do manifesto e suas oito fotos examinados, as diferenças comprovadas corrigidas e a nova aparência conferida no jogo. A tabela de cobertura deve permitir distinguir pontos concluídos de limitações reais; não declare revisão completa se ainda houver pontos não examinados.

Na resposta final, informe a **única rua revisada**, quantidade de pontos/fotos examinados, principais correções, verificações realizadas e eventuais detalhes inconclusivos. Inclua o caminho do registro da revisão. Não anuncie nem inicie revisão de outra rua nesta execução.
