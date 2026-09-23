# Referências e ferramentas de mapeamento

Esta pasta reúne as ferramentas, os levantamentos e os registros visuais usados para construir o cenário. As fotografias originais e os manifestos ficam em `../maps/`; o jogo carrega seus dados de `maps/` e `src/`.

O [AGENTS.md](AGENTS.md) detalha a função de cada script, levantamento, montagem e captura para manutenção pela IA.

## Organização

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

- **`scripts/capture/`**: captura as oito direções e registra rua, bairro e coordenadas em `maps/<rua>/manifest.json`.
- **`scripts/generate/`**: transforma os manifestos em posições do cenário e prepara montagens fotográficas para comparação.
- **`streets/<rua>/levantamento.md`**: anotações sobre fachadas, cores, aberturas, alinhamento e limites da reconstrução.
- **`streets/<rua>/comparacoes/`**: montagens das fotos da respectiva rua. Na Simeão, reúne as antigas pranchas de `audit` e as três montagens `trecho-1.jpg` a `trecho-3.jpg`.
- **`screenshots/`**: capturas do jogo e registros das correções. São registros históricos; imagens antigas podem mostrar uma versão anterior do cenário.

## Levantamentos

- [Rua Simeão de Macedo](streets/simeao-de-macedo/levantamento.md)
- [Rua Cônego Mendonça](streets/conego-mendonca/levantamento.md)
- [Rua Antônio Alexandre](streets/antonio-alexandre/levantamento.md)

## Capturar uma posição

Exemplos de comandos executados a partir da raiz do projeto, substituindo os parâmetros pelos dados observados no Street View:

```sh
node --use-system-ca reference/scripts/capture/capture-street.mjs pasta-da-rua "Nome da rua" "Nome do bairro" PANORAMA LATITUDE LONGITUDE
node --use-system-ca reference/scripts/capture/capture-simeao.mjs PANORAMA LATITUDE LONGITUDE
node --use-system-ca reference/scripts/capture/capture-mendonca.mjs PANORAMA LATITUDE LONGITUDE
node --use-system-ca reference/scripts/capture/capture-antonio.mjs PANORAMA LATITUDE LONGITUDE
```

Os três comandos de ruas conhecidas aceitam um bairro opcional após a longitude. Se ele for omitido, usam o bairro padrão do manifesto. A numeração circular das fotos é **1=N, 2=NE, 3=L, 4=SE, 5=S, 6=SO, 7=O, 8=NO**. Repetir um panorama mantém seu número; o manifesto é gravado após salvar as oito imagens.

## Gerar posições e montagens

```sh
node reference/scripts/generate/generate-mendonca-points.mjs
node reference/scripts/generate/generate-antonio-points.mjs
python reference/scripts/generate/mendonca-contact.py
python reference/scripts/generate/antonio-contact.py
```

Os geradores JavaScript atualizam `src/mendonca-points.js` e `src/antonio-points.js`. Os scripts Python precisam de Pillow e salvam as montagens em `reference/streets/<rua>/comparacoes/`. Os caminhos de entrada e saída são calculados pela localização do script, de modo que também funcionam quando chamados de outra pasta.

A Simeão mantém suas posições artísticas em `src/world.js`; as coordenadas geográficas das capturas estão no manifesto. Não há gerador de posições ou de montagens da Simeão nesta pasta.

## Adicionar outra rua

As capturas e o manifesto vão para `maps/<rua>/`. Crie o levantamento em `reference/streets/<rua>/levantamento.md` e guarde suas montagens em `comparacoes/`. Capturas do cenário navegável vão para `screenshots/`. Depois de integrar a nova rua ao cenário, execute `npm test` na raiz do projeto.
