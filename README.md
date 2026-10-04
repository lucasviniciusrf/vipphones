# Vip Phones — movimento e abertura 3D · V5.2

Continuação da direção visual aprovada da V4, em React e Vite: marca oficial, azul institucional, fundo claro e vitrine comercial. A V5 acrescenta cenas 3D reais com Three.js e animações de rolagem com GSAP.

## Movimento desta versão

- **Refinamento V5.2:** navbar e rodapé com degradês suaves entre branco e azul claro; marca em azul nos fundos claros. A logo usa um enquadramento proporcional que mantém o nome, o símbolo e o subtítulo completos, sem alterar o arquivo original. Na abertura, a tampa se desloca menos e a câmera reserva espaço conforme a proporção da cena.

- **Primeira tela:** a tampa sobe e se afasta; em seguida o iPhone sai. A embalagem deixa a cena antes de três camadas transparentes se separarem sobre a tela. A abertura acontece uma vez por carregamento. A cena responde discretamente ao mouse e à rolagem.
- **Celular:** título → cena 3D → texto e ações. A animação aparece logo no início da página.
- **Experiência de scroll:** cena fixa enquanto a rolagem gira o aparelho e apresenta três etapas. Frente/lateral/traseira têm controles próprios; o aparelho também pode ser arrastado.
- **Outros movimentos:** entrada do título, revelação de seções, perspectiva dos cards e abertura do modal.
- O bloco com cartões genéricos do Instagram foi removido. Links para o perfil continuam no conteúdo sobre a loja e no rodapé.
- Na abertura, o aparelho aparece com a tela apagada; a tampa mantém a arte colorida. Botões e links perderam as setas decorativas. Apenas os controles do carrossel conservam indicadores de direção.
- A cena da abertura tem fundo transparente sobre o branco uniforme da página. Foram removidos o botão de replay e os textos "Continue em 3D" e "Design para escolher de perto".
- Com preferência de movimento reduzido, a abertura aparece em sua composição final e as animações automáticas são desativadas. O scroll continua normal, sem prender a página.
- O motor 3D usa importação dinâmica compartilhada; a segunda cena carrega quando se aproxima da tela. A renderização pausa fora da área visível e a resolução é limitada a 1,65×. Sem WebGL, com falha do modelo ou perda de contexto, há imagem de apoio.

As camadas e a caixa são uma **composição visual ilustrativa**, criada em geometria 3D a partir das referências enviadas. Não representam uma desmontagem técnica, um kit de acessórios ou embalagem confirmada da loja. O modelo 3D é um iPhone 15 Pro Max; a vitrine usa referências da linha 16.

## Arquivos de movimento

- `src/components/HeroOpeningScene.jsx`: caixa, tampa, camadas, luz e abertura.
- `src/components/ScrollExperience.jsx`: etapas e progressão de scroll.
- `src/components/PhoneScene.jsx`: rotação, arraste e controles do aparelho.
- `src/three/phoneModel.js`: preparação compartilhada do modelo e wallpaper procedural.
- `src/usePageMotion.js`, `src/motion.css`, `src/hero-motion.css`: movimentos e composição responsiva.

## Crédito do modelo 3D

Modelo **iPhone 15 Pro Max**, de **MpPower**, sob **CC BY 4.0**, conforme os metadados do GLB. Fonte original e licença em `src/assets/models/ATTRIBUTION.md`; crédito visível no rodapé. Foram ajustados materiais, cor, tela e enquadramento durante a renderização. Mantenha a atribuição na publicação.

## Executar

```bash
npm install
npm run dev
npm run build
npm run preview
```

O ZIP inclui o código e a pasta `dist/` compilada. Para publicar, use o conteúdo de `dist/` em uma hospedagem estática. Para editar, altere `src/` e execute um novo build.

## Verificação

Build de produção concluído. Inspeção visual em 1440×900, 390×844 e no tamanho normal do navegador: abertura, tela apagada, composição de camadas e cena de scroll. Não foram encontrados erros de JavaScript no console nem transbordamento horizontal nesses tamanhos. O pacote 3D compartilhado gera um aviso de tamanho no Vite; ele é carregado por importação dinâmica.

## O que foi corrigido

- Logo original enviada pelo usuário, apresentada por um filtro SVG em azul sobre fundos claros e branco no painel institucional, sem o recorte fixo anterior.
- Hero com fotografia oficial de um iPhone, em vez de aparelho desenhado em CSS.
- Vitrine logo após a primeira seção e a barra de informações.
- Cards grandes, carrossel com rolagem horizontal e detalhe do aparelho em modal.
- Seleção de capacidade e cor de interesse, com mensagem contextual para o WhatsApp.
- Layout claro, tipografia leve e movimento focado no produto.
- Contato centralizado em `src/config/store.js`.

## Fontes e limites

| Item | Fonte | Uso |
| --- | --- | --- |
| Logo | Imagem anexada pelo usuário nesta conversa | Ativo de marca local |
| Instagram e WhatsApp | Captura do perfil `@vipphonescg_` anexada pelo usuário; link mostrado: `api.whatsapp.com/send?phone=5583996652577` | Links do protótipo; confirme antes de publicar |
| Imagem iPhone 16 ultramarino | [Apple Newsroom](https://www.apple.com/newsroom/2024/09/apple-introduces-iphone-16-and-iphone-16-plus/) | Referência visual |
| Imagem das cores da linha iPhone 16 | [Apple Newsroom](https://www.apple.com/newsroom/2024/09/apple-introduces-iphone-16-and-iphone-16-plus/) | Referência visual |
| Imagem da linha iPhone 16 Pro | [Apple Newsroom](https://www.apple.com/newsroom/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/) | Referência visual |

As imagens de produto foram salvas em `src/assets/products/`. O direito de uso comercial das imagens da Apple não foi confirmado: substitua por fotografias próprias da Vip Phones ou por mídia com licença adequada antes da publicação.

Os modelos são **referências para consulta**. Não representam estoque, preço, cor disponível ou condição do aparelho na loja. As capacidades, cores e especificações vêm das páginas do fabricante e servem para compor a conversa com a equipe.

O endereço, horário, avaliações e catálogo atual não foram confirmados pelo perfil oficial acessível nesta revisão. Por isso, não há mapa, nota de avaliação, depoimentos ou promoção na interface. Uma publicação de entrega grátis mostrada pelo usuário é de 2021 e não foi usada como oferta atual. Um cadastro empresarial de terceiros apresentou telefone diferente do link do perfil; esse telefone também não foi usado.

## Próximos dados da loja

Para transformar esta proposta visual em site comercial definitivo, confirme com a Vip Phones: catálogo vigente, fotos próprias de cada modelo, preço/condição, endereço, horário, regras de troca, avaliações autorizadas e permissão de uso das imagens.
