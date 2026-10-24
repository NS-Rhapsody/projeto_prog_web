<script>
    import ProdutoDAO from "$lib/dao/ProdutoDAO.js";
    
    let produto = $state(null);
    let produtos = $state([]);

    async function carregarProdutos() {
        const dao = new ProdutoDAO();

        produtos = await dao.obterTodas();

        console.log(produtos);
    }

    async function buscarProduto() {
        const dao = new ProdutoDAO();

        produto = await dao.obter("2");

        console.log(produto);
    }

    async function cadastrarProduto() {
        console.log("1 - Botão clicado");

    const dao = new ProdutoDAO();

    try {
        const id = await dao.inserir(
            "Teclado",
            80,
            5
        );

    } catch (erro) {
        console.error("ERRO: ", erro);
    }
}

    async function atualizarProduto() {
        const dao = new ProdutoDAO();

        await dao.atualizar(
            "Miniatura de Dragão",
            120,
            8,
            "BMtVJfr7uqJmdDOnhULZ"
        );

        console.log("Produto atualizado");
    }

    async function removerProduto() {
        const dao = new ProdutoDAO();

        await dao.remover("2");

        console.log("Produto removido");
    }
    carregarProdutos()
</script>

<button onclick={buscarProduto}>
    Buscar produto
</button>

<button onclick={carregarProdutos}>
    Carregar produtos
</button>

<button onclick={cadastrarProduto}>
    Cadastrar produto
</button>

<button onclick={atualizarProduto}>
    Atualizar produto
</button>

<button onclick={removerProduto}>
    Remover produto
</button>

