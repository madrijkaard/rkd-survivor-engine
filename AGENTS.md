# Guia da IA — raiz do projeto

## Finalidade e escopo

Este projeto é **Codó Sobrevive**, um jogo de exploração local, em terceira pessoa, com cenário 2D inspirado na apresentação do PS1. Reconstrói artisticamente oito vias do bairro Centro, em Codó: Simeão de Macedo, Cônego Mendonça, Antônio Alexandre, Vinte e Oito de Julho, Fernando Carvalho, Praça Alcebíades Silva, Coelho Neto e Avenida São Benedito. A Vinte e Oito liga o percurso antigo e possui 29 pontos próprios entre a Praça Alcebíades Silva e a Rua Coelho Neto, passando pela Fernando Carvalho, Praça do Cinema e Antônio Alexandre.

Leia este guia a partir da raiz. Os caminhos aqui são relativos a ela. Os guias de [maps](maps/AGENTS.md), [reference](reference/AGENTS.md), [src](src/AGENTS.md) e [tests](tests/AGENTS.md) detalham suas respectivas áreas. Ao alterar a estrutura ou um contrato descrito, atualize também a documentação correspondente.

## Cada diretório e arquivo da raiz

| Caminho | Função no projeto |
| --- | --- |
| `.agents/skills/` | Skills locais do projeto. `expandir-ate-a-proxima-esquina/SKILL.md` orienta captura, registro geográfico e integração de ruas ao cenário. `verificar-semelhanca-grafico-com-fotos/SKILL.md` compara fotos de uma única rua com o jogo e corrige divergências visuais. `commit-e-push-das-alteracoes/SKILL.md` organiza mudanças por assunto, cria commits com mensagens específicas e confirma o push ao remoto. |
| `maps/` | Dados usados pelo jogo: fotografias originais e `manifest.json` de cada rua. São 199 pontos e 1592 fotos, com oito direções por ponto. Não é uma pasta de resultados descartáveis. |
| `reference/` | Material de desenvolvimento: scripts de captura e geração, levantamentos de fachadas, montagens para comparação e capturas históricas do jogo. Não é importado durante a execução do jogo, mas preserva ferramentas e evidências da reconstrução. |
| `src/` | Módulos JavaScript do navegador: catálogos do cenário, projeção, renderização, movimento, colisões, localização, interface e áudio. Alguns módulos puros também são usados pelos testes e scripts. |
| `tests/` | Testes automatizados com `node:test`: integridade das fotos e manifestos, geometria, trajetos, colisões, câmeras e gestos de navegação. |
| `AGENTS.md` | Este mapa técnico da raiz para a IA. Complementa o README e direciona aos guias específicos. |
| `README.md` | Apresentação geral para quem quer conhecer ou executar o jogo; contém tecnologias, recursos, estrutura e instruções de execução. |
| `index.html` | Entrada do navegador. Declara os canvases do cenário/transição, cabeçalho, minimapa, controles, diálogo do bar, janelas de ajuda/fotos e carregamento. Importa `src/game.js` como módulo ES. IDs e elementos são usados por `game.js` e `style.css`. |
| `style.css` | Aparência e disposição da interface, adaptação a telas menores, controles de toque, janelas e efeitos visuais retrô. O desenho das casas e do chão fica nos módulos Canvas, não neste CSS. |
| `server.mjs` | Servidor HTTP com módulos nativos do Node. Serve arquivos e `/api/time` (hora e fuso locais do servidor), em `127.0.0.1`, aceita GET/HEAD e evita cache persistente. Usa `PORT` ou 4173. Exporta `createGameServer` para testes. Não é um servidor de partidas, autenticação ou multiplayer. |
| `package.json` | Define módulos ES (`type: module`), Node >= 20 e comandos `npm start` e `npm test`. O pacote é privado e não possui dependências externas. |
| `package-lock.json` | Registro do pacote para o npm, em formato lockfile v3. Atualmente contém apenas o próprio projeto; mantenha-o coerente com mudanças feitas pelo npm. |

## Execução e verificação

Execute na raiz:

```sh
npm start
npm test
```

O primeiro comando mantém o servidor ativo em `http://127.0.0.1:4173/`; use outro terminal para os testes. Node.js 20 ou posterior basta para jogar e testar. Não existe etapa de build nem é necessário instalar dependências. Abrir `index.html` por `file://` não substitui o servidor: o jogo usa módulos e `fetch` dos manifestos.

Se a porta estiver ocupada, verifique se o jogo já está disponível nela. Para usar outra porta no PowerShell:

