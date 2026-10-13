# Guia da IA — tests

## Finalidade e execução

Este diretório reúne os testes automatizados de dados e comportamento do jogo. Complementa o [guia da raiz](../AGENTS.md). Todos os comandos abaixo devem ser executados a partir da raiz do projeto.

```sh
npm test
```

O comando corresponde a `node --test tests/*.test.mjs`. Usa o executor `node:test`, assertivas e módulos nativos do Node, sem framework externo. Requer Node.js 20 ou posterior; não precisa de `npm install`, navegador, servidor HTTP iniciado manualmente nem acesso ao Street View. O teste do endpoint inicia e encerra um servidor em porta efêmera de `127.0.0.1`.

Os testes importam a implementação real de `src/` e leem fotografias e manifestos locais em `maps/`. Não há uma pasta separada de fixtures. A suíte contém atualmente **23 arquivos de testes, com 95 casos**; `AGENTS.md` é este guia e não é executado pelo runner.

## Função e cobertura de cada arquivo

| Arquivo | Casos atuais | O que verifica |
| --- | --- | --- |
| `alcebiades.test.mjs` | 4 | Quinze panoramas, 112 fotos novas e esquina reutilizada; preservação da Cônego; chegada desde START, caminhada/clique nas quatro câmeras, fotos corretas, retorno e limites da Cardoso/Vinte e Oito; dez posições antigas preservadas, praça e quadra acessíveis, grades/rampas sólidas, Sicoob e Crefisa únicos, retorno pela Vinte e Oito conectado e limite da Cardoso preservado. |
| `world.test.mjs` | 7 | Existência das oito fotos dos 31 pontos da Simeão; ida e volta da projeção dos cliques; continuidade da rua; limites e obstáculos; busca de caminho desviando de canteiro; percurso completo de ida e volta; base inteira do Cruzeiro do Sul dentro da praça e passagem ao redor. |
| `simeao-extension.test.mjs` | 3 | Preservação dos 17 pontos originais, 112 novas imagens JPEG distintas, coordenadas e limites; travessia da Cônego, chegada/retorno da Henrique Figueiredo; localização das fotos, colisões e unicidade das esquinas compartilhadas. |
| `home-lighting.test.mjs` | 2 | Proporção de casas selecionadas, estabilidade da seleção por ID, exclusão de comércio/serviços e de fachadas sem janelas, incluindo casas transversais. |
| `lighting.test.mjs` | 7 | Limites exatos de acendimento dos postes; direção oposta ao Sol e comprimento das sombras; transição contínua para noite; preservação da posição mundial nas quatro câmeras; posições das lâmpadas; luz no corpo com intensidade gradual, desligamento diurno e limite na sobreposição de postes. |
| `server-clock.test.mjs` | 5 | Endpoint sem cache e métodos HTTP; fuso do servidor, latência e meia-noite; mudança dos postes por avanço real; recuperação após falhas; sincronização concorrente e rejeição de dados inválidos. |
| `bar.test.mjs` | 3 | Entrada no bar, desvio das mesas, chegada ao balcão e saída; passagem pelas duas portas e bloqueio no restante da fachada; colisão com mesas, balcão e Péricles. |
| `camera.test.mjs` | 4 | Recuperação dos destinos da rua/bar nas duas primeiras perspectivas; troca de profundidade sem espelhar o mundo; preservação da personagem, construções, colisões e caminho ao girar; restauração da câmera depois de preparar outra vista. |
| `actor-animation.test.mjs` | 3 | Oito setores de direção, preservação da postura ao parar e orientação do destino clicado nas quatro câmeras. |
| `click-navigation.test.mjs` | 5 | Primeiro clique anda rápido e segundo clique rápido corre ao mesmo destino mesmo com deslocamento de câmera; cliques lentos, distantes ou em outra superfície não iniciam corrida; reset do gesto e duplo toque; deslocamentos de corrida respeitam mesas e portas; velocidades de 100/125 unidades/s, com avanço efetivo de 25% a mais na corrida. |
| `mendonca-praca.test.mjs` | 3 | Preserva as 22 posições antigas; reutilização byte a byte da esquina e 64 fotos novas; ida e volta desde a Fernando nas quatro câmeras; acesso desde o início; boca da praça, limites do trecho, fotos e volumes compartilhados. |
| `mendonca-west.test.mjs` | 3 | IDs e posições históricas preservados; ordem espacial; percurso de ida e volta até a Fernando nas quatro câmeras; fotos/localização e ausência de lotes sobre pista e passeios; quatro esquinas compartilhadas únicas. |
| `mendonca.test.mjs` | 5 | 37 panoramas, 296 fotos distintas e coordenadas; igreja inteira dentro da praça, acessos livres e ausência de rua atravessando o muro ao norte; percurso conectado com a Simeão; mudança de fotos/numeração na esquina preservando os 17 pontos originais; projeção transversal nas quatro câmeras e restauração do estado. |
| `antonio.test.mjs` | 9 | 34 pontos, 272 fotos distintas e coordenadas; volta pelas três ruas e Vinte e Oito de Julho; associação de fotos nas quatro câmeras; volumes compartilhados e obstáculos da escola; encontro das fachadas nas divisas; lotes fora da faixa da rua; colisões em paredes inclinadas e plantas de esquina; alinhamento da casa rosa; recorte do muro azul na entrada coberta da escola. |
| `julho-east.test.mjs` | 3 | Pontos 1–18 preservados, sequência 19–29 e reutilização da esquina; cliques/caminhada com retorno nas quatro câmeras; lotes fora dos passeios, esquinas únicas, Coelho livre e limites da expansão. |
| `julho.test.mjs` | 5 | 29 panoramas e 232 JPEGs distintos; percurso entre as praças passando por Fernando nas quatro vistas; lotes livres, preservação dos nove pontos anteriores, reutilização da esquina, ordem espacial independente, quatro volumes compartilhados e iluminação residencial correta. |
| `road-width.test.mjs` | 5 | Tipo explícito no JSON e perfis de 4/5 carros e passeios de 2/4 pessoas; largura perpendicular nas curvas; pista livre dos lotes e navegável nas oito rotas; planta do carro idêntica na projeção e colisão; faixa completa dos dois passeios fora dos lotes em todos os segmentos mapeados. |
| `manifests.test.mjs` | 4 | Esquema dos oito manifestos, bairro e oito imagens por ponto; carregamento preservando `x/y` e referências; mudança de bairro por ponto e retorno ao bairro da rua vizinha; rejeição de manifestos inválidos/falhas de carregamento sem aplicar metadados parcialmente. |
| `antonio-matriz.test.mjs` | 3 | Preserva os vinte pontos antigos; ordena os IDs da extensão; percorre até a Henrique e retorna, com seleção de fotos, colisões dos muros inclinados, braços do cruzamento e volumes únicos da igreja e jardim de esquina. |

