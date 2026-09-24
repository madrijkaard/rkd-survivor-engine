# Guia da IA — reference

## Finalidade

Este diretório preserva o processo de construção do cenário: ferramentas de captura e geração, observações das ruas, montagens de fotografias e registros visuais do jogo. Complementa o [AGENTS da raiz](../AGENTS.md); o [README local](README.md) oferece uma versão resumida da organização e dos comandos.

O jogo carrega código de `src/` e dados de `maps/`, sem importar arquivos desta pasta em sua execução. Mesmo assim, `reference/` é útil para reproduzir capturas, regenerar posições e compreender decisões visuais. As imagens originais ficam em `maps/`; aqui ficam materiais derivados e de pesquisa.

## Organização e função dos diretórios

```text
reference/
├── AGENTS.md
├── README.md
├── scripts/
│   ├── capture/
│   │   ├── capture-street.mjs
│   │   ├── capture-simeao.mjs
│   │   ├── capture-mendonca.mjs
│   │   └── capture-antonio.mjs
│   └── generate/
│       ├── generate-simeao-points.mjs
│       ├── simeao-contact.py
│       ├── generate-mendonca-points.mjs
│       ├── generate-antonio-points.mjs
│       ├── mendonca-contact.py
│       └── antonio-contact.py
├── streets/
│   ├── simeao-de-macedo/
│   │   ├── levantamento.md
│   │   └── comparacoes/
│   ├── conego-mendonca/
│   │   ├── levantamento.md
│   │   └── comparacoes/
│   └── antonio-alexandre/
│       ├── levantamento.md
│       └── comparacoes/
└── screenshots/
```

`AGENTS.md` é este guia detalhado para manutenção. `README.md` explica a pasta e os comandos a quem consulta o projeto. `scripts/` contém ferramentas executáveis; `capture/` obtém dados externos, enquanto `generate/` transforma arquivos locais. `streets/` agrupa a pesquisa por rua, usando os mesmos nomes de pasta de `maps/`. `screenshots/` reúne registros do cenário navegável.

## Cada script: entrada, saída e efeito

Os caminhos da tabela são relativos a `reference/`. As entradas e saídas citadas como `maps/` ou `src/` são relativas à raiz do projeto.

| Arquivo | Entrada e processamento | Saída / efeito |
| --- | --- | --- |
| `scripts/capture/capture-street.mjs` | Capturador comum e comando independente. Recebe pasta da rua, nome da rua, bairro, ID do panorama, latitude e longitude; a função `capturePoint` também aceita cidade, com padrão Codó. Compartilha `MAP_DIRECTIONS` e `validateMapManifest` de `src/map-manifests.js`. Busca oito imagens do panorama observado. | Cria/atualiza `maps/<rua>/ponto-NN/1.jpg` a `8.jpg` e `manifest.json`. Um panorama novo acrescenta um ponto; repetir o mesmo panorama substitui suas imagens e dados, mantendo o ID. Faz chamadas de rede. |
| `scripts/capture/capture-simeao.mjs` | Atalho para o capturador comum, com pasta `simeao-de-macedo` e nome Rua Simeão de Macedo. Recebe panorama, latitude, longitude e bairro opcional. | Atualiza a captura e o manifesto da Simeão. |
| `scripts/capture/capture-mendonca.mjs` | Atalho com pasta `conego-mendonca` e nome Rua Cônego Mendonça; mesmos argumentos. | Atualiza a captura e o manifesto da Cônego. |
| `scripts/capture/capture-antonio.mjs` | Atalho com pasta `antonio-alexandre` e nome Rua Antônio Alexandre; mesmos argumentos. | Atualiza a captura e o manifesto da Antônio. |
| `scripts/generate/generate-simeao-points.mjs` | Lê e valida o manifesto da Simeão. Preserva posições 1–17; acumula distâncias geográficas dos novos panoramas a partir do ponto 17, em 14 unidades/m. | Sobrescreve `src/simeao-points.js`; não altera fotos nem desenha casas. |
| `scripts/generate/simeao-contact.py` | Lê somente pontos 18 em diante, com Python/Pillow. | Grava pranchas de oito direções `ponto-NN.jpg` e comparações oeste/leste `extensao-1.jpg` a `extensao-4.jpg`, preservando as pranchas históricas 1–17. |
| `scripts/generate/generate-mendonca-points.mjs` | Lê e valida `maps/conego-mendonca/manifest.json`. Acumula as distâncias geográficas entre panoramas e as converte em aproximadamente 14 unidades do jogo por metro, mantendo `y = 2345`. | **Sobrescreve** `src/mendonca-points.js`, exportando `mendoncaPoints`. Não desenha as casas nem altera o manifesto. |
| `scripts/generate/generate-antonio-points.mjs` | Lê e valida `maps/antonio-alexandre/manifest.json`. Rotaciona deslocamentos geográficos para o referencial da Simeão e ajusta a extensão longitudinal às junções existentes. | **Sobrescreve** `src/antonio-points.js`, exportando `antonioPoints`. O ajuste é artístico, não uma projeção cadastral de medidas exatas. |
| `scripts/generate/mendonca-contact.py` | Abre `1.jpg` a `8.jpg` de cada pasta da Cônego, com Python/Pillow. Monta uma prancha de 1200 × 1720 pixels, duas colunas e quatro linhas, com número e direção. | Grava/substitui `streets/conego-mendonca/comparacoes/ponto-NN.jpg`. Não altera os originais de `maps/`. |
| `scripts/generate/antonio-contact.py` | Faz a mesma montagem para cada pasta da Antônio Alexandre. | Grava/substitui `streets/antonio-alexandre/comparacoes/ponto-NN.jpg`. |

