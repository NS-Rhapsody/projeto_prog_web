<script>
	import { onMount } from 'svelte';

	let products = $state([]);
	let loading = $state(true);
	let errorMessage = $state('');
	let featuredProducts = $derived(products.filter((product) => product.destacado).slice(0, 4));
	const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

	onMount(async () => {
		try {
			const { default: ProdutoDAO } = await import('$lib/dao/produtoDAO.js');
			products = await new ProdutoDAO().obterPublicados();
		} catch {
			errorMessage = 'Não foi possível carregar os produtos. Tente novamente mais tarde.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head><title>Empório Arcano — Acessórios para RPG de Mesa</title></svelte:head>

<main id="top">
	<section class="hero">
		<div class="hero__intro">
			<span class="badge"><svg class="icon" aria-hidden="true"><use href="#i-sparkles" /></svg>Novidades da Semana</span>
			<h1 class="hero__title">Acessórios para sua Mesa de RPG</h1>
			<p class="hero__text">Encontre dados, miniaturas em resina de alta qualidade, mapas detalhados e muito mais para tornar suas sessões inesquecíveis.</p>
		</div>
		<div class="hero__cta"><a class="btn" href="/produtos">Ver Todos os Produtos</a><a class="btn btn--ghost" href="#historia">Conheça Nossa História</a></div>
		<ul class="hero__trust">
			<li class="hero__trust-item"><svg class="icon" aria-hidden="true"><use href="#i-check" /></svg>Garantia de Qualidade</li>
			<li class="hero__trust-item"><svg class="icon" aria-hidden="true"><use href="#i-check" /></svg>Envio Rápido para Todo Brasil</li>
			<li class="hero__trust-item"><svg class="icon" aria-hidden="true"><use href="#i-check" /></svg>Atendimento Rápido por E-mail</li>
		</ul>
	</section>

	<section class="section" id="categorias" aria-labelledby="categorias-title">
		<div class="section__head"><p class="eyebrow">Nossos Produtos</p><h2 class="title" id="categorias-title">Explore Nossas Categorias</h2></div>
		<div class="categories__grid">
			<a class="category" href="/produtos"><h3 class="category__name">Dados</h3><p class="category__count">140+ Produtos</p></a>
			<a class="category" href="/produtos"><h3 class="category__name">Miniaturas</h3><p class="category__count">320+ Produtos</p></a>
			<a class="category" href="/produtos"><h3 class="category__name">Mapas de RPG</h3><p class="category__count">45+ Produtos</p></a>
			<a class="category" href="/produtos"><h3 class="category__name">Livros &amp; Suplementos</h3><p class="category__count">80+ Produtos</p></a>
			<a class="category" href="/produtos"><h3 class="category__name">Acessórios de Mesa</h3><p class="category__count">110+ Produtos</p></a>
		</div>
	</section>

	<section class="section" id="produtos" aria-labelledby="produtos-title">
		<div class="divider" aria-hidden="true"><span class="divider__line"></span><span class="divider__center"><svg class="icon"><use href="#i-x" /></svg>Novos Produtos<svg class="icon"><use href="#i-x" /></svg></span><span class="divider__line"></span></div>
		<div class="section__head section__head--row"><div class="section__head"><p class="eyebrow">Os Mais Procurados</p><h2 class="title" id="produtos-title">Produtos Recomendados para Você</h2></div><a class="btn btn--ghost" href="/produtos">Ver Tudo</a></div>
		{#if loading}
			<p class="catalog-message" role="status">Carregando produtos…</p>
		{:else if errorMessage}
			<p class="catalog-message form-message--error" role="alert">{errorMessage}</p>
		{:else if products.length === 0}
			<p class="catalog-message">Em breve, novos produtos estarão disponíveis.</p>
		{:else}
			<div class="products__grid">
				{#each (featuredProducts.length ? featuredProducts : products.slice(0, 4)) as product (product.id)}
					<article class="product" class:product--featured={product.destacado}>
						<div><div class="product__media"><img class="ph" src={product.imagemUrl} alt={product.nome} loading="lazy" />{#if product.selo}<span class="badge product__badge"><svg class="icon"><use href={product.selo === 'Mais Vendido' ? '#i-flame' : '#i-sparkles'} /></svg>{product.selo}</span>{/if}</div><div class="product__info"><h3 class="product__name">{product.nome}</h3><p class="product__desc">{product.descricao}</p></div></div>
						<div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">{formatPrice(product.preco)}</span></p><p class="product-stock">{product.estoque > 0 ? `${product.estoque} em estoque` : 'Sem estoque'}</p></div>
					</article>
				{/each}
			</div>
		{/if}
	</section>

	<section class="stats" aria-label="Números da loja"><div class="stats__row">
		<div class="stat"><p class="stat__value">10k+</p><div class="stat__body"><h3 class="stat__label">Clientes Satisfeitos</h3><p class="stat__text">Mestres e jogadores que melhoraram suas sessões com nossos acessórios.</p></div></div>
		<div class="stat"><p class="stat__value">50k+</p><div class="stat__body"><h3 class="stat__label">Dados Vendidos</h3><p class="stat__text">Cada dado passa por inspeção de qualidade para garantir balanceamento perfeito.</p></div></div>
		<div class="stat"><p class="stat__value">100%</p><div class="stat__body"><h3 class="stat__label">Entregas Realizadas</h3><p class="stat__text">Entregas rastreadas com embalagem segura para todo o território nacional.</p></div></div>
		<div class="stat"><p class="stat__value">4.9</p><div class="stat__body"><h3 class="stat__label">Nota dos Clientes</h3><p class="stat__text">Avaliação média dos nossos clientes em lojas e marketplaces.</p></div></div>
	</div></section>

	<section class="lore" id="historia" aria-labelledby="historia-title"><div class="lore__content"><div class="section__head"><p class="eyebrow">Nossa História</p><h2 class="lore__title" id="historia-title">Nascida da Paixão por RPG de Mesa</h2></div><p class="lore__text">O Empório Arcano nasceu da paixão de um grupo de jogadores de RPG que não encontrava acessórios de qualidade no Brasil. Tudo começou em uma garagem, com resina, ferramentas e muita criatividade. Hoje, somos referência em acessórios artesanais para RPG de mesa. Acreditamos que a qualidade dos materiais — o toque do couro, o peso dos dados, o design do escudo do mestre — transforma a experiência de jogo. Nossas peças são feitas para durar e impressionar em cada sessão.</p><div class="lore__author"><div><img class="lore__avatar" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Retrato de José Flávio, fundador do Empório Arcano" /><p class="lore__name">José Flávio</p><p class="lore__role">Fundador &amp; Designer de Produto</p></div><span class="lore__sep" aria-hidden="true"></span><blockquote class="lore__quote">"Nosso objetivo é que cada produto traga mais imersão para sua mesa de RPG."</blockquote></div></div><div class="lore__visual"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Oficina artesanal do Empório Arcano com peças de resina para RPG" /></div></section>

	<section class="section" aria-labelledby="depoimentos-title"><div class="divider" aria-hidden="true"><span class="divider__line"></span><span class="divider__center"><svg class="icon"><use href="#i-x" /></svg>Depoimentos<svg class="icon"><use href="#i-x" /></svg></span><span class="divider__line"></span></div><div class="section__head section__head--center"><p class="eyebrow">O que dizem nossos clientes</p><h2 class="title" id="depoimentos-title">Avaliações de Quem Já Comprou</h2></div><div class="reviews">
		<figure class="review"><blockquote class="review__text">"Os dados de obsidiana são incríveis! O balanceamento é perfeito e o acabamento é lindo. Virou item obrigatório nas minhas sessões."</blockquote><figcaption class="review__author"><span class="review__avatar"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Foto de Lucas Martins" /></span><span class="review__name">Lucas Martins</span></figcaption></figure>
		<figure class="review"><blockquote class="review__text">"O escudo do mestre em madeira é simplesmente sensacional. Meus jogadores ficaram impressionados com a qualidade. Vale muito o investimento."</blockquote><figcaption class="review__author"><span class="review__avatar"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Foto de Pedro Henrique" /></span><span class="review__name">Pedro Henrique</span></figcaption></figure>
		<figure class="review"><blockquote class="review__text">"Atendimento super rápido e minhas miniaturas chegaram muito bem embaladas. A qualidade da pintura é impecável. Recomendo demais!"</blockquote><figcaption class="review__author"><span class="review__avatar"><img class="ph" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Foto de Camila Ferreira" /></span><span class="review__name">Camila Ferreira</span></figcaption></figure>
	</div></section>

	<section class="newsletter" aria-labelledby="news-title"><div class="newsletter__box"><div class="newsletter__head"><svg class="icon newsletter__icon" aria-hidden="true"><use href="#i-scroll" /></svg><h2 class="newsletter__title" id="news-title">Fique por Dentro das Novidades</h2><p class="newsletter__text">Cadastre-se na nossa newsletter e receba em primeira mão lançamentos, promoções exclusivas e cupons de desconto.</p></div><form class="newsletter__form" onsubmit={(event) => event.preventDefault()}><label class="sr-only" for="nl-name">Seu nome</label><input class="newsletter__input" id="nl-name" type="text" placeholder="Seu nome..." /><label class="sr-only" for="nl-email">Seu e-mail</label><input class="newsletter__input" id="nl-email" type="email" placeholder="Seu e-mail..." /><button class="btn btn--block" type="submit">Cadastrar</button></form><p class="newsletter__note">Sem spam. Cancele quando quiser.</p></div></section>
</main>
