<script>
	import { onMount } from 'svelte';

	let products = $state([]);
	let loading = $state(true);
	let errorMessage = $state('');
	let selectedCategory = $state('Todos os Produtos');
	let sortBy = $state('featured');
	let categories = $derived([
		{ name: 'Todos os Produtos', count: products.length },
		...[...new Set(products.map((product) => product.categoria).filter(Boolean))]
			.sort((first, second) => first.localeCompare(second, 'pt-BR'))
			.map((name) => ({ name, count: products.filter((product) => product.categoria === name).length }))
	]);
	let visibleProducts = $derived.by(() => {
		const filtered = selectedCategory === 'Todos os Produtos'
			? [...products]
			: products.filter((product) => product.categoria === selectedCategory);

		return filtered.sort((first, second) => {
			if (sortBy === 'price-asc') return first.preco - second.preco;
			if (sortBy === 'price-desc') return second.preco - first.preco;
			if (sortBy === 'name') return first.nome.localeCompare(second.nome, 'pt-BR');
			return Number(second.destacado) - Number(first.destacado);
		});
	});
	const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

	onMount(async () => {
		try {
			const { default: ProdutoDAO } = await import('$lib/dao/produtoDAO.js');
			products = await new ProdutoDAO().obterPublicados();
		} catch {
			errorMessage = 'Não foi possível carregar o catálogo. Verifique a conexão e as regras do Firestore.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head><title>Produtos — Empório Arcano</title></svelte:head>

<main id="catalogo">
	<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Todos os Produtos</span></nav>
	<section class="catalog" aria-label="Catálogo de produtos">
		<aside class="sidebar" aria-label="Filtros"><div class="filter"><h2 class="filter__title">Categorias</h2><ul class="filter__list">
			{#each categories as category (category.name)}
				<li class="filter__item" class:is-active={selectedCategory === category.name}><button class="filter__button" type="button" onclick={() => (selectedCategory = category.name)}>{category.name}</button><span class="filter__count">({category.count})</span></li>
			{/each}
		</ul></div><hr class="sidebar__line" /></aside>
		<div class="listing">
			<div class="toolbar"><p class="toolbar__count">Exibindo <strong>{visibleProducts.length}</strong> de {products.length} produtos publicados</p><label class="toolbar__sort-label" for="catalog-sort">Ordenar por:</label><select class="toolbar__sort" id="catalog-sort" bind:value={sortBy}><option value="featured">Em destaque</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome</option></select></div>
			{#if loading}
				<p class="catalog-message" role="status">Carregando produtos…</p>
			{:else if errorMessage}
				<p class="catalog-message form-message--error" role="alert">{errorMessage}</p>
			{:else if visibleProducts.length === 0}
				<p class="catalog-message">{products.length ? 'Nenhum produto nesta categoria.' : 'Ainda não há produtos publicados.'}</p>
			{:else}
			<div class="listing__grid">
				{#each visibleProducts as product (product.id)}
					<article class="product product--compact" class:product--featured={product.destacado}>
						<div><div class="product__media"><img class="ph" src={product.imagemUrl} alt={product.nome} loading="lazy" /><span class="badge product__badge"><svg class="icon" aria-hidden="true"><use href={product.selo === 'Mais Vendido' ? '#i-flame' : '#i-sparkles'} /></svg>{product.selo || product.categoria}</span></div><div class="product__info"><p class="pcard__cat">{product.categoria}</p><h3 class="product__name">{product.nome}</h3><p class="product__desc">{product.descricao}</p></div></div>
						<div class="product__buy"><p class="product__price"><span class="product__price-label">PREÇO</span><span class="product__price-value">{formatPrice(product.preco)}</span></p><p class="product-stock">{product.estoque > 0 ? `${product.estoque} em estoque` : 'Sem estoque'}</p></div>
					</article>
				{/each}
			</div>
			{/if}
		</div>
	</section>
</main>