### Funcionamento da captura

O capturador valida nome da pasta, bairro, coordenadas e manifesto. Para uma rua existente, cidade e nome da rua devem corresponder aos dados já registrados. Se o bairro daquele ponto diferir do padrão da rua, registra a substituição no próprio ponto.

As imagens são solicitadas com dimensões de 900 × 600, inclinação zero e orientações de 0° a 315° em passos de 45°. O script busca grupos de quatro imagens, confere resposta HTTP, tipo de conteúdo e assinatura/tamanho mínimo JPEG. Há timeout e tentativas para falhas de conexão.

Todas as oito respostas são obtidas antes de começar a gravar o conjunto. Depois da gravação das fotos, o manifesto é salvo. Isso evita registrar um novo ponto quando o download falha, mas não constitui uma transação de filesystem: uma interrupção durante a escrita ainda precisa de conferência.

Os scripts **não navegam sozinhos até a próxima esquina** nem descobrem panoramas. Cada execução precisa do ID e das coordenadas da posição observada no Street View. Não use um identificador inventado ou fotos de outro ponto para preencher lacunas.

### Caminhos e dependências

Os scripts calculam a raiz a partir da própria localização: JavaScript usa `import.meta.url`/`new URL('../../../', ...)`, e Python usa `Path(__file__).resolve().parents[3]`. Assim, entradas e saídas não dependem do diretório corrente do terminal. Se mover um script, revise essa profundidade e o import do validador.

Os scripts JavaScript usam módulos nativos do Node. As montagens Python precisam de **Pillow**, mas essa dependência não é necessária para executar o jogo. A opção `--use-system-ca` nos comandos de captura usa certificados do sistema em versões do Node que a oferecem; o Node usado para jogar pode ser diferente do utilizado nas ferramentas. Não desative a validação TLS para contornar um erro de certificado.

A Simeão possui gerador de posições e de montagens para a extensão. As posições originais 1–17 e suas pranchas históricas são preservadas; o levantamento documenta as novas capturas 18–31.

## Levantamentos e montagens por rua

| Arquivo ou conjunto | Função |
| --- | --- |
| `streets/simeao-de-macedo/levantamento.md` | Observações da sequência de casas, aberturas, cores, muros, vegetação e limites da reconstrução original. Apoia o catálogo `src/street-data.js`. |
| `streets/simeao-de-macedo/comparacoes/ponto-01.jpg` a `ponto-17.jpg` | Pranchas de revisão por ponto, preservadas da organização anterior de auditoria. São seleções de vistas, não substitutos dos oito originais de cada ponto. |
| `streets/simeao-de-macedo/comparacoes/ponto-18.jpg` a `ponto-31.jpg` e `extensao-1.jpg` a `extensao-4.jpg` | Pranchas novas, oito direções por ponto e comparações oeste/leste da extensão até a Henrique Figueiredo. |
| `streets/simeao-de-macedo/comparacoes/trecho-1.jpg` | Montagem de comparação do primeiro trecho da Simeão. |
| `streets/simeao-de-macedo/comparacoes/trecho-2.jpg` | Montagem de comparação do segundo trecho. |
| `streets/simeao-de-macedo/comparacoes/trecho-3.jpg` | Montagem de comparação do terceiro trecho. |
| `streets/conego-mendonca/levantamento.md` | Observações das 120 fotos, construções transversais, esquinas, praça e igreja, com limites das inferências. Apoia `src/mendonca-data.js`. |
| `streets/conego-mendonca/comparacoes/ponto-01.jpg` a `ponto-15.jpg` | Uma prancha de oito direções para cada ponto; saídas de `mendonca-contact.py`. |
| `streets/antonio-alexandre/levantamento.md` | Observações das 160 fotos: curva, casas, estabelecimentos, terreno, Escola Santa Filomena e face do cinema. Apoia `src/antonio-data.js` e fachadas específicas. |
| `streets/antonio-alexandre/comparacoes/ponto-01.jpg` a `ponto-20.jpg` | Uma prancha de oito direções para cada ponto; saídas de `antonio-contact.py`. |

