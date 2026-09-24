---
name: expandir-ate-a-proxima-esquina
description: Mapear uma rua de uma esquina até a próxima e integrar o trecho ao cenário navegável do jogo Codó Sobrevive. Use para expandir ruas já cadastradas em maps ou adicionar ruas novas, com oito fotos por ponto, geolocalização, manifesto e reconstrução visual baseada em todas as imagens.
---

# Expandir até a próxima esquina

Entregue o trecho completo: fotografias originais, metadados geográficos, levantamento visual e cenário navegável. Por padrão, a solicitação inclui captura e renderização; respeite uma restrição explícita do usuário a apenas uma dessas etapas.

Todos os caminhos e comandos abaixo partem da raiz do projeto. Leia `AGENTS.md` e os guias de `maps/`, `reference/`, `src/` e `tests/` antes de alterar suas respectivas áreas. Esses arquivos e a implementação atual são a referência dos contratos; não fixe na skill quantidades de pontos ou nomes de ruas como limites permanentes.

## 1. Identificar a rua, a esquina inicial e o sentido

- Consulte os manifestos em `maps/*/manifest.json`, as rotas em `src/world.js` e o levantamento em `reference/streets/<pasta>/levantamento.md`. Identifique o que já foi capturado e desenhado.
- Para uma rua existente, reutilize sua pasta, manifesto e identificador de rota. O identificador pode diferir da pasta: `simeao` corresponde a `simeao-de-macedo`. Preserve pontos, fotos, IDs de construções e posições artísticas existentes.
- Para uma rua nova, escolha uma pasta em minúsculas, sem acentos e com hífens, seguindo as vizinhas. Crie seu próprio manifesto e inicie a numeração em `ponto-01`. Confirme cidade, nome da rua e bairro em referências disponíveis, sem inventá-los.
- Localize a esquina inicial no mapa e no Street View. Use os panoramas e coordenadas já registrados para retomar o trecho correto. Determine o sentido que continua pela rua solicitada, sem virar acidentalmente na transversal.
- Se rua, esquina ou sentido permanecerem ambíguos após consultar o projeto e o mapa, peça apenas essa informação. Não escolha silenciosamente entre dois quarteirões possíveis.
- Identifique a próxima interseção no sentido de avanço e confirme-a pelo mapa e pelas imagens. Um portão, entrada de garagem ou mudança de fachada não é uma esquina. Registre o nome da transversal quando verificável.

## 2. Avançar e capturar oito fotos a cada ponto

Use as ferramentas de navegador disponíveis para navegar no Street View. O capturador do projeto baixa fotografias, mas **não descobre panoramas nem navega até a próxima esquina**.

1. Na posição inicial, confira se o panorama já pertence ao manifesto. Reutilize um conjunto completo existente; capture-o se for uma posição nova necessária ao trecho.
2. Avance um passo de navegação por vez, até o próximo panorama disponível ao longo da rua. Confirme a nova posição antes de continuar. Não pule panoramas intermediários para reduzir o levantamento.
3. Em cada posição nova, obtenha o ID do panorama e a latitude/longitude efetivas daquele panorama. Use dados do Street View observado; o centro da câmera do mapa ou a coordenada de uma busca podem ser diferentes. Registre a fonte e a data das imagens quando disponíveis.
4. Capture as oito direções desse mesmo panorama e confirme a gravação antes de avançar novamente.
5. Repita até a próxima esquina, incluindo o panorama que documente a interseção e suas fachadas. Não continue pelo quarteirão seguinte. Se não houver panorama exatamente no cruzamento, documente o último disponível e a limitação da cobertura.

Reutilize o capturador genérico, substituindo os argumentos por dados observados:

```sh
node --use-system-ca reference/scripts/capture/capture-street.mjs pasta-da-rua "Nome da rua" "Nome do bairro" PANORAMA LATITUDE LONGITUDE
```

Os atalhos `capture-simeao.mjs`, `capture-mendonca.mjs` e `capture-antonio.mjs`, no mesmo diretório, recebem `PANORAMA LATITUDE LONGITUDE [BAIRRO]`. A opção `--use-system-ca` depende da versão do Node utilizada para captura; não desative a validação TLS em caso de erro de certificado.

O resultado de cada ponto deve seguir este contrato:

