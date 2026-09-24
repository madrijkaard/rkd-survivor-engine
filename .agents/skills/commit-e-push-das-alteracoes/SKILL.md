---
name: commit-e-push-das-alteracoes
description: Analisar mudanças ainda não commitadas, organizar commits coerentes por assunto e enviar a branch ao repositório remoto com git push. Use quando o usuário pedir para organizar, commitar e publicar as alterações; um único commit é adequado quando todo o conjunto representa um único assunto.
---

# Commit e push das alterações

Analise o conteúdo das alterações antes de criar commits. Separe assuntos independentes e escreva uma mensagem significativa para cada conjunto. Depois de verificar os commits, faça o push para o destino correto e confirme o resultado.

Invocar esta skill para executar o fluxo autoriza os commits e o push correspondentes. Não peça confirmação rotineira para cada grupo já abrangido pelo pedido. Um pedido para criar, editar ou explicar a skill não executa o fluxo de Git.

## 1. Entender o estado do repositório

Leia o `AGENTS.md` da raiz e os guias das áreas alteradas. Respeite o escopo e eventuais exclusões informados pelo usuário. Consulte, a partir da raiz:

```sh
git status --short --branch
git diff --stat
git diff
git diff --cached --stat
git diff --cached
git ls-files --others --exclude-standard
git log -8 --oneline
git branch -vv
git remote -v
```

Examine também o conteúdo dos arquivos novos; eles não aparecem no `git diff` comum. Analise adições, modificações, exclusões e renomeações, incluindo arquivos ocultos não ignorados. Em arquivos grandes ou binários, confira sua função, origem e relação com o assunto; não imprima dados binários no terminal.

Identifique a branch atual, o upstream, o destino de push e commits locais já existentes que ainda não foram enviados. Consulte a configuração de push quando ela diferir do upstream. Não presuma que todo repositório usa `main` ou que todo remoto é `origin`.

Se houver merge, rebase ou cherry-pick em andamento, conflitos não resolvidos, HEAD destacado ou destino ambíguo, resolva o estado com base na autorização e contexto disponíveis antes de commitar. Peça apenas a informação que não puder determinar com segurança. Não invente um remoto, crie um repositório remoto ou configure identidade Git fictícia para prosseguir.

Preserve o trabalho existente, inclusive alterações preparadas no index. Arquivos já staged também precisam ser compreendidos; não são motivo para juntar assuntos diferentes. Se for necessário reorganizar o stage, faça-o de forma pontual, preservando integralmente o conteúdo do diretório de trabalho. Não descarte mudanças nem use `reset --hard`, `clean`, restauração de arquivos ou stash automático como atalho.

## 2. Separar por assunto e dependência

Monte uma lista curta de grupos, com objetivo, arquivos ou trechos envolvidos e mensagem pretendida. Informe os grupos ao usuário como atualização de andamento e prossiga, sem transformar o planejamento em uma aprovação obrigatória.

Use estes critérios:

- Um commit deve representar uma mudança compreensível: uma funcionalidade, correção, renomeação do produto ou melhoria documental relacionada.
- Agrupe implementação, testes, dados e documentação que sejam necessários ao mesmo resultado. Não separe mecanicamente por extensão de arquivo, diretório ou quantidade de arquivos.
- Separe mudanças independentes mesmo quando estejam no mesmo arquivo. Use seleção de trechos, como `git add -p`, ou um patch preciso aplicado somente ao index quando apropriado.
- Ordene os commits pelas dependências. Cada commit deve permanecer coerente e utilizável após os anteriores, sem exigir arquivos deixados para um commit posterior.
- Se dois assuntos não puderem ser separados sem produzir um estado inválido ou uma divisão artificial, mantenha-os no mesmo grupo e explique a dependência na mensagem.
- Uma alteração pequena ou vários arquivos que tratem de **um único assunto** podem formar um único commit. Não imponha um número mínimo de commits e não use um commit único por conveniência quando existirem assuntos independentes.

Exemplos deste projeto: horário e iluminação podem formar um grupo funcional; expansão de uma rua deve reunir suas fotos, manifesto, geometria, renderização e testes; mudança do nome do jogo pode reunir interface, documentação e metadados; skills novas podem compor um grupo próprio. São exemplos de raciocínio, não uma divisão fixa para todas as execuções.

Não acrescente refatorações, reformatações ou correções alheias ao pedido durante a organização. Não inclua arquivos temporários, credenciais ou artefatos gerados sem relação com o projeto. Fotos originais em `maps/` e evidências permanentes em `reference/` fazem parte do acervo e não são descartáveis. Informe qualquer alteração deixada de fora e o motivo.

## 3. Preparar, conferir e criar cada commit

Para cada grupo, em ordem:

