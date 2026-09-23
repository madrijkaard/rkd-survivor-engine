# Guia da IA — maps

## Papel deste diretório

`maps/` guarda as fotografias originais de referência e os manifestos geográficos lidos pelo jogo. Este guia complementa o [AGENTS da raiz](../AGENTS.md). Os caminhos da árvore abaixo partem de `maps/`; comandos devem ser executados na raiz do projeto.

As imagens são capturas direcionais de panoramas do Google Street View. Oito fotos do mesmo ponto cobrem o entorno em ordem circular; não são oito casas, nem uma textura panorâmica única já costurada. Montagens de comparação ficam em `reference/`, separadas dos originais.

## Diretórios e arquivos

```text
maps/
├── AGENTS.md
├── simeao-de-macedo/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-17/
│       └── 1.jpg ... 8.jpg
├── conego-mendonca/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-15/
│       └── 1.jpg ... 8.jpg
└── antonio-alexandre/
    ├── manifest.json
    └── ponto-01/ ... ponto-20/
        └── 1.jpg ... 8.jpg
```

| Caminho | Conteúdo e função |
| --- | --- |
| `AGENTS.md` | Explica o contrato das capturas, a associação com o cenário e os cuidados de manutenção. |
| `simeao-de-macedo/manifest.json` | Registro dos 17 panoramas da Rua Simeão de Macedo, da Praça do Cinema em direção à Cônego Mendonça. As coordenadas foram recuperadas para os conjuntos já existentes; as posições artísticas originais do jogo foram preservadas. |
| `simeao-de-macedo/ponto-01/` a `ponto-17/` | 136 fotografias da rua original. O antigo `ponto-18` foi retirado e não faz parte do percurso. |
| `conego-mendonca/manifest.json` | Registro dos 15 panoramas da rua transversal, incluindo a continuação ao lado da praça da igreja até a esquina final. É entrada do gerador de `src/mendonca-points.js`. |
| `conego-mendonca/ponto-01/` a `ponto-15/` | 120 fotografias, oito por avanço registrado na Cônego Mendonça. |
| `antonio-alexandre/manifest.json` | Registro dos 20 panoramas da rua paralela à Simeão, da Cônego em direção à Vinte e Oito de Julho. É entrada do gerador de `src/antonio-points.js`. |
| `antonio-alexandre/ponto-01/` a `ponto-20/` | 160 fotografias que mostram a curva, fachadas, escola, vegetação e outro lado do cinema. |

O total atual é **52 pontos e 416 JPEGs**. O número de uma pasta só identifica um ponto dentro de sua rua. Por exemplo, `ponto-01` existe nas três ruas e representa três conjuntos diferentes.

### Função de cada arquivo de imagem

Esta tabela vale para **todas** as pastas `ponto-NN/`:

| Arquivo | Direção | Orientação usada na captura |
| --- | --- | --- |
| `1.jpg` | N — norte | 0° |
| `2.jpg` | NE — nordeste | 45° |
| `3.jpg` | L — leste | 90° |
| `4.jpg` | SE — sudeste | 135° |
| `5.jpg` | S — sul | 180° |
| `6.jpg` | SO — sudoeste | 225° |
| `7.jpg` | O — oeste | 270° |
| `8.jpg` | NO — noroeste | 315° |

Mantenha a ordem **N, NE, L, SE, S, SO, O, NO**, mesmo quando a solicitação de captura listar as direções em outra ordem. `directions` no manifesto, `MAP_DIRECTIONS` em `src/map-manifests.js`, `DIRECTIONS` em `src/world.js` e a numeração dos arquivos precisam concordar.

## Contrato do manifest.json

Formato ilustrativo com **apenas o primeiro ponto** da Simeão; o manifesto real da rua contém todos os 17 registros:

```json
{
  "schemaVersion": 1,
  "city": "Codó",
  "street": "Rua Simeão de Macedo",
  "neighborhood": "Centro",
  "coordinateSystem": "WGS84",
  "directions": ["N", "NE", "L", "SE", "S", "SO", "O", "NO"],
  "points": [
    {
      "id": 1,
      "pano": "3Iri8Dp9wEE04GVstk3_lg",
      "latitude": -4.4524451,
      "longitude": -43.8849529
    }
  ]
}
```