```powershell
$env:PORT = "4174"
npm start
```

No Git Bash: `PORT=4174 npm start`. Abra a porta escolhida no navegador. O servidor não troca de porta automaticamente e escuta apenas no computador local. `Ctrl+C` encerra o processo iniciado naquele terminal.

Python e Pillow são opcionais, usados somente nas montagens de referência. Capturar novas imagens requer rede; jogar com os arquivos existentes e executar os testes não depende de chamadas ao Google.

## Como as partes se conectam

1. `index.html` carrega `src/game.js`, que usa o mundo descrito em `src/world.js` e nos catálogos de cada rua.
2. `src/road-profiles.js` lê o tipo de via dos manifestos antes da montagem da geometria. `src/map-manifests.js` lê os oito manifestos de `maps/`, valida seu formato e a correspondência com os pontos do mundo. Só aplica os metadados depois de validar todas as ruas.
3. `src/render.js` carrega fotografias selecionadas para texturas e prepara as quatro perspectivas em canvases fora da tela. Chão, construções, sombras e objetos estáticos ficam preparados para composição.
4. A animação compõe essas camadas com a personagem, usando projeção e profundidade da câmera ativa. O interior do bar possui camadas próprias. É Canvas 2D; não há WebGL ou motor 3D externo.
5. Movimento e busca de caminho consultam a mesma geometria de obstáculos do mundo. `locationAt(x, y)` identifica a rua e o ponto de referência próximos; o jogo usa esse resultado para bairro, minimapa e fotos acessíveis por **E**.

As posições geográficas WGS84 do manifesto e as posições artísticas `x/y` do jogo são sistemas diferentes. Trocar um bairro no JSON não desloca uma casa. O campo `roadType` controla a largura da pista: rua = quatro carros (128 unidades), avenida = cinco (160), excluindo calçadas. `sidewalkType` identifica `calcada-de-rua` (duas pessoas, 40 unidades por lado) ou `calcada-de-avenida` (quatro pessoas, 80 por lado). Adicionar fotos também não desenha automaticamente uma nova rua.

## Onde está a informação de referência

| Informação a alterar ou consultar | Local principal |
| --- | --- |
| Cidade, rua, bairro, panorama e latitude/longitude de cada captura | `maps/<rua>/manifest.json` |
| Fotos em cada direção | `maps/<rua>/ponto-NN/1.jpg` até `8.jpg` |
| Observações do que aparece nas fotos | `reference/streets/<rua>/levantamento.md` e `comparacoes/` |
| Posições e conexões navegáveis, obstáculos e associação ao ponto atual | `src/world.js` e catálogos das ruas |
| Casas da Simeão | `src/street-data.js`; extensão em `src/simeao-extension.js`, motivos em `src/simeao-facades.js` e pontos gerados em `src/simeao-points.js` |
| Cônego Mendonça, praça e igreja | `src/mendonca-data.js` e `src/mendonca-render.js` |
| Curva, casas e escola da Antônio Alexandre | `src/antonio-data.js`, `src/antonio-facades.js`, `src/antonio-render.js` e extensão em `src/antonio-matriz.js`/`src/antonio-matriz-facades.js` |
| Posições geradas da Cônego e Antônio | `src/*-points.js`, gerados pelos dois scripts em `reference/scripts/generate/` |
| Nomes próprios opcionais de locais | `src/place-names.js`; consulta por `places`/`getPlace(id)` de `src/world.js` |
| Planta e interior do Bar O Péricles | `src/bar-layout.js` e `src/bar-render.js` |
| Posição da Praça do Cinema e do Cruzeiro do Sul | `src/cinema-plaza.js`; forma da escultura em `src/cinema-monument.js` |
| Controles, interação, cabeçalho e som | `src/game.js`, com gesto de clique em `src/click-navigation.js` |
| Horário, sombras solares, postes e janelas noturnas | `src/lighting.js`, `src/lighting-render.js`, `src/home-lighting.js` e `src/server-clock.js`; `/api/time` em `server.mjs`, sincronização em `src/game.js` |
| Projeção e desenho comuns | `src/projection.js`, `src/render.js`, `src/architecture.js`, `src/facades.js` e `src/building-geometry.js` |

