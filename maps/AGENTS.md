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
│   └── ponto-01/ ... ponto-31/
│       └── 1.jpg ... 8.jpg
├── conego-mendonca/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-37/
│       └── 1.jpg ... 8.jpg
├── antonio-alexandre/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-34/
│       └── 1.jpg ... 8.jpg
├── vinte-e-oito-de-julho/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-29/
│       └── 1.jpg ... 8.jpg
├── fernando-carvalho/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-17/
│       └── 1.jpg ... 8.jpg
├── coelho-neto/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-22/
│       └── 1.jpg ... 8.jpg
├── sao-benedito/
│   ├── manifest.json
│   └── ponto-01/ ... ponto-14/
│       └── 1.jpg ... 8.jpg
└── praca-alcebiades-silva/
    ├── manifest.json
    └── ponto-01/ ... ponto-15/
        └── 1.jpg ... 8.jpg
```

| Caminho | Conteúdo e função |
| --- | --- |
| `AGENTS.md` | Explica o contrato das capturas, a associação com o cenário e os cuidados de manutenção. |
| `simeao-de-macedo/manifest.json` | Registro dos 31 panoramas da Rua Simeão de Macedo, da Praça do Cinema, passando pela Cônego Mendonça, até a Henrique Figueiredo. As coordenadas foram recuperadas para os conjuntos já existentes; as posições artísticas originais do jogo foram preservadas. |
| `simeao-de-macedo/ponto-01/` a `ponto-31/` | 248 fotografias. Pontos 1–17 preservados; 18–31 capturados em setembro de 2026 para a extensão. A numeração 18 agora identifica uma captura nova, não o conjunto antigo retirado. |
| `conego-mendonca/manifest.json` | Registro dos 37 panoramas: IDs 1–15 originais, 16–22 até a Fernando, 23–31 até a Praça Alcebíades Silva e 32–37 até a Avenida São Benedito. É entrada do gerador de `src/mendonca-points.js`. |
| `conego-mendonca/ponto-01/` a `ponto-37/` | 296 fotografias, oito por avanço registrado na Cônego Mendonça. |
| `antonio-alexandre/manifest.json` | Registro dos 34 panoramas da Antônio Alexandre: pontos 1–20 da Cônego à Vinte e Oito de Julho e 21–34 da Cônego, ao lado da Matriz, até a Henrique Figueiredo. É entrada do gerador de `src/antonio-points.js`. |
| `antonio-alexandre/ponto-01/` a `ponto-34/` | 272 fotografias que mostram a curva, escola, cinema e extensão junto à Matriz até a Henrique Figueiredo. |
| `vinte-e-oito-de-julho/manifest.json` | 29 panoramas: 1–9 da Praça do Cinema até Fernando, 10–18 no retorno da Praça Alcebíades Silva e 19–29 da Antônio Alexandre à Coelho Neto. Imagens de junho de 2025; datas de captura individuais preservadas. |
| `vinte-e-oito-de-julho/ponto-01/` a `ponto-29/` | 232 fotos; pontos 10 e 19 reutilizam esquinas adjacentes com procedência registrada. |
| `fernando-carvalho/manifest.json` | 17 panoramas da Vinte e Oito à Cônego Mendonça, no sentido norte. |
| `fernando-carvalho/ponto-01/` a `ponto-17/` | 136 fotos: oito reutilizadas da esquina inicial e 128 novas capturas. |

O total atual é **199 pontos e 1592 JPEGs**. O número de uma pasta só identifica um ponto dentro de sua rua. Por exemplo, `ponto-01` existe nas oito vias e identifica oito conjuntos próprios, com reutilizações documentadas nas junções.

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

Formato ilustrativo com **apenas o primeiro ponto** da Simeão; o manifesto real da rua contém todos os 31 registros:

```json
{
  "schemaVersion": 1,
  "city": "Codó",
  "street": "Rua Simeão de Macedo",
  "roadType": "rua",
  "sidewalkType": "calcada-de-rua",
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
| `sidewalkType` | Obrigatório: `calcada-de-rua` ou `calcada-de-avenida`, coerente com `roadType`. Aplica-se aos passeios dos dois lados de todos os trechos desta rota: respectivamente duas ou quatro pessoas lado a lado. Pessoas usam 20 unidades de referência; cada passeio tem 40 ou 80 unidades. Praças e recuos dos lotes são áreas adicionais, fora desta largura. |
| `roadType` | Obrigatório: `rua` ou `avenida`. Controla a largura artística da pista, respectivamente quatro ou cinco carros lado a lado. Sete rotas são `rua`; a São Benedito é `avenida`, conforme os nomes registrados no mapeamento. Não inferir pela largura aparente. |
| `coordinateSystem` | Deve ser `WGS84`. As coordenadas são geográficas, não pixels nem unidades do jogo. |
| `directions` | Array com exatamente as oito direções na ordem da tabela. |
| `points` | Array não vazio em ordem de captura, com IDs consecutivos de 1 em diante, sem lacunas. |
| `points[].id` | Número inteiro implícito na sequência; corresponde à pasta `ponto-NN`, com dois dígitos nos pontos atuais. |
| `points[].pano` | Identificador textual do panorama. Não pode ser vazio nem repetido dentro do mesmo manifesto. |
| `points[].latitude`, `longitude` | Números finitos, respectivamente entre -90 e 90 e entre -180 e 180. Não usar strings, coordenadas estimadas de outra casa ou a posição da personagem. |
| `points[].neighborhood` | Texto opcional e não vazio que substitui o bairro padrão **somente naquele ponto**. |
| Metadados de procedência | Os arquivos também registram dados como `imageryDate`, `capturedAt` ou `coordinatesRecoveredAt`. Preserve os campos existentes; o validador principal não os exige. Não confunda data da imagem com data de captura/recuperação. `extensions` documenta o intervalo 18–31, ruas de início/fim, data e fonte da nova captura. |

Consulte `src/map-manifests.js` antes de alterar o formato. O jogo valida também se a quantidade e os IDs do manifesto correspondem aos pontos já cadastrados na rota. Ele rejeita divergências em vez de inventar posições. Os dados das oito vias só são aplicados depois de todos os manifestos passarem pela validação.

## Como as fotos são encontradas durante o jogo

Em `src/world.js`, cada rota liga seu identificador à pasta e aos pontos com coordenadas artísticas `x/y`:

| Identificador da rota | Pasta em maps | Origem das posições do cenário |
| --- | --- | --- |
| `simeao` | `simeao-de-macedo` | `src/simeao-points.js`, gerado do manifesto: preserva 140 unidades nos pontos 1–17 e acumula distâncias geográficas × 14 nos pontos 18–31. |
| `conego-mendonca` | `conego-mendonca` | `src/mendonca-points.js`, gerado a partir do manifesto. |
| `antonio-alexandre` | `antonio-alexandre` | `src/antonio-points.js`, gerado a partir do manifesto com ajuste às junções do cenário. |
| `vinte-e-oito-de-julho` | `vinte-e-oito-de-julho` | `src/julho-points.js`, gerado do manifesto e alinhado à Praça do Cinema. |
| `fernando-carvalho` | `fernando-carvalho` | `src/fernando-points.js`, gerado do manifesto e alinhado às duas esquinas. |

`locationAt(x, y)` encontra primeiro a rota cuja linha de percurso está mais próxima e depois o ponto mais próximo **nessa rota**. `imagePath(point, direction, street)` monta o endereço da foto; trata `simeao` como alias da pasta `simeao-de-macedo`. A tecla E usa essa associação para mostrar o conjunto atual. Algumas imagens também são usadas na preparação das texturas das fachadas.

Carregar um manifesto atualiza rua, cidade, bairro, panorama e coordenadas geográficas. Não recalcula os pontos `x/y`. O tipo de via é lido antes da montagem da geometria por `road-profiles.js`; recarregar o jogo aplica sua largura. O painel inferior esquerdo não existe mais, mas a associação dos pontos permanece ativa.

A extensão da Antônio preserva os pontos 1–20 e acrescenta 21–34. Do cruzamento da Cônego até a Henrique, a ordem espacial é **1, 21, 34, 22, 24, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33**. A ordem do manifesto continua sendo a dos IDs. `extensions[].routePointOrder` registra o percurso e `endPoint: 33` identifica a esquina; não use o último registro como limite geométrico. Data de junho de 2025 das imagens e data de captura dos novos pontos ficam separadas, sem substituir a procedência do acervo antigo.

### Quando um trecho mudar de bairro

Acrescente `neighborhood` em **cada ponto** pertencente a um bairro diferente do padrão da rua. Não existe herança do bairro do ponto anterior: um ponto sem esse campo volta ao padrão do manifesto. Recarregue o jogo após editar.

O cabeçalho acompanha o bairro do ponto selecionado por proximidade. Isso não equivale a uma divisa oficial desenhada como polígono. Não crie bairros ou limites sem informação de referência.

## Captura e integração de novos pontos

O capturador está em `reference/scripts/capture/`; os argumentos devem vir de um panorama realmente observado. Exemplo a partir da raiz, substituindo os parâmetros:

```sh
node --use-system-ca reference/scripts/capture/capture-street.mjs pasta-da-rua "Nome da rua" "Nome do bairro" PANORAMA LATITUDE LONGITUDE
```

As variantes `capture-simeao.mjs`, `capture-mendonca.mjs` e `capture-antonio.mjs` recebem `PANORAMA LATITUDE LONGITUDE [BAIRRO]`. Sem o bairro opcional, usam o padrão do manifesto existente. A opção de certificados `--use-system-ca` depende da versão do Node usada na captura; não é requisito para executar o jogo.

Para vias novas, o capturador grava `sidewalkType` correspondente e `roadType` a partir do prefixo explícito Rua/R. ou Avenida/Av. no nome informado. Também aceita `rua` ou `avenida` como último argumento opcional. Nomes sem prefixo exigem esse argumento; nunca se presume o tipo pela aparência. Em vias existentes, preserva o tipo registrado e rejeita um argumento divergente.

O capturador busca oito imagens do mesmo panorama, valida as respostas, grava `1.jpg` a `8.jpg` e então salva o manifesto. Repetir o mesmo panorama mantém seu ID e substitui as oito imagens; um panorama novo acrescenta o próximo ID. Consulte [reference/AGENTS.md](../reference/AGENTS.md) para entradas e saídas de cada ferramenta.

Depois de adicionar ou corrigir capturas:

1. Confira as oito direções e a correspondência entre panorama, coordenadas e pasta. Preserve os originais; salve montagens em `reference/streets/<rua>/comparacoes/`.
2. Atualize o levantamento da rua com o que foi observado, distinguindo observação e inferência.
3. Se houver novos pontos ou mudança da geometria, atualize os geradores/catálogos, descrições, rotas, desenho e colisões correspondentes. Uma pasta nova em `maps/` não cria uma rua navegável sozinha.
4. Confira junções e construções compartilhadas antes de considerar uma extensão integrada. Não gere uma casa por panorama: conte as fachadas observando vários pontos.
5. Execute `node --test tests/manifests.test.mjs` e os testes da rua afetada; confira E e o bairro no navegador quando a integração mudar.

Não renumere conjuntos existentes sem ajustar todos os consumidores (`point`, `refs`, catálogos, manifestos, testes e montagens). Uma mudança só de bairro não exige renumerar fotos nem regenerar a geometria.

## Fernando Carvalho

`fernando-carvalho/manifest.json` e `ponto-01/` até `ponto-17/` guardam 136 fotos. O ponto 1 reutiliza as oito fotos da Vinte e Oito/ponto-09; 2–17 são 128 imagens novas de junho de 2025, capturadas em 10/10/2026. A numeração é independente. A rota vai da Vinte e Oito à Cônego Mendonça. O acervo total tem 199 conjuntos e 1592 arquivos JPEG; oito arquivos desta rua repetem deliberadamente a esquina compartilhada.

## Cônego até Fernando — 11/10/2026

Os pontos 16–22 acrescentam 56 JPEGs de 900×600, oito direções em cada panorama de junho de 2025. A ordem de captura é 1→16→17→18→19→20→21→22, indo da Simeão para oeste até a Fernando. `extensions.routePointOrder` documenta essa sequência sem renumerar 1–15. `capturedAt`, `imageryDate` e `sourceUrl` dos pontos novos identificam a captura; o `capturedAt` original da raiz continua histórico. O panorama final documenta a esquina pelo braço leste e é diferente do ponto 17 da Fernando.

## Cônego: Fernando até Praça Alcebíades Silva — 11/10/2026

A sequência 22→23→…→31 cruza a Fernando e termina na esquina da Metalmar. São 72 arquivos adicionais: ponto 23 reutiliza byte a byte a Fernando/17; pontos 24–31 têm 64 capturas novas, todas de junho de 2025. O acervo tem 37 pontos/296 fotos na Cônego e 199 pontos/1592 fotos no total. O metadado `reusedFrom` diferencia a reutilização da captura; `sourceUrl` em cada novo ponto e `extensions` documentam a origem. Naquela etapa, somente a interseção da praça foi fotografada; a rota própria foi acrescentada nas etapas abaixo.

## Praça Alcebíades Silva — Cônego até Vinte e Oito de Julho

`praca-alcebiades-silva/manifest.json` e `ponto-01/` até `ponto-15/` guardam 120 arquivos de junho de 2025. O ponto 1 reutiliza a Cônego/31; 2–10 são 72 fotos novas da primeira etapa e 11–15 são 40 novas da continuação reta após a Travessa Z. Cardoso. Ambas foram capturadas em 11/10/2026, com coordenadas observadas de cada panorama, oito direções completas antes de cada avanço e duas entradas em `extensions`. A pasta e o ID da rota são `praca-alcebiades-silva`.

`src/alcebiades-points.js` mantém GPS e preserva exatamente x/y dos pontos 1–10. O ponto 10 continua em y=1002.5 (Cardoso); o ponto 15, em y=-95, alinha a boca da Vinte e Oito ao nível artístico dessa rua. As duas conexões laterais até Fernando continuam sem mapeamento intermediário. `roadType: rua` e `sidewalkType: calcada-de-rua` definem a via; os jardins são área adicional. Na Cônego a junção exata continua selecionando Cônego/31; ao entrar, E acompanha os pontos da praça. O ponto 15 encerra o percurso na Crefisa/centro odontológico, antes de continuar pela Sete de Setembro.

## Vinte e Oito — retorno Alcebíades → Fernando

Em 11/10/2026 foram acrescentados os pontos 10–18: 72 arquivos, sendo oito copiados integralmente de Alcebíades/15 e 64 capturas novas. Naquela etapa, as dezoito pastas totalizavam 144 fotos. A ordem de captura é 10→…→18, terminando na boca oeste da Fernando; o ponto 9 anterior mostra a face oposta e completa a conexão. A ordem espacial do cenário é 1→…→9→18→…→10. GPS, IDs, posições e fotos anteriores permanecem preservados; `extensions`, `sourceUrl`, `imageryDate` e `reusedFrom` distinguem as etapas. O total de 1592 JPEGs contabiliza as reutilizações documentadas.

## Vinte e Oito: Antônio Alexandre até Coelho Neto — 12/10/2026

Os pontos 19–29 têm 88 JPEGs em oito direções, de junho de 2025. O ponto 19 reutiliza byte a byte Antônio Alexandre/20; 20–29 têm 80 fotos novas. A ordem espacial é 19,20,21,22,23,24,25,26,28,27,29, registrada em `extensions`: 28 foi recuperado após HTTP 503 entre 26 e 27. O ponto 29 está no eixo da Coelho Neto e encerra a captura; o mapa e o Street View confirmam a transversal. IDs/GPS anteriores foram preservados. O acervo passa a 199 pontos e 1592 JPEGs.


## Rua Coelho Neto

A Coelho Neto possui 22 pontos (176 arquivos): oito fotos reutilizadas de Julho/29 e 168 novas. O percurso vai da Vinte e Oito de Julho à Cônego Mendonça, no sentido da Igreja Matriz. Os pontos antigos permanecem fixos. O panorama 22 documenta a interseção, sem capturas no quarteirão seguinte. `maps/coelho-neto/manifest.json` registra procedência, datas e ordem 1–22; `ponto-01/` a `ponto-22/` contêm as oito direções. A rota/folder é `coelho-neto`, com perfil `rua`/`calcada-de-rua`. As posições vêm de `src/coelho-points.js`; o alinhamento artístico não altera WGS84.

## Cônego: Praça Alcebíades Silva → Avenida São Benedito — 12/10/2026

Pontos 32–37: seis panoramas de junho de 2025, 48 JPEGs novos de 900×600, capturados um avanço por vez com gravação e decodificação das oito direções antes do avanço seguinte. IDs, fotos e GPS 1–31 preservados. O ponto 37 documenta a interseção pelo braço oeste; não se avançou pelo próximo quarteirão. A extensão registra ordem 31→32→33→34→35→36→37 e URLs individuais. O acervo tem 199 pontos/1592 JPEGs, sendo 37/296 na Cônego.

`intersections[]` registra `id: sao-benedito`, `street: Avenida São Benedito`, `roadType: avenida`, `sidewalkType: calcada-de-avenida`, `point: 37` e `coverage: intersection-only`. É metadado daquela captura da interseção. A expansão sul agora tem rota e pasta próprias em `sao-benedito/`; seu manifesto alimenta `BENEDITO_PROFILE`. O perfil da Cônego permanece rua.


## Avenida São Benedito — sentido sul

A oitava rota percorre o lado oeste da Praça Alcebíades Silva, da Cônego Mendonça à Vinte e Oito de Julho, junto ao Banco do Brasil. São 14 pontos e 112 arquivos: oito reutilizados de Cônego/37 e 104 fotos novas. O acervo soma 199 pontos e 1592 JPEGs. O acesso intermediário ao terreno anunciado à venda não foi tratado como rua.
`sao-benedito/manifest.json` e `ponto-01/` a `ponto-14/` seguem o contrato comum; perfil `avenida` / `calcada-de-avenida`. A rota é `sao-benedito`. `extensions` registra a esquina final, o sentido, a reutilização inicial e a observação do terreno. A cobertura `intersection-only` na extensão histórica da Cônego descreve aquela captura; o mapeamento sul pertence ao novo manifesto.