As verificações de fotos incluem existência/estrutura e, nas ruas adicionadas, comparação de conteúdo para identificar duplicações. Elas não interpretam visualmente se a imagem representa a casa correta. O validador de manifestos também não comprova que uma coordenada válida corresponde à foto: essa conferência depende do mapeamento.

## Executar somente os testes relacionados

| Mudança | Comando sugerido |
| --- | --- |
| Manifestos, bairro, IDs ou caminhos das fotos | `node --test tests/manifests.test.mjs` e o arquivo da rua afetada. |
| Geometria geral, praça ou posição do monumento | `node --test tests/world.test.mjs` |
| Horário, sombras e iluminação dos postes | `node --test tests/lighting.test.mjs tests/server-clock.test.mjs` e comparação com `/api/time` no navegador. |
| Planta ou interação navegável do bar | `node --test tests/bar.test.mjs tests/click-navigation.test.mjs` |
| Projeção e câmera | `node --test tests/camera.test.mjs tests/mendonca.test.mjs tests/antonio.test.mjs` |
| Clique duplo ou velocidades | `node --test tests/click-navigation.test.mjs tests/bar.test.mjs` |
| Cônego, igreja e praça | `node --test tests/mendonca.test.mjs` |
| Curva da Antônio, casas, escola ou retorno ao início | `node --test tests/antonio.test.mjs` |
| Mudança compartilhada ou integração do conjunto | `npm test` |

Uma falha de foto ou manifesto deve ser investigada no arquivo real e em sua associação, sem alterar a expectativa apenas para fazer o teste passar. Quantidades fixas representam o mapeamento atual; quando uma expansão for intencional, atualize dados, integração e verificações em conjunto.

## Como manter e ampliar os testes