1. Prepare apenas os arquivos ou trechos correspondentes. Prefira caminhos explícitos com `git add -- <caminhos>`; use seleção parcial quando o arquivo contiver vários assuntos. Não execute `git add .` ou `git add -A` indiscriminadamente.
2. Confira **todo o conteúdo staged** com `git diff --cached`, o resumo e `git diff --cached --check`. Certifique-se de que nenhum arquivo previamente staged de outro grupo entrou por acidente.
3. Execute as verificações pertinentes. No Codó Sobrevive, consulte `tests/AGENTS.md`; mudanças de comportamento requerem os testes relacionados e alterações integradas devem passar por `npm test`. Mudanças apenas documentais exigem revisão de conteúdo e caminhos, sem testes artificiais.
4. Considere o que está realmente sendo commitado: testes executados com mudanças ainda não staged também disponíveis não provam que o commit intermediário funciona sozinho. Quando houver dependência incerta, verifique o estado preparado em uma cópia temporária isolada ou ajuste os grupos; não mexa destrutivamente no diretório de trabalho para testar.
5. Escreva uma mensagem que descreva a mudança concreta e seu propósito. Siga convenções existentes quando houver. Evite mensagens vagas como `updates`, `ajustes gerais` ou uma simples lista de arquivos.
6. Crie o commit e confira o resultado com `git show --stat --oneline HEAD`. Registre o hash e a mensagem antes de passar ao grupo seguinte.

Use um título curto, por exemplo `feat: ampliar Simeão até Henrique Figueiredo`. Quando necessário, acrescente um corpo explicando comportamento, motivo e validação. O “comentário” de cada conjunto é a **mensagem de commit**; não insira comentários irrelevantes nos arquivos de código.

Para mensagens com vários parágrafos, prefira um arquivo temporário com texto exato e `git commit -F <arquivo>`. Não interpole texto de documentação em comandos de shell sem escape apropriado. Remova o arquivo temporário após o uso.

Se um teste ou hook falhar, investigue antes de continuar. Corrija problemas pertinentes ao grupo; para falhas externas ou não relacionadas, informe a limitação sem mascarar o resultado. Não use `--no-verify` para ignorar verificações. Se um hook modificar arquivos, reavalie o diff e o stage antes de tentar novamente.

## 4. Conferir o conjunto e fazer push

Depois dos commits, revise o histórico criado e `git status`. Confirme que todas as alterações pretendidas foram incluídas e que as exclusões foram registradas. Faça a validação final adequada às mudanças, reutilizando resultados ainda válidos; não repita testes sem necessidade.

Atualize as referências do remoto escolhido com `git fetch <remoto>` e confira a relação entre a branch local e o destino. Inspecione a lista de commits que o push enviará, incluindo commits locais anteriores a esta execução. Se houver commits anteriores fora do escopo autorizado, esclareça o envio antes de publicá-los; não os esconda no resumo nem reescreva o histórico para contorná-los.

- Com destino estabelecido, envie explicitamente a branch atual ao remoto/branch confirmados.
- Sem upstream, use `git push --set-upstream <remoto> <branch>` quando esse destino puder ser determinado pelo contexto; pergunte somente se a escolha permanecer ambígua.
- Não envie todas as branches ou tags. Não use `--force`, `--force-with-lease` nem altere commits já publicados para completar este fluxo.
- Se o remoto avançou, faça fetch e examine a divergência. Integre as mudanças pela convenção do repositório, preservando commits publicados e mudanças locais; revalide o que a integração afetar antes de tentar novamente. Não faça `pull` cego nem resolva conflitos descartando um lado inteiro sem análise.
- Se houver falha de autenticação, permissão, proteção de branch ou rede, preserve os commits locais e informe o impedimento concreto. Não troque o destino nem declare sucesso. Uma rejeição por concorrência requer nova leitura do remoto, não repetição cega do push.

Confirme a conclusão do comando de push e que o destino remoto aponta para o commit esperado, usando a referência remota atualizada ou `git ls-remote` da branch específica. Confira o estado final e eventuais alterações que tenham surgido durante a execução. Uma nova alteração não deve ser incluída silenciosamente em um grupo já revisado.

## Entrega

Informe os commits criados com hash curto e mensagem, remoto/branch enviados, resultado das verificações e qualquer arquivo pendente ou bloqueio. Se não havia mudanças novas, não crie commit vazio: verifique se há commits locais pendentes abrangidos pelo pedido e envie-os quando cabível. Se tudo já estiver sincronizado, informe isso.

Conclua como sucesso somente após confirmar o push. Criar commits localmente é uma etapa intermediária; quando o envio estiver bloqueado, distinga claramente o que foi commitado do que chegou ao remoto.