A Vinte e Oito de Julho usa `src/julho-data.js`, `src/julho-render.js` e `src/julho-points.js`. Seus pontos 1–9 seguem da Praça do Cinema à Fernando; 10–18 documentam o retorno da Praça Alcebíades Silva à mesma esquina. O trecho antigo a leste, ligando Simeão e Antônio, permanece disponível. A casa branca/vinho da Simeão é compartilhada; não duplique essa esquina. A Fernando Carvalho agora continua ao norte até a Cônego Mendonça, com 17 pontos próprios (128 imagens novas e oito reutilizadas da esquina inicial). Seus módulos são `src/fernando-data.js`, `src/fernando-render.js` e `src/fernando-points.js`; preserve os volumes compartilhados da clínica e da casa verde. A Cônego liga Fernando e Simeão com sete pontos novos (16–22, 56 fotos), preservando os 15 antigos. `src/mendonca-west.js` e `src/mendonca-west-render.js` integram o quarteirão e reutilizam Bar O Péricles, muro da Simeão, Centro Operário e agência do trabalho.

## Cuidados ao evoluir o jogo

- Preserve a associação **rua + número do ponto + direção**. A numeração de cada rua é independente; os oito arquivos seguem a ordem circular documentada em `maps/AGENTS.md`. Uma foto não corresponde a uma casa: a mesma construção aparece em vários pontos.
- A Simeão tem 31 pontos, incluindo a extensão após a Cônego até a Henrique Figueiredo. Os pontos 1–17 originais foram preservados; 18–31 são novas capturas de setembro de 2026. Seu identificador interno de rota é `simeao`, enquanto a pasta se chama `simeao-de-macedo`.
- A Antônio Alexandre tem 34 pontos. Os IDs 1–20 e suas posições foram preservados; 21–34 cobrem a continuação ao norte da Cônego, ao lado da Matriz, até a Henrique Figueiredo. O ponto final é 33; 24 e 34 foram capturados na revisão dos intervalos. Use `antonioPath` para geometria e os IDs para fotos. A antiga passagem transversal atrás da igreja foi retirada após a conferência das imagens.
- O painel informativo inferior esquerdo foi removido por decisão de interface. A localização, seus metadados e a consulta das fotos continuam ativos. Não confunda remover um painel com apagar o mapeamento.
- Os trechos atuais pertencem ao Centro. O bairro do cabeçalho vem dos manifestos; não deve ser fixado no HTML. A escolha acompanha o ponto próximo, sem representar uma divisa administrativa exata.
- Preserve IDs das construções. `name` pode ser uma descrição visual antiga; `displayName` reserva o nome próprio. O cadastro de nomes não cria etiquetas nem muda automaticamente o letreiro pintado de uma fachada.
- Casas em curvas usam plantas compartilhadas pelo desenho e pela colisão. Alterar só uma parede ou só um telhado pode voltar a colocar parte de um lote sobre a rua. Esquinas e cinema compartilham volumes entre ruas.
- A Igreja da Matriz fica dentro de sua praça, com as ruas do entorno livres. As entradas da Escola Santa Filomena devem continuar visíveis mesmo com portões fechados. O Cruzeiro do Sul fica dentro da Praça do Cinema e tem sua forma específica, baseada nas imagens fornecidas.
- Dimensões, alturas e partes não fotografadas são aproximações artísticas. Diferencie observação das fotos, informação fornecida pelo usuário e inferência de modelagem.

## Como conferir alterações

Consulte [tests/AGENTS.md](tests/AGENTS.md) para escolher os testes relacionados à mudança. Use `npm test` para verificar a integração do conjunto. Para mudanças visuais, abra o jogo e confira as quatro câmeras, a vista aérea e os pontos afetados: os testes Node não verificam a aparência de pixels, textos ou sobreposições da interface.

Ao modificar caminhos, revise imports, URLs das fotos/manifestos, scripts geradores, documentos e testes. Ao regenerar posições, confira também as junções com as outras ruas e as fachadas. Para mudanças apenas documentais, confira caminhos, exemplos e coerência com a implementação; não é necessário criar novos testes.

A largura de referência do carro é 32 unidades, compartilhada por desenho, colisão e sombra em `src/road-dimensions.js`. A pessoa usa 20 unidades de largura visual com os braços (o raio dos pés na navegação continua 5). Use `roadType` e `sidewalkType` do JSON, carregado por `src/road-profiles.js`, ao desenhar novas pistas. A revisão de largura ajustou as sete rotas, curvas, esquinas, passeios e o interior do bar mantendo IDs e as posições geográficas.

A continuação da Cônego para oeste da Fernando está em `src/mendonca-praca.js` e `src/mendonca-praca-render.js`: pontos 23–31, até a entrada da Praça Alcebíades Silva, junto à Metalmar. O ponto 23 reutiliza a Fernando/17; 24–31 são 64 fotos novas. Clínica Sublime e terreno da esquina conservam seus IDs e a frente da Fernando; a praça só aparece em sua boca, sem representar seu percurso completo.

