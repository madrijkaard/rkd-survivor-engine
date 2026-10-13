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
- [Rua Vinte e Oito de Julho](streets/vinte-e-oito-de-julho/levantamento.md)
- [Rua Fernando Carvalho](streets/fernando-carvalho/levantamento.md)
- [Praça Alcebíades Silva](streets/praca-alcebiades-silva/levantamento.md)

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

A Simeão tem 31 pontos. `generate-simeao-points.mjs` preserva as 17 posições originais e calcula a extensão a partir das coordenadas do manifesto. `simeao-contact.py` produz pranchas dos pontos 18–31 e comparações oeste/leste, preservando os registros antigos.

A Antônio Alexandre tem 34 pontos, incluindo a extensão junto à Matriz até a Henrique Figueiredo. Seu gerador preserva as posições 1–20; a ordem espacial é independente dos IDs das capturas. `python reference/scripts/generate/antonio-contact.py 21` prepara somente as novas pranchas de oito direções, preservando as históricas. A esquina final é o ponto 33; o ponto 34 completa um intervalo perto do início.

## Adicionar outra rua

As capturas e o manifesto vão para `maps/<rua>/`. Crie o levantamento em `reference/streets/<rua>/levantamento.md` e guarde suas montagens em `comparacoes/`. Capturas do cenário navegável vão para `screenshots/`. Depois de integrar a nova rua ao cenário, execute `npm test` na raiz do projeto.

A Vinte e Oito de Julho possui 29 panoramas e 232 fotos, entre a Praça Alcebíades Silva e a Coelho Neto, passando por Fernando, Praça do Cinema e Antônio Alexandre. Consulte `streets/vinte-e-oito-de-julho/levantamento.md`. Use `python reference/scripts/generate/julho-contact.py` para as 29 pranchas e `node reference/scripts/generate/generate-julho-points.mjs` para as posições; ambos sobrescrevem somente suas saídas dessa rua.

## Fernando Carvalho

`streets/fernando-carvalho/levantamento.md` documenta todas as oito vistas dos 17 pontos, a travessa intermediária, o cruzamento final com a Cônego e as inferências. As 17 pranchas ficam em `comparacoes/`, geradas por `scripts/generate/fernando-contact.py`. `scripts/generate/generate-fernando-points.mjs` valida o manifesto e grava `src/fernando-points.js` sem alterar pontos das ruas anteriores. Use o capturador genérico para novas posições observadas. O primeiro conjunto reutiliza as oito imagens da esquina da Vinte e Oito; os outros 16 são novos.

A revisão de largura de 10/10/2026 está registrada nos cinco levantamentos. `roadType` nos manifestos orienta a proporção: quatro carros para ruas e cinco para avenidas, excluindo passeios. `sidewalkType` distingue calçadas de rua (duas pessoas/40 unidades por lado) e de avenida (quatro/80). `screenshots/ruas-largura-96-quatro-cameras.png` preserva a proporção anterior (três carros) e registra a comparação na Antônio Alexandre, com os carros alinhados à curva.

Verificação dessa revisão: 66 testes aprovados; cinco rotas vistas nas quatro câmeras, junções da Fernando/Simeão e praça da Matriz, iluminação diurna/noturna e vista aérea. No jogo foi percorrido o caminho da Praça do Cinema pela Vinte e Oito até Fernando/ponto 17; E identificou corretamente a rua e o conjunto de fotos. A página temporária de conferência foi removida.

`screenshots/ruas-128-calcadas-40-quatro-cameras.png` registra a proporção vigente na Simeão, nas quatro câmeras: pista de quatro carros e passeios de duas pessoas em cada lado.


**Coelho Neto:** levantamento e 22 pranchas em `streets/coelho-neto/`; fotos originais em `maps/coelho-neto/`. Recrie posições com `node reference/scripts/generate/generate-coelho-points.mjs` e pranchas com `python reference/scripts/generate/coelho-contact.py` (Pillow). Evidências da expansão usam o prefixo `screenshots/coelho-`.

A continuação da Cônego da Praça Alcebíades Silva até São Benedito está em `streets/conego-mendonca/levantamento.md`, pranchas 32–37 e `screenshots/conego-benedito-*`. São 48 novas fotos. O gerador preserva a âncora Fernando por ID Julho/09; não use o último item da lista da Vinte e Oito como essa âncora.


## Avenida São Benedito — sentido sul

A oitava rota percorre o lado oeste da Praça Alcebíades Silva, da Cônego Mendonça à Vinte e Oito de Julho, junto ao Banco do Brasil. São 14 pontos e 112 arquivos: oito reutilizados de Cônego/37 e 104 fotos novas. O acervo soma 199 pontos e 1592 JPEGs. O acesso intermediário ao terreno anunciado à venda não foi tratado como rua.
`streets/sao-benedito/levantamento.md` registra todas as vistas e limites. `scripts/generate/generate-benedito-points.mjs` lê o manifesto e sobrescreve somente `src/benedito-points.js`; `scripts/generate/benedito-contact.py` produz as 14 pranchas com Python/Pillow. Capturas e conferências do jogo usam o prefixo `screenshots/sao-benedito-`.
