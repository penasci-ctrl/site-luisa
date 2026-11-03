# luisaalcantara.com

Site da artista Luisa Alcântara. Mesma estrutura do site da Marina Woisky: **Astro** gera HTML estático; o conteúdo vem do **Sanity** (painel gratuito); a **Cloudflare** hospeda e reconstrói o site sozinha quando a Luisa publica algo no painel. Custo mensal: R$ 0 (só o domínio).

```
Luisa (painel Sanity) ──publica──▶ webhook ──▶ Cloudflare reconstrói (~1 min)
                                                      │
Visitante ◀── luisaalcantara.com (HTML estático, rápido, bom para o Google)
```

## Desenho

Arial, um tamanho só (13 px), preto sobre branco. Menu fixo no meio da tela em modo diferença (lê sobre foto e sobre branco):
`Obras · Exposições · Sobre · Index` à esquerda, `E-mail · Instagram · [·] EN [ ] PT` à direita. Nome e © fixos nos cantos de baixo.

| Página | Endereço | O que tem |
|---|---|---|
| Obras | `/` | Capas centralizadas correndo no scroll por trás do menu. Ordem em *Configurações → Página Obras*. |
| Obra | `/obras/<slug>` | Ficha, audioguia por língua, textos/poemas da obra, fotos centralizadas. |
| Exposições | `/exposicoes` | Lista com miniatura no hover, filtro Individuais/Coletivas, Visão geral / Lista. |
| Exposição | `/exposicoes/<slug>` | Vistas, textos que abrem no lugar, obras na ordem do percurso com audioguia. |
| Sobre | `/sobre` | Bio, galeria, contato, CV (as exposições entram sozinhas, a partir do cadastro). |
| Index | `/indice` | Todas as obras, com filtros combináveis: ano, série, técnica, língua, colaborador, exposição. |

Inglês em `/en/…` (mesmo arquivo gera as duas línguas).

## Estrutura

| Pasta | O que é |
|---|---|
| `src/pages/[...lang]/` | Páginas. Português na raiz, inglês em `/en/`. |
| `src/layouts/Base.astro` | Moldura comum: menu central, cantos, SEO (canonical, hreflang, Open Graph, schema.org Person). |
| `src/components/AudioGuide.astro` | Audioguia: escolha da língua em colchetes, créditos, tocar/pausar, transcrição. |
| `src/styles/global.css` | Todo o sistema visual. |
| `src/lib/content.js` | Busca o conteúdo no Sanity na hora do build (uma consulta GROQ). |
| `src/data/seed.mjs` | Conteúdo migrado do site antigo. Usado sem Sanity e para a importação. |
| `public/seed/` | Fotos e áudios do site antigo. |
| `studio/` | O painel (Sanity Studio). Tipos de conteúdo em `studio/schemaTypes/`. |
| `worker/index.js` | Rotas `/api/translate` e `/api/describe` para os botões de IA do painel (Workers AI, gratuito). |
| `scripts/import-seed.mjs` | Sobe o conteúdo inicial para o Sanity (uma vez). |

### Tipos de conteúdo no painel

Obras · Exposições · Textos e poemas · Colaboradores · Materiais · Sobre · Configurações.
Colaboradores e Materiais são documentos próprios (escolhidos numa lista) para que cada nome exista uma vez só: é isso que mantém os filtros do Index certos.

## Rodar no computador

```bash
npm install
npm run dev          # http://localhost:4321 — sem .env usa o conteúdo inicial
```

Painel local: `cd studio && npm install && SANITY_STUDIO_PROJECT_ID=xxxx npm run dev` (http://localhost:3333).

## Colocar no ar (uma vez)

1. **Sanity.** Crie um projeto em sanity.io (plano Free, dataset `production`, público). Anote o *Project ID* e coloque-o em `studio/sanity.cli.js`, `studio/sanity.config.js` e `src/lib/content.js` (ou só nas variáveis de ambiente).
2. **Painel.** `cd studio && npm install && SANITY_STUDIO_PROJECT_ID=xxxx npx sanity deploy`. O painel fica em `https://luisaalcantara.sanity.studio`. Convide a Luisa em sanity.io/manage → Members (papel *Editor*).
3. **Conteúdo inicial.** Em sanity.io/manage → API → Tokens, crie um token *Editor* e rode na raiz:
   `SANITY_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=yyyy npm run import:seed`. Sobe 8 obras, 16 exposições, 3 textos, 31 colaboradores, 13 materiais, ~80 MB de áudio. Depois apague o token.
4. **Cloudflare.** Workers & Pages → Create → Import a repository → este repositório.
   Build command `npm run build` · Deploy command `npx wrangler deploy` · Variáveis: `SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `NODE_VERSION=20`.
5. **Publicação automática.** Na Cloudflare: Settings → Builds → Deploy hooks → criar (branch `main`) e copiar o endereço.
   No Sanity: sanity.io/manage → API → Webhooks → Create: URL = o deploy hook, Dataset `production`, Trigger on create/update/delete, HTTP POST, sem payload.
6. **Botões de IA do painel.** Conferir que o endereço do Worker em `studio/ai.jsx` (`API`) é o que a Cloudflare criou, e redeployar o painel.
7. **CORS.** sanity.io/manage → API → CORS origins: o endereço `*.workers.dev`, `luisaalcantara.com`, `www.luisaalcantara.com`, `localhost:4321`.
8. **Domínio.** Cloudflare → Custom domains → `luisaalcantara.com`. Os endereços antigos (`work1.html`…) já redirecionam (`public/_redirects`).

## Critério de aceite

A Luisa cadastra uma obra nova com foto e uma faixa de áudio no painel, publica, e em até 2 minutos ela aparece em Obras, no Index (com os filtros certos) e na exposição; depois consegue editar ou apagar.

## Pendências herdadas do site antigo

- *Stalker I*: o áudio em espanhol apontava para um arquivo de *Stalker III* que não existe na pasta; ficou fora. O áudio em inglês tinha o nome do arquivo com maiúscula errada (no ar, quebrava em servidores que diferenciam maiúsculas).
- *Stalker II*: existe `s2_espanhol.mp3` na pasta, mas o site antigo não mostrava nem dava créditos. Entrou sem créditos.
- *Nathaniel Prym*: as línguas das faixas foram deduzidas dos nomes dos arquivos (E, P, I, G). Conferir.
- *Stalker V*: as quatro faixas têm exatamente a mesma duração (2:25). Conferir se são arquivos diferentes.
- *Rish*: sem fotos, sem áudio e com a ficha em branco. Entrou escondida.
- O poema de *Stalker III* tem versões em francês e espanhol no site antigo; o painel guarda PT e EN. A versão em francês tinha palavras em português/espanhol misturadas.
- O retrato do site antigo tem 198 × 220 px, pequeno demais: não entrou.
