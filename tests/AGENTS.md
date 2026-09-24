# Guia da IA — tests

## Finalidade e execução

Este diretório reúne os testes automatizados de dados e comportamento do jogo. Complementa o [guia da raiz](../AGENTS.md). Todos os comandos abaixo devem ser executados a partir da raiz do projeto.

```sh
npm test
```

O comando corresponde a `node --test tests/*.test.mjs`. Usa o executor `node:test`, assertivas e módulos nativos do Node, sem framework externo. Requer Node.js 20 ou posterior; não precisa de `npm install`, navegador, servidor HTTP iniciado manualmente nem acesso ao Street View. O teste do endpoint inicia e encerra um servidor em porta efêmera de `127.0.0.1`.

Os testes importam a implementação real de `src/` e leem fotografias e manifestos locais em `maps/`. Não há uma pasta separada de fixtures. A suíte contém atualmente **dez arquivos de testes, com 48 casos**; `AGENTS.md` é este guia e não é executado pelo runner.

## Função e cobertura de cada arquivo

| Arquivo | Casos atuais | O que verifica |
| --- | --- | --- |
| `world.test.mjs` | 7 | Existência das oito fotos dos 17 pontos da Simeão; ida e volta da projeção dos cliques; continuidade da rua; limites e obstáculos; busca de caminho desviando de canteiro; percurso completo de ida e volta; base inteira do Cruzeiro do Sul dentro da praça e passagem ao redor. |
| `home-lighting.test.mjs` | 2 | Proporção de casas selecionadas, estabilidade da seleção por ID, exclusão de comércio/serviços e de fachadas sem janelas, incluindo casas transversais. |
| `lighting.test.mjs` | 5 | Limites exatos de acendimento dos postes; direção oposta ao Sol e comprimento das sombras; transição contínua para noite; preservação da posição mundial nas quatro câmeras; posições das lâmpadas. |
| `server-clock.test.mjs` | 5 | Endpoint sem cache e métodos HTTP; fuso do servidor, latência e meia-noite; mudança dos postes por avanço real; recuperação após falhas; sincronização concorrente e rejeição de dados inválidos. |
| `bar.test.mjs` | 3 | Entrada no bar, desvio das mesas, chegada ao balcão e saída; passagem pelas duas portas e bloqueio no restante da fachada; colisão com mesas, balcão e Péricles. |
| `camera.test.mjs` | 4 | Recuperação dos destinos da rua/bar nas duas primeiras perspectivas; troca de profundidade sem espelhar o mundo; preservação da personagem, construções, colisões e caminho ao girar; restauração da câmera depois de preparar outra vista. |
| `click-navigation.test.mjs` | 4 | Primeiro clique caminha e segundo clique rápido corre ao mesmo destino mesmo com deslocamento de câmera; cliques lentos, distantes ou em outra superfície não iniciam corrida; reset do gesto e duplo toque; deslocamentos de corrida respeitam mesas e portas. |
| `mendonca.test.mjs` | 5 | Quinze panoramas, 120 fotos distintas e coordenadas; igreja inteira dentro da praça e ruas de contorno livres; percurso conectado com a Simeão; mudança de fotos/numeração na esquina preservando os 17 pontos originais; projeção transversal nas quatro câmeras e restauração do estado. |
| `antonio.test.mjs` | 9 | Vinte pontos, 160 fotos distintas e coordenadas; volta pelas três ruas e Vinte e Oito de Julho; associação de fotos nas quatro câmeras; volumes compartilhados e obstáculos da escola; encontro das fachadas nas divisas; lotes fora da faixa da rua; colisões em paredes inclinadas e plantas de esquina; alinhamento da casa rosa; recorte do muro azul na entrada coberta da escola. |
| `manifests.test.mjs` | 4 | Esquema dos três manifestos, bairro e oito imagens por ponto; carregamento preservando `x/y` e referências; mudança de bairro por ponto e retorno ao bairro da rua vizinha; rejeição de manifestos inválidos/falhas de carregamento sem aplicar metadados parcialmente. |

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

Use somente os itens relevantes à mudança. Uma suíte aprovada confirma os contratos cobertos, mas não substitui essa inspeção visual. Alterações nos scripts de `reference/` também exigem conferência própria de seus arquivos de saída; não estão cobertas integralmente pelos 48 casos atuais.