- Preserve o foco no comportamento: passagem livre, bloqueio de parede, caminho alcançável, associação correta de ponto e bairro. Testar apenas a existência de uma função não confirma esses contratos.
- Os testes de navegação verificam segmentos e deslocamentos efetivos, não somente se `findPath` devolveu uma lista. Um trajeto não deve cruzar um prédio entre dois pontos válidos.
- A geometria envolve números fracionários. Use tolerâncias coerentes para projeção e posição; não transforme um erro de alinhamento em tolerância grande apenas para aprovar o caso.
- Ao mudar temporariamente a câmera ou metadados das rotas, restaure o estado anterior em `try/finally`. Isso evita que um caso dependa da ordem de execução de outro dentro do mesmo arquivo.
- Os testes de manifestos usam leitura local/fetch substituto e dados de bairro sintéticos em memória. Mantenha esses exemplos fora dos manifestos reais de Centro.
- Não execute os capturadores de rede nos testes comuns. A suíte deve continuar reproduzível a partir dos dados locais e não sobrescrever fotos ou posições geradas.
- Acrescente regressões quando houver comportamento relevante a proteger. Mudanças apenas de documentação ou ajustes visuais simples não precisam de testes que reproduzam literalmente a implementação.

## O que ainda precisa de conferência no navegador

O runner Node não testa o DOM, o áudio nem a aparência dos canvases. Ele não oferece comparação automática com `reference/screenshots/`; essas imagens são registros históricos, não imagens de resultado esperado.

Quando uma alteração afetar desenho ou interação de tela, abra `npm start` e confira os casos pertinentes:

1. Câmeras Q nas quatro orientações e vista aérea M, observando fachadas, letreiros, cobertura e ordem de profundidade.
2. Caminhada, corrida, clique simples/duplo no chão e no minimapa, com destino preservado durante movimento de câmera.
3. E em cada rua e perto das junções, conferindo o conjunto de oito fotos e o bairro do cabeçalho.
4. Entrada pelas duas portas do bar, circulação pelas mesas, conversa com Péricles e saída.
5. Locais alterados: continuidade dos lotes na curva, entradas visíveis da escola, ruas livres junto à igreja e monumento dentro da praça.

6. Horário automático: compare `data-time` do canvas com `/api/time` considerando o fuso enviado. Confira ausência da barra manual, continuidade após voltar à aba, quatro câmeras, vista aérea e telas pequenas. Os limites 05:29/05:30 e 17:59/18:00 são verificados com relógio injetado nos testes, sem alterar a hora do sistema.

7. Janelas noturnas: conferir brilho interno quente nas casas selecionadas, grades/venezianas preservadas, ausência de luz nas paredes/chão e ocultação por árvores/prédios nas quatro câmeras e vista aérea. Casas sem janelas e construções públicas/comerciais não recebem esse efeito.

8. Personagem sob postes à noite: conferir luz quente na roupa e pele, transição gradual ao entrar/sair do alcance, direção nas quatro câmeras, vista aérea e ocultação por objetos à frente. Dentro do bar e durante o dia, a personagem não recebe essa contribuição dos postes.

Use somente os itens relevantes à mudança. Uma suíte aprovada confirma os contratos cobertos, mas não substitui essa inspeção visual. Alterações nos scripts de `reference/` também exigem conferência própria de seus arquivos de saída; não estão cobertas integralmente pelos 95 casos atuais.

`fernando.test.mjs` acrescenta três casos: 17 panoramas e 136 fotos distintas dentro da rua, com reutilização byte a byte do início; caminhada/clique até a Cônego e retorno nas quatro câmeras; lotes fora da faixa, colisões, braços livres, preservação das esquinas e ausência de ligação artificial com trecho não mapeado.


`coelho.test.mjs` acrescenta três casos: 22 panoramas e 176 fotos distintas, reutilização byte a byte da esquina, GPS/referências válidas; caminhada e cliques nas quatro câmeras até a Cônego e retorno, com troca correta de fotos; passeios livres, esquinas únicas, ruína/ginásio sem luz residencial e colisão do caminhão. O teste de largura inclui a área inclinada `onCoelhoRoad`.

`mendonca-benedito.test.mjs` tem três casos: preservação de 31 posições, 48 JPEGs novos e metadados da avenida; ida/volta nas quatro câmeras e limites da captura; larguras de pista/passeios, volumes únicos e colisões. Execute `node --test tests/mendonca-benedito.test.mjs tests/mendonca-praca.test.mjs tests/road-width.test.mjs` para a verificação focada e `npm test` para integração.


`benedito.test.mjs` acrescenta três casos: 14 panoramas, 104 fotos novas e oito reutilizadas; preservação da Cônego; ida e volta com cliques nas quatro câmeras, seleção de fotos, acesso pela praça e limites; esquinas únicas, lotes sólidos, cobertura aberta e usos sem emissão residencial. O teste geral de largura cobre a pista de cinco carros e os passeios da oitava rota. Execute `node --test tests/benedito.test.mjs tests/road-width.test.mjs tests/manifests.test.mjs` e `npm test`.