```text
maps/<pasta-da-rua>/
├── manifest.json
└── ponto-NN/
    ├── 1.jpg  N   0°
    ├── 2.jpg  NE  45°
    ├── 3.jpg  L   90°
    ├── 4.jpg  SE  135°
    ├── 5.jpg  S   180°
    ├── 6.jpg  SO  225°
    ├── 7.jpg  O   270°
    └── 8.jpg  NO  315°
```

Essas direções são geográficas, independentemente do sentido da caminhada. O padrão atual usa JPEGs de 900 × 600, inclinação zero e numeração `String(id).padStart(2, '0')`.

Um panorama novo recebe o próximo ID livre da sequência do manifesto. Repetir um panorama existente mantém seu ID e **sobrescreve suas fotos**: não recapture conjuntos válidos sem necessidade. Se a expansão ocorrer no sentido oposto à numeração existente, preserve os IDs e adapte a ordenação geométrica do percurso separadamente; não renumere o acervo para facilitar o desenho.

Confira imagens decodificáveis, dimensões, oito direções e ausência de respostas vazias ou duplicações indevidas. O script baixa as oito antes de gravar, mas uma interrupção na escrita pode deixar uma pasta incompleta: reconcilie a pasta com o manifesto antes de retomar. Se a cobertura ou o acesso impedir uma captura real, registre o ponto de interrupção; não preencha lacunas com fotos de outro lugar nem com imagens geradas.

## 3. Manter o manifesto como vínculo entre trajeto e fotos

Siga o esquema validado por `src/map-manifests.js` e documentado em `maps/AGENTS.md`:

- Na raiz: `schemaVersion: 1`, `city`, `street`, `neighborhood`, `coordinateSystem: "WGS84"`, `directions` na ordem acima e `points`.
- Em cada ponto: `id`, `pano`, `latitude` e `longitude` numéricos reais; `neighborhood` opcional quando o ponto estiver em bairro diferente do padrão. Essa substituição vale apenas para aquele ponto.
- IDs consecutivos a partir de 1, sem lacunas, e panoramas únicos dentro da rua. O vínculo é **pasta da rua + ID do ponto + número da direção**; o ID identifica `ponto-NN`, e a direção identifica `1.jpg` a `8.jpg`.
- Preserve metadados antigos. Diferencie a data das imagens (`imageryDate`) da data de captura (`capturedAt`) ou recuperação de coordenadas. Datas desconhecidas não devem ser inventadas.
- Documente a nova extensão seguindo o padrão de `extensions` existente: intervalo de pontos, ruas de início/fim, procedência, data e URL de referência. Não atribua a data de uma nova captura a todo o acervo histórico.

As coordenadas WGS84 documentam a posição real. Os valores artísticos `x/y` definem a posição no jogo. Não substitua um sistema pelo outro nem altere GPS para corrigir alinhamento visual.

## 4. Examinar todas as imagens e levantar as fachadas

**Abra e examine as oito fotos de cada ponto novo antes de modelar seu entorno.** Gere pranchas com número e direção em `reference/streets/<pasta>/comparacoes/`, reutilizando ou adaptando os scripts de `reference/scripts/generate/`. Confira os originais em resolução suficiente quando um detalhe não estiver legível na prancha. Examine também pontos antigos adjacentes à junção.

Registre em `reference/streets/<pasta>/levantamento.md`:

- A sequência de lotes dos dois lados, relacionando cada construção às fotos que a mostram. Uma casa aparece em vários pontos; um ponto pode mostrar várias casas.
- Cores, faixas de pintura, revestimentos, formatos e proporções, alturas relativas, recuos, telhados, platibandas, portas, janelas, portões, grades, pilares, muros e letreiros legíveis.
- Calçadas, meio-fio, largura e curvas da rua, terrenos, árvores, postes, fios e outros detalhes relevantes observados.
- Faces de esquina vistas de ruas diferentes e quais volumes são compartilhados com o cenário existente.
- O que é observação fotográfica, informação do usuário ou inferência para uma parte oculta. Não apresente medidas ou detalhes não visíveis como fatos.

Cruze vistas frontais, diagonais e de retorno para resolver oclusões e limites dos lotes. Não limite o levantamento às fotos leste/oeste nem replique casas genéricas para preencher o quarteirão. Preserve a identidade visual de cada fachada dentro da linguagem artística PS1 do projeto.