O número de uma prancha corresponde ao ponto da **respectiva rua**. Confirme detalhes nos JPEGs originais quando uma montagem não mostrar resolução ou direção suficientes. Uma casa pode aparecer em várias pranchas; não conte cada aparição como uma construção nova.

## Cada captura do jogo em screenshots

Estas imagens documentam etapas de desenvolvimento. Não são testes automáticos de pixels nem a definição da geometria atual. Uma captura de uma correção pode preceder outras mudanças, como o deslocamento posterior do Cruzeiro do Sul.

| Arquivo | Registro |
| --- | --- |
| `cenario-aereo.jpg` | Visão aérea do cenário em uma etapa inicial. |
| `cenario-praca.jpg` | Aparência da região da praça naquela etapa. |
| `cenario-bar.jpg` | Aparência da região/interior do bar durante seu desenvolvimento. |
| `conversa-pericles.jpg` | Interação e diálogo com Péricles. |
| `camera-direita-aereo.jpg` | Vista aérea ao conferir a câmera que revela o outro lado da rua. |
| `camera-direita-esquina.jpg` | Conferência da esquina nessa orientação de câmera. |
| `camera-direita-fachadas.jpg` | Conferência de fachadas na orientação oposta. |
| `conego-mendonca-aereo.png` | Visão aérea da integração da Cônego Mendonça. |
| `conego-mendonca-praca-completa.png` | Registro da praça ampla com a igreja e seu entorno. |
| `antonio-alexandre-aereo.png` | Visão aérea da integração da Antônio Alexandre. |
| `antonio-alexandre-alinhamento.png` | Registro do ajuste das construções ao contorno da rua. |
| `casa-rosa-alinhada.png` | Registro da correção da casa rosa junto à praça. |
| `entrada-santa-filomena-corrigida.png` | Registro da entrada da escola após ajuste do muro. |
| `cruzeiro-do-sul-corrigido.png` | Registro da escultura e da correção de sua implantação na praça naquela versão. |

## Comandos a partir da raiz do projeto

Captura de uma posição, substituindo os argumentos pelos dados observados:

```sh
node --use-system-ca reference/scripts/capture/capture-street.mjs pasta-da-rua "Nome da rua" "Nome do bairro" PANORAMA LATITUDE LONGITUDE
node --use-system-ca reference/scripts/capture/capture-simeao.mjs PANORAMA LATITUDE LONGITUDE
node --use-system-ca reference/scripts/capture/capture-mendonca.mjs PANORAMA LATITUDE LONGITUDE
node --use-system-ca reference/scripts/capture/capture-antonio.mjs PANORAMA LATITUDE LONGITUDE
```

Nos três atalhos de ruas conhecidas, um argumento de bairro pode vir após a longitude. Se omitido, o script lê o bairro padrão do manifesto existente; para criar uma rua sem manifesto, informe o bairro explicitamente.

Geração a partir dos dados locais:

```sh
node reference/scripts/generate/generate-simeao-points.mjs
node reference/scripts/generate/generate-mendonca-points.mjs
node reference/scripts/generate/generate-antonio-points.mjs
python reference/scripts/generate/simeao-contact.py
python reference/scripts/generate/mendonca-contact.py
python reference/scripts/generate/antonio-contact.py
```

São comandos de desenvolvimento que escrevem arquivos, não etapas obrigatórias de `npm start`. Execute o gerador relacionado ao dado que precisa atualizar; não recapture imagens apenas para conferir documentação ou executar testes.

## Manutenção e expansão

Para outra rua, mantenha os originais/manifesto em `maps/<rua>/`, o levantamento em `streets/<rua>/levantamento.md` e as montagens em `streets/<rua>/comparacoes/`. Capturas do jogo entram em `screenshots/` com nomes que identifiquem seu propósito. Não coloque arquivos temporários de verificação junto às referências permanentes.

Nos levantamentos, registre o que está visível, o que foi informado pelo usuário e o que foi aproximado no desenho. Confronte fotografias com o catálogo atual antes de reutilizar uma decisão de uma captura antiga. Preservar esta pasta não significa que todas as suas imagens representam a última versão do jogo.

Ao modificar scripts, confira entradas e destinos de escrita e mantenha compatibilidade com o contrato de [maps/AGENTS.md](../maps/AGENTS.md). Teste transformações em uma cópia temporária se a intenção for apenas validar saídas, especialmente nos scripts que sobrescrevem arquivos. Depois de integrar novos pontos ao cenário, execute os testes da rua e de manifestos. A suíte atual não automatiza os downloads nem a aparência das montagens.
