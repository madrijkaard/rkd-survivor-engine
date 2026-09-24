# Guia da IA — raiz do projeto

## Finalidade e escopo

Este projeto é **Codó Sobrevive**, um jogo de exploração local, em terceira pessoa, com cenário 2D inspirado na apresentação do PS1. Reconstrói artisticamente três ruas do bairro Centro, em Codó: Simeão de Macedo, Cônego Mendonça e Antônio Alexandre. A ligação pela Vinte e Oito de Julho fecha o percurso; ela não tem um conjunto independente de capturas mapeadas.

Leia este guia a partir da raiz. Os caminhos aqui são relativos a ela. Os guias de [maps](maps/AGENTS.md), [reference](reference/AGENTS.md), [src](src/AGENTS.md) e [tests](tests/AGENTS.md) detalham suas respectivas áreas. Ao alterar a estrutura ou um contrato descrito, atualize também a documentação correspondente.

## Cada diretório e arquivo da raiz

| Caminho | Função no projeto |
| --- | --- |
| `.agents/skills/` | Skills locais do projeto. `expandir-ate-a-proxima-esquina/SKILL.md` orienta captura, registro geográfico e integração de ruas ao cenário. `verificar-semelhanca-grafico-com-fotos/SKILL.md` compara fotos de uma única rua com o jogo e corrige divergências visuais. `commit-e-push-das-alteracoes/SKILL.md` organiza mudanças por assunto, cria commits com mensagens específicas e confirma o push ao remoto. |
| `maps/` | Dados usados pelo jogo: fotografias originais e `manifest.json` de cada rua. São 66 pontos e 528 fotos, com oito direções por ponto. Não é uma pasta de resultados descartáveis. |
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
2. `src/map-manifests.js` lê os três manifestos de `maps/`, valida seu formato e a correspondência com os pontos do mundo. Só aplica os metadados depois de validar todas as ruas.
3. `src/render.js` carrega fotografias selecionadas para texturas e prepara as quatro perspectivas em canvases fora da tela. Chão, construções, sombras e objetos estáticos ficam preparados para composição.
4. A animação compõe essas camadas com a personagem, usando projeção e profundidade da câmera ativa. O interior do bar possui camadas próprias. É Canvas 2D; não há WebGL ou motor 3D externo.
5. Movimento e busca de caminho consultam a mesma geometria de obstáculos do mundo. `locationAt(x, y)` identifica a rua e o ponto de referência próximos; o jogo usa esse resultado para bairro, minimapa e fotos acessíveis por **E**.

As posições geográficas WGS84 do manifesto e as posições artísticas `x/y` do jogo são sistemas diferentes. Trocar um bairro no JSON não desloca uma casa. Adicionar fotos também não desenha automaticamente uma nova rua.

## Onde está a informação de referência

| Informação a alterar ou consultar | Local principal |
| --- | --- |
| Cidade, rua, bairro, panorama e latitude/longitude de cada captura | `maps/<rua>/manifest.json` |
| Fotos em cada direção | `maps/<rua>/ponto-NN/1.jpg` até `8.jpg` |
| Observações do que aparece nas fotos | `reference/streets/<rua>/levantamento.md` e `comparacoes/` |
| Posições e conexões navegáveis, obstáculos e associação ao ponto atual | `src/world.js` e catálogos das ruas |
| Casas da Simeão | `src/street-data.js`; extensão em `src/simeao-extension.js`, motivos em `src/simeao-facades.js` e pontos gerados em `src/simeao-points.js` |
| Cônego Mendonça, praça e igreja | `src/mendonca-data.js` e `src/mendonca-render.js` |
| Curva, casas e escola da Antônio Alexandre | `src/antonio-data.js`, `src/antonio-facades.js` e `src/antonio-render.js` |
| Posições geradas da Cônego e Antônio | `src/*-points.js`, gerados pelos dois scripts em `reference/scripts/generate/` |
| Nomes próprios opcionais de locais | `src/place-names.js`; consulta por `places`/`getPlace(id)` de `src/world.js` |
| Planta e interior do Bar O Péricles | `src/bar-layout.js` e `src/bar-render.js` |
| Posição da Praça do Cinema e do Cruzeiro do Sul | `src/cinema-plaza.js`; forma da escultura em `src/cinema-monument.js` |
| Controles, interação, cabeçalho e som | `src/game.js`, com gesto de clique em `src/click-navigation.js` |
| Horário, sombras solares, postes e janelas noturnas | `src/lighting.js`, `src/lighting-render.js`, `src/home-lighting.js` e `src/server-clock.js`; `/api/time` em `server.mjs`, sincronização em `src/game.js` |
| Projeção e desenho comuns | `src/projection.js`, `src/render.js`, `src/architecture.js`, `src/facades.js` e `src/building-geometry.js` |

## Cuidados ao evoluir o jogo

- Preserve a associação **rua + número do ponto + direção**. A numeração de cada rua é independente; os oito arquivos seguem a ordem circular documentada em `maps/AGENTS.md`. Uma foto não corresponde a uma casa: a mesma construção aparece em vários pontos.
- A Simeão tem 31 pontos, incluindo a extensão após a Cônego até a Henrique Figueiredo. Os pontos 1–17 originais foram preservados; 18–31 são novas capturas de setembro de 2026. Seu identificador interno de rota é `simeao`, enquanto a pasta se chama `simeao-de-macedo`.
- O painel informativo inferior esquerdo foi removido por decisão de interface. A localização, seus metadados e a consulta das fotos continuam ativos. Não confunda remover um painel com apagar o mapeamento.
- Os trechos atuais pertencem ao Centro. O bairro do cabeçalho vem dos manifestos; não deve ser fixado no HTML. A escolha acompanha o ponto próximo, sem representar uma divisa administrativa exata.
- Preserve IDs das construções. `name` pode ser uma descrição visual antiga; `displayName` reserva o nome próprio. O cadastro de nomes não cria etiquetas nem muda automaticamente o letreiro pintado de uma fachada.
- Casas em curvas usam plantas compartilhadas pelo desenho e pela colisão. Alterar só uma parede ou só um telhado pode voltar a colocar parte de um lote sobre a rua. Esquinas e cinema compartilham volumes entre ruas.
- A Igreja da Matriz fica dentro de sua praça, com as ruas do entorno livres. As entradas da Escola Santa Filomena devem continuar visíveis mesmo com portões fechados. O Cruzeiro do Sul fica dentro da Praça do Cinema e tem sua forma específica, baseada nas imagens fornecidas.
- Dimensões, alturas e partes não fotografadas são aproximações artísticas. Diferencie observação das fotos, informação fornecida pelo usuário e inferência de modelagem.

## Como conferir alterações

Consulte [tests/AGENTS.md](tests/AGENTS.md) para escolher os testes relacionados à mudança. Use `npm test` para verificar a integração do conjunto. Para mudanças visuais, abra o jogo e confira as quatro câmeras, a vista aérea e os pontos afetados: os testes Node não verificam a aparência de pixels, textos ou sobreposições da interface.

Ao modificar caminhos, revise imports, URLs das fotos/manifestos, scripts geradores, documentos e testes. Ao regenerar posições, confira também as junções com as outras ruas e as fachadas. Para mudanças apenas documentais, confira caminhos, exemplos e coerência com a implementação; não é necessário criar novos testes.