O motor Canvas 2D não interpreta as fotos automaticamente: a análise precisa ser traduzida em catálogo, geometria, cores e desenho. Apenas salvar imagens ou usá-las como textura não conclui a reconstrução.

## 5. Integrar o trecho ao cenário navegável

Use os módulos existentes como referência de arquitetura, sem copiar suas dimensões ou fachadas para outra rua:

| Parte | Ação necessária |
| --- | --- |
| Pontos e traçado | Atualize o gerador da rua, ou crie um equivalente em `reference/scripts/generate/`, produzindo `src/<rua>-points.js`. Converta distâncias e direção geográficas ao referencial artístico, respeitando curvas, escala local e junções. Preserve posições antigas; revise o gerador antes de executá-lo, pois ele sobrescreve saídas. |
| Catálogo e fachadas | Atualize/crie módulos de dados e desenho, como `simeao-extension.js`, `simeao-facades.js` ou os módulos da Antônio. Associe `street`, `point`, `photoDirection` e `refs` conforme os contratos atuais. Modele os detalhes levantados e mantenha IDs estáveis. |
| Mundo e localização | Integre pontos e objetos em `src/world.js`. Para rua nova, registre uma rota com identificador, pasta, nome e pontos, compatível com `loadMapManifests`. Confira `locationAt`, `imagePath` e o desempate nas interseções para que E mostre a rua e o ponto corretos. |
| Chão e navegação | Estenda rua, calçadas, áreas transitáveis, obstáculos e limites do mundo. Desenho, telhados e colisões devem compartilhar a mesma planta, inclusive em curvas. Preserve passagem nas esquinas e o retorno ao trecho antigo. |
| Renderização | Integre os módulos em `render.js`, `architecture.js` e `facades.js` conforme necessário. Confira enquadramento, recorte dos sprites, profundidade, fios e pré-renderização nas quatro câmeras. Evite aumentar desnecessariamente a memória dos canvases. |
| Interface | Atualize minimapa, vista aérea, rótulos, descrições e limites de chegada afetados. Remova pressupostos de quantidade fixa de ruas/pontos onde impedirem a expansão. |
| Iluminação | Inclua objetos nos sistemas existentes de sombra e luz. Preserve o horário do servidor e as regras vigentes de postes e janelas; classifique corretamente residências, comércio, muros e prédios públicos. |

Uma construção de esquina deve ser um único volume com suas faces relacionadas, mesmo quando fotografada por duas ruas. Não duplique edifícios, postes ou obstáculos já cadastrados. Renderize a interseção final o suficiente para representar suas conexões, sem declarar a rua transversal inteira como mapeada.

## 6. Conferir e entregar

1. Valide manifestos, quantidade de pontos por rota, oito JPEGs por ponto, coordenadas e todas as referências fotográficas. Atualize testes com contagens afetadas pela expansão sem enfraquecer suas verificações.
2. Acrescente testes de comportamento quando necessário: continuidade até a esquina e retorno, colisões, lotes fora da rua, associação de fotos nas junções e preservação do trecho anterior. Execute os testes pertinentes e `npm test` para a integração.
3. Abra o jogo pelo servidor HTTP. Percorra o novo trecho e volte; confira caminhada, clique e minimapa. Use E no início, no meio, no fim e nas junções.
4. Inspecione **todo o trecho nas quatro câmeras Q e na vista aérea M**, comparando as fachadas com as oito fotos de seus pontos. Corrija cores, formatos, aberturas, telhados, oclusões e detalhes divergentes; testes Node não verificam fidelidade visual.
5. Confira sombras, postes e janelas nos novos objetos. Para inspeção diurna/noturna, use verificações controladas sem alterar o relógio do sistema nem deixar horário forçado no jogo. Remova arquivos temporários de teste.
6. Atualize documentação, levantamento e totais do acervo onde forem mencionados. Informe a esquina alcançada, intervalo de pontos, quantidade de fotos adicionadas, integração realizada e verificações executadas. Declare limitações reais de cobertura ou partes inferidas.

Conclua apenas quando o trecho capturado estiver também renderizado, conectado e verificado, salvo escopo menor explicitamente pedido pelo usuário ou bloqueio concreto informado na entrega.