## Praça Alcebíades Silva

A sexta rota usa `maps/praca-alcebiades-silva/`, com quinze pontos e 120 fotos, da Cônego até a Vinte e Oito de Julho, passando pela Travessa Z. Cardoso. O ponto 1 reutiliza a Cônego/31; 2–10 são 72 imagens novas e 11–15 acrescentam outras 40. `src/alcebiades-points.js` é gerado por `reference/scripts/generate/generate-alcebiades-points.mjs`; catálogo e desenho ficam em `src/alcebiades-data.js` e `src/alcebiades-render.js`. A Metalmar mantém um único volume; praça, biblioteca, pavilhão e jardins são representados no entorno visível. A Travessa Z. Cardoso possui apenas suas bocas nas duas ruas: o trecho intermediário não está mapeado nem conectado artificialmente. Os pontos antigos e os dois sistemas de coordenadas foram preservados.

A continuação Cardoso → Vinte e Oito está em `src/alcebiades-julho.js` e `src/alcebiades-julho-render.js`: completa o mesmo volume do Sicoob, acrescenta Corpus, sobrado da Crefisa e contexto do Centro de Especialidades Odontológicas. Quadra cercada, rampas, abrigo de motos, bancos, árvores e placa compartilham desenho e colisão. O retorno pela Vinte e Oito até a Fernando está capturado e conectado. `src/julho-west.js` e `src/julho-west-render.js` acrescentam dez lotes e completam Crefisa, Centro Odontológico, Uniodonto e 2º Ofício como volumes únicos. O gerador conserva integralmente os pontos 1–10 e ancora o ponto 15 em y=-95.

A extensão leste da Vinte e Oito, da Antônio Alexandre à Coelho Neto, usa `src/julho-east.js` e `src/julho-east-render.js`. Os pontos 19–29 acrescentam 88 arquivos (80 novos e oito reutilizados da Antônio/20). A ordem é 19→20→21→22→23→24→25→26→28→27→29; o ponto 28 recupera uma captura que falhou temporariamente, sem renumeração. Clínica Reabilitar e muro da escola continuam volumes únicos. A Coelho Neto agora segue até a Cônego, junto à Matriz; o acesso de terra em frente não é uma nova rua navegável.


## Coelho Neto até a Matriz

A Coelho Neto possui 22 pontos (176 arquivos): oito fotos reutilizadas de Julho/29 e 168 novas. O percurso vai da Vinte e Oito de Julho à Cônego Mendonça, no sentido da Igreja Matriz. Os pontos antigos permanecem fixos. O panorama 22 documenta a interseção, sem capturas no quarteirão seguinte. Os módulos `src/coelho-points.js`, `src/coelho-geometry.js`, `src/coelho-data.js` e `src/coelho-render.js` definem a sétima rota. O ginásio e as casas rosa/clara e muro da Cônego conservam seus IDs; não duplicar essas construções. A Coelho liga as duas ruas, inclusive minimapa, fotos, navegação e iluminação.

## Cônego Mendonça até São Benedito

A Cônego agora possui 37 pontos/296 fotos, com 32–37 seguindo da Praça Alcebíades Silva até a Avenida São Benedito. `src/mendonca-benedito.js` e `src/mendonca-benedito-render.js` integram cinco volumes novos, complementam Girassol Center e pavilhão público sem duplicação, e representam somente os braços da avenida na esquina. A captura termina no ponto 37. `MENDONCA_WEST_END` continua sendo a âncora histórica da praça (31); use `MENDONCA_BENEDITO_END` para o novo extremo.


## Avenida São Benedito — sentido sul

A oitava rota percorre o lado oeste da Praça Alcebíades Silva, da Cônego Mendonça à Vinte e Oito de Julho, junto ao Banco do Brasil. São 14 pontos e 112 arquivos: oito reutilizados de Cônego/37 e 104 fotos novas. O acervo soma 199 pontos e 1592 JPEGs. O acesso intermediário ao terreno anunciado à venda não foi tratado como rua.
`src/benedito-points.js`, `benedito-data.js` e `benedito-render.js` fornecem posições, catálogo e desenho. `generate-benedito-points.mjs` mantém os pontos anteriores e alinha a nova avenida às extremidades da praça. O perfil vem de `maps/sao-benedito/manifest.json`. Sobrado de arcos e prédios públicos são compartilhados, com novos detalhes apenas nas faces fotografadas.