{#if produto}
    <h2>Produto encontrado</h2>

    <p>Nome: {produto.nome}</p>
    <p>Preço: R$ {produto.preco}</p>
    <p>Estoque: {produto.estoque}</p>
{:else}
    <p>Nenhum produto selecionado.</p>
{/if}

<h2>Produtos cadastrados</h2>

{#each produtos as produto}
    <p>
        {produto.id} -
        {produto.nome} -
        R$ {produto.preco} -
        Estoque: {produto.estoque}
    </p>
{/each}
<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Empório Arcano — Acessórios para RPG de Mesa</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Figtree:wght@400;500;600;700&family=MedievalSharp&display=swap"
    >
</svelte:head>
<svg class="sprite" width="0" height="0" aria-hidden="true">
<symbol id="i-x" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
<symbol id="i-bag" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol>
<symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
<symbol id="i-flame" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.4 1-3 .5 1.100 1.500 2.500 2.500 2.500z"/></symbol>
<symbol id="i-scroll" viewBox="0 0 24 24"><path d="M15 12h-5M15 8h-5M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></symbol>
<symbol id="i-insta" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.500 6.500h.01"/></symbol>
<symbol id="i-yt" viewBox="0 0 24 24"><path d="M2.500 17a24.100 24.100 0 0 1 0-10 2 2 0 0 1 1.400-1.400 49.600 49.600 0 0 1 16.200 0A2 2 0 0 1 21.500 7a24.100 24.100 0 0 1 0 10 2 2 0 0 1-1.400 1.400 49.600 49.600 0 0 1-16.200 0A2 2 0 0 1 2.500 17"/><path d="m10 15 5-3-5-3z"/></symbol>
</svg>

<header class="header">
  <a class="header__logo" href="#/" aria-label="Empório Arcano — página inicial">
    <svg class="icon header__logo-icon" aria-hidden="true"><use href="#i-x"/></svg>
    <span>
      <span class="header__brand">EMPÓRIO ARCANO</span><br>
      <span class="header__tagline">Acessórios para RPG de Mesa</span>
    </span>
  </a>
  <nav class="nav" id="nav" aria-label="Navegação principal">
    <ul class="nav__list">
      <li><a href="#/">Home</a></li>
      <li><a href="#categorias">Miniaturas</a></li>
      <li><a href="#categorias">Suplementos</a></li>
      <li><a href="#categorias">Mapas</a></li>
      <li><a href="#categorias">Dados</a></li>
      <li><a href="#categorias">Literatura</a></li>
    </ul>
  </nav>
  <div class="header__actions">
    <button class="header__search" type="button" aria-label="Buscar"><svg class="icon" aria-hidden="true"><use href="#i-search"/></svg></button>
    <button class="header__cart" type="button"><svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg><span class="header__cart-label">CARRINHO </span>(3)</button>
  </div>
  <button class="header__toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu">
    <span class="header__bar"></span><span class="header__bar"></span><span class="header__bar"></span>
  </button>
</header>

<main id="top" data-page="home">
  <section class="hero">
    <div class="hero__intro">
      <span class="badge"><svg class="icon" aria-hidden="true"><use href="#i-sparkles"/></svg>Novidades da Semana</span>
      <h1 class="hero__title">Acessórios para sua Mesa de RPG</h1>
      <p class="hero__text">Encontre dados, miniaturas em resina de alta qualidade, mapas detalhados e muito mais para tornar suas sessões inesquecíveis.</p>
    </div>
    <div class="hero__cta">
      <a class="btn" href="#/produtos">Ver Todos os Produtos</a>
      <a class="btn btn--ghost" href="#historia">Conheça Nossa História</a>
    </div>
    <ul class="hero__trust">
      <li class="hero__trust-item"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Garantia de Qualidade</li>
      <li class="hero__trust-item"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Envio Rápido para Todo Brasil</li>
      <li class="hero__trust-item"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Atendimento Rápido por E-mail</li>
    </ul>
  </section>

  <section class="section" id="categorias" aria-labelledby="categorias-title">
    <div class="section__head">
      <p class="eyebrow">Nossos Produtos</p>
      <h2 class="title" id="categorias-title">Explore Nossas Categorias</h2>
    </div>
    <div class="categories__grid">
      <a class="category" href="#/produtos"><h3 class="category__name">Dados</h3><p class="category__count">140+ Produtos</p></a>
      <a class="category" href="#/produtos"><h3 class="category__name">Miniaturas</h3><p class="category__count">320+ Produtos</p></a>
      <a class="category" href="#/produtos"><h3 class="category__name">Mapas de RPG</h3><p class="category__count">45+ Produtos</p></a>
      <a class="category" href="#/produtos"><h3 class="category__name">Livros &amp; Suplementos</h3><p class="category__count">80+ Produtos</p></a>
      <a class="category" href="#/produtos"><h3 class="category__name">Acessórios de Mesa</h3><p class="category__count">110+ Produtos</p></a>
    </div>
  </section>

  <section class="section" id="produtos" aria-labelledby="produtos-title">
    <div class="divider" aria-hidden="true">
      <span class="divider__line"></span>
      <span class="divider__center"><svg class="icon"><use href="#i-x"/></svg>Novos Produtos<svg class="icon"><use href="#i-x"/></svg></span>
      <span class="divider__line"></span>
    </div>
    <div class="section__head section__head--row">
      <div class="section__head">
        <p class="eyebrow">Os Mais Procurados</p>
        <h2 class="title" id="produtos-title">Produtos Recomendados para Você</h2>
      </div>
      <a class="btn btn--ghost" href="#/produtos">Ver Tudo</a>
    </div>
    <div class="products__grid">
        {#each produtos as produto}
    <article class="product">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=" "><span class="badge product__badge"><svg class="icon"><use href="#i-flame"/></svg>Pouca quantidade</span></div>
          <div class="product__info"><h3 class="product__name">{produto.nome}</h3><p class="product__desc">{produto.descricao}.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ {produto.preco}</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
    {/each}
    </div>
  </section>

  <section class="lore" id="historia" aria-labelledby="historia-title">
    <div class="lore__content">
      <div class="section__head">
        <p class="eyebrow">Nossa História</p>
        <h2 class="lore__title" id="historia-title">Nascida da Paixão por RPG de Mesa</h2>
      </div>
      <p class="lore__text">O Empório Arcano nasceu da paixão de um grupo de jogadores de RPG que não encontrava acessórios de qualidade no Brasil. Tudo começou em uma garagem, com resina, ferramentas e muita criatividade. Hoje, somos referência em acessórios artesanais para RPG de mesa. Acreditamos que a qualidade dos materiais — o toque do couro, o peso dos dados, o design do escudo do mestre — transforma a experiência de jogo. Nossas peças são feitas para durar e impressionar em cada sessão.</p>
      <div class="lore__author">
        <div>
          <img class="lore__avatar" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Retrato de José Flávio, fundador do Empório Arcano">
          <p class="lore__name">José Flávio</p>
          <p class="lore__role">Fundador &amp; Designer de Produto</p>
        </div>
        <span class="lore__sep" aria-hidden="true"></span>
        <blockquote class="lore__quote">"Nosso objetivo é que cada produto traga mais imersão para sua mesa de RPG."</blockquote>
      </div>
    </div>
    <div class="lore__visual"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Oficina artesanal do Empório Arcano com peças de resina para RPG"></div>
  </section>
</main>

<main id="catalogo" data-page="products" hidden>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="#/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Todos os Produtos</span>
  </nav>
  <section class="catalog" aria-label="Catálogo de produtos">
    <aside class="sidebar" aria-label="Filtros">
      <div class="filter">
        <h2 class="filter__title">Categorias</h2>
        <ul class="filter__list"><li class="filter__item is-active"><a href="#/produtos">Todos os Produtos</a><span class="filter__count">(120)</span></li><li class="filter__item"><a href="#/produtos">Dados de Resina e Metal</a><span class="filter__count">(42)</span></li><li class="filter__item"><a href="#/produtos">Miniaturas de Alta Resolução</a><span class="filter__count">(35)</span></li><li class="filter__item"><a href="#/produtos">Mapas de Batalha</a><span class="filter__count">(15)</span></li><li class="filter__item"><a href="#/produtos">Livros e Suplementos</a><span class="filter__count">(12)</span></li><li class="filter__item"><a href="#/produtos">Acessórios de Mesa</a><span class="filter__count">(10)</span></li><li class="filter__item"><a href="#/produtos">Escudos do Mestre</a><span class="filter__count">(6)</span></li></ul>
      </div>
      <hr class="sidebar__line">
    </aside>
    <div class="listing">
      <div class="toolbar">
        <p class="toolbar__count">Exibindo <strong>12</strong> de 120 produtos</p>
        <button class="toolbar__sort" type="button" aria-haspopup="listbox"><span class="toolbar__sort-label">Ordenar por:</span><strong>Mais Vendidos</strong><svg class="icon" aria-hidden="true"><use href="#i-chev"/></svg></button>
      </div>
      <div class="listing__grid">
      <article class="product product--compact product--featured">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Set de dados de resina Olho de Dragão com detalhes em ouro"><span class="badge product__badge"><svg class="icon"><use href="#i-flame"/></svg>Mais Vendido</span></div>
          <div class="product__info"><h3 class="product__name">Set de Dados Olho de Dragão</h3><p class="product__desc">Set completo com 7 dados de resina polidos individualmente à mão, design exclusivo com detalhes em ouro.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 59,90</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Torre de dados em resina com acabamento em pedra escura"><span class="badge product__badge"><svg class="icon"><use href="#i-sparkles"/></svg>Novidade</span></div>
          <div class="product__info"><h3 class="product__name">Torre de Dados em Resina</h3><p class="product__desc">Torre estrutural para rolagem segura em resina de alta densidade, com acabamento em pedra escura esculpida.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 149,90</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Caderno de couro envelhecido com fecho de fivela dourada"><span class="badge product__badge"><svg class="icon"><use href="#i-sparkles"/></svg>Premium</span></div>
          <div class="product__info"><h3 class="product__name">Caderno de Couro envelhecido</h3><p class="product__desc">Caderno artesanal de couro legítimo envelhecido com fecho de fivela metálica dourada. Perfeito para registrar campanhas.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 119,90</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Escudo do mestre em madeira maciça com painéis dobráveis"><span class="badge product__badge"><svg class="icon"><use href="#i-sparkles"/></svg>Edição Limitada</span></div>
          <div class="product__info"><h3 class="product__name">Escudo do Mestre em Madeira Rústica</h3><p class="product__desc">Escudo imponente em madeira maciça com 4 painéis dobráveis e detalhes em dobradiças de metal dourado escuro.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 219 ,00</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Miniatura do Guardião esculpida em resina"><span class="badge product__badge"><svg class="icon"><use href="#i-sparkles"/></svg>Edição Limitada</span></div>
          <div class="product__info"><h3 class="product__name">Miniatura do Guardião de Resina</h3><p class="product__desc">Miniatura detalhada em resina pura de alta resolução com base de exibição inclusa.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 29,00</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact product--featured">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Set de dados metálicos dourados com gravação rúnica"><span class="badge product__badge"><svg class="icon"><use href="#i-flame"/></svg>Mais Vendido</span></div>
          <div class="product__info"><h3 class="product__name">Set de Dados Metálicos Dourados</h3><p class="product__desc">Dados de liga metálica ultra duráveis com gravação rúnica nítida e acabamento polido.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 110,90</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Mapa de batalha laminado com grade dupla face"><span class="badge product__badge"><svg class="icon"><use href="#i-sparkles"/></svg>Novidade</span></div>
          <div class="product__info"><h3 class="product__name">Mapa de Batalha Apagável Dupla Face</h3><p class="product__desc">Mapa de battle grid laminado à prova d&#39;água com duas estampas para combates dinâmicos.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 89,90</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Bandeja hexagonal de couro para rolagem de dados"></div>
          <div class="product__info"><h3 class="product__name">Bandeja de Dados de Couro Macio</h3><p class="product__desc">Bandeja hexagonal dobrável com forro de veludo macio para amortecer as rolagens.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 59,90</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Caixa de madeira cortada a laser para cartas de RPG"></div>
          <div class="product__info"><h3 class="product__name">Organizador de Cartas de RPG</h3><p class="product__desc">Caixa em madeira cortada a laser para armazenar fichas, cartas de magias e marcadores.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 39,00</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Miniatura de guerreiro mercenário em resina pintada"></div>
          <div class="product__info"><h3 class="product__name">Miniatura Guerreiro de Resina Pintada</h3><p class="product__desc">Guerreiro mercenário pronto para sua mesa com acabamento de pintura profissional.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 45,00</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Bolsa de veludo com cordão para dados"></div>
          <div class="product__info"><h3 class="product__name">Bolsa de Dados em Veludo</h3><p class="product__desc">Bolsa protetora com cordão resistente e capacidade para mais de 50 dados.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 39,00</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      <article class="product product--compact">
        <div>
          <div class="product__media"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Livro suplemento de campanha ilustrado"><span class="badge product__badge"><svg class="icon"><use href="#i-sparkles"/></svg>Novidade</span></div>
          <div class="product__info"><h3 class="product__name">Livro Suplemento de Campanha</h3><p class="product__desc">Suplemento físico de campanha ricamente ilustrado para expansão de campanhas.</p></div>
        </div>
        <div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">R$ 120,00</span></p><button class="btn btn--block" type="button">Adicionar ao Carrinho</button></div>
      </article>
      </div>
      <nav class="pagination" aria-label="Paginação">
        <a class="pagination__btn" href="#/produtos">Anterior</a>
        <a class="pagination__btn pagination__btn--active" href="#/produtos" aria-current="page">1</a>
        <a class="pagination__btn pagination__btn--muted" href="#/produtos">2</a>
        <a class="pagination__btn pagination__btn--muted" href="#/produtos">3</a>
        <span class="pagination__gap">...</span>
        <a class="pagination__btn" href="#/produtos">Próxima</a>
      </nav>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="footer__main">
    <div class="footer__brand">
      <p class="footer__logo"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg><span class="only-home">Empório Arcano</span><span class="only-products">FORJA DO DRAGÃO</span></p>
      <p class="footer__about">Acessórios de alta qualidade para RPG de mesa. Produtos artesanais feitos com paixão e dedicação.</p>
      <div class="footer__social only-home">
        <a class="footer__social-link" href="#top" aria-label="Instagram"><svg class="icon"><use href="#i-insta"/></svg></a>
        <a class="footer__social-link" href="#top" aria-label="YouTube"><svg class="icon"><use href="#i-yt"/></svg></a>
        <a class="footer__social-link" href="#top" aria-label="Rede social"><svg class="icon"><use href="#i-x"/></svg></a>
      </div>
    </div>
    <nav class="footer__col" aria-label="Produtos">
      <h3 class="footer__heading">Produtos</h3>
      <a href="#produtos">Dados</a><a href="#produtos">Cadernos de Couro</a><a href="#produtos">Miniaturas Pintadas</a><a href="#produtos">Escudos de Mestre</a><a href="#produtos">Mapas</a>
    </nav>
    <nav class="footer__col" aria-label="Institucional">
      <h3 class="footer__heading">Institucional</h3>
      <a href="#historia">Sobre Nós</a><a href="#top">Atendimento</a><a href="#top">Envio e Entrega</a><a href="#top">Trocas e Devoluções</a><a href="#top">FAQ</a>
    </nav>
    <div class="footer__col footer__col--wide">
      <h3 class="footer__heading">Pagamento Seguro</h3>
      <p class="footer__text">Suas compras são protegidas com criptografia de ponta a ponta. Aceitamos diversas formas de pagamento.</p>
      <div class="footer__pay"><span class="footer__pay-item">Pix</span><span class="footer__pay-item">Boleto</span><span class="footer__pay-item">Cartão Credito</span></div>
    </div>
  </div>
  <div class="footer__bottom">
    <p>© 2026 Empório Arcano RPG Ltda. Todos os direitos reservados.</p>
    <div class="footer__legal"><a href="#top">Termos de Uso</a><a href="#top">Política de Privacidade</a></div>
  </div>
</footer>