| Campo | Significado e validação |
| --- | --- |
| `schemaVersion` | Versão do formato; atualmente deve ser o número `1`. |
| `city`, `street`, `neighborhood` | Textos obrigatórios e não vazios. O bairro no nível da rua é o padrão para seus pontos. Atualmente todas as ruas são de Codó, bairro Centro, conforme informação do usuário. |
| `coordinateSystem` | Deve ser `WGS84`. As coordenadas são geográficas, não pixels nem unidades do jogo. |
| `directions` | Array com exatamente as oito direções na ordem da tabela. |
| `points` | Array não vazio em ordem de captura, com IDs consecutivos de 1 em diante, sem lacunas. |
| `points[].id` | Número inteiro implícito na sequência; corresponde à pasta `ponto-NN`, com dois dígitos nos pontos atuais. |
| `points[].pano` | Identificador textual do panorama. Não pode ser vazio nem repetido dentro do mesmo manifesto. |
| `points[].latitude`, `longitude` | Números finitos, respectivamente entre -90 e 90 e entre -180 e 180. Não usar strings, coordenadas estimadas de outra casa ou a posição da personagem. |
| `points[].neighborhood` | Texto opcional e não vazio que substitui o bairro padrão **somente naquele ponto**. |
| Metadados de procedência | Os arquivos também registram dados como `imageryDate`, `capturedAt` ou `coordinatesRecoveredAt`. Preserve os campos existentes; o validador principal não os exige. Não confunda data da imagem com data de captura/recuperação. |

Consulte `src/map-manifests.js` antes de alterar o formato. O jogo valida também se a quantidade e os IDs do manifesto correspondem aos pontos já cadastrados na rota. Ele rejeita divergências em vez de inventar posições. Os dados das três ruas só são aplicados depois de todos os manifestos passarem pela validação.

## Como as fotos são encontradas durante o jogo

Em `src/world.js`, cada rota liga seu identificador à pasta e aos pontos com coordenadas artísticas `x/y`:

| Identificador da rota | Pasta em maps | Origem das posições do cenário |
| --- | --- | --- |
| `simeao` | `simeao-de-macedo` | Catálogo original em `src/world.js`, com espaçamento de 140 unidades. |
| `conego-mendonca` | `conego-mendonca` | `src/mendonca-points.js`, gerado a partir do manifesto. |
| `antonio-alexandre` | `antonio-alexandre` | `src/antonio-points.js`, gerado a partir do manifesto com ajuste às junções do cenário. |

`locationAt(x, y)` encontra primeiro a rota cuja linha de percurso está mais próxima e depois o ponto mais próximo **nessa rota**. `imagePath(point, direction, street)` monta o endereço da foto; trata `simeao` como alias da pasta `simeao-de-macedo`. A tecla E usa essa associação para mostrar o conjunto atual. Algumas imagens também são usadas na preparação das texturas das fachadas.

Carregar um manifesto atualiza rua, cidade, bairro, panorama e coordenadas geográficas. Não recalcula `x/y`, edifícios ou colisões. O painel inferior esquerdo não existe mais, mas a associação dos pontos permanece ativa.

### Quando um trecho mudar de bairro

Acrescente `neighborhood` em **cada ponto** pertencente a um bairro diferente do padrão da rua. Não existe herança do bairro do ponto anterior: um ponto sem esse campo volta ao padrão do manifesto. Recarregue o jogo após editar.

O cabeçalho acompanha o bairro do ponto selecionado por proximidade. Isso não equivale a uma divisa oficial desenhada como polígono. Não crie bairros ou limites sem informação de referência.

## Captura e integração de novos pontos

O capturador está em `reference/scripts/capture/`; os argumentos devem vir de um panorama realmente observado. Exemplo a partir da raiz, substituindo os parâmetros:

```sh
node --use-system-ca reference/scripts/capture/capture-street.mjs pasta-da-rua "Nome da rua" "Nome do bairro" PANORAMA LATITUDE LONGITUDE
```

As variantes `capture-simeao.mjs`, `capture-mendonca.mjs` e `capture-antonio.mjs` recebem `PANORAMA LATITUDE LONGITUDE [BAIRRO]`. Sem o bairro opcional, usam o padrão do manifesto existente. A opção de certificados `--use-system-ca` depende da versão do Node usada na captura; não é requisito para executar o jogo.

O capturador busca oito imagens do mesmo panorama, valida as respostas, grava `1.jpg` a `8.jpg` e então salva o manifesto. Repetir o mesmo panorama mantém seu ID e substitui as oito imagens; um panorama novo acrescenta o próximo ID. Consulte [reference/AGENTS.md](../reference/AGENTS.md) para entradas e saídas de cada ferramenta.

Depois de adicionar ou corrigir capturas:

1. Confira as oito direções e a correspondência entre panorama, coordenadas e pasta. Preserve os originais; salve montagens em `reference/streets/<rua>/comparacoes/`.
2. Atualize o levantamento da rua com o que foi observado, distinguindo observação e inferência.
3. Se houver novos pontos ou mudança da geometria, atualize os geradores/catálogos, descrições, rotas, desenho e colisões correspondentes. Uma pasta nova em `maps/` não cria uma rua navegável sozinha.
4. Confira junções e construções compartilhadas antes de considerar uma extensão integrada. Não gere uma casa por panorama: conte as fachadas observando vários pontos.
5. Execute `node --test tests/manifests.test.mjs` e os testes da rua afetada; confira E e o bairro no navegador quando a integração mudar.

Não renumere conjuntos existentes sem ajustar todos os consumidores (`point`, `refs`, catálogos, manifestos, testes e montagens). Uma mudança só de bairro não exige renumerar fotos nem regenerar a geometria.
