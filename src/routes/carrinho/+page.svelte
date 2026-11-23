<script>
	import { getContext } from 'svelte';

	const authState = getContext('auth');
	let items = $state([]);
	let unavailableItems = $state([]);
	let loading = $state(true);
	let savingId = $state('');
	let errorMessage = $state('');
	let loadVersion = 0;
	let itemCount = $derived(
		items.reduce((total, item) => total + item.quantidade, 0)
		+ unavailableItems.reduce((total, item) => total + item.quantidade, 0)
	);
	let total = $derived(items.reduce((sum, item) => sum + item.preco * item.quantidade, 0));
	const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

	$effect(() => {
		const ready = authState.ready;
		const uid = authState.user?.uid;
		if (!ready) return;
		if (!uid) {
			loadVersion++;
			items = [];
			unavailableItems = [];
			loading = false;
			return;
		}
		void loadCart(uid);
	});

	async function loadCart(uid) {
		const version = ++loadVersion;
		loading = true;
		errorMessage = '';
		try {
			const [{ obterCarrinho }, { default: ProdutoDAO }] = await Promise.all([
				import('$lib/dao/carrinhoDAO.js'),
				import('$lib/dao/produtoDAO.js')
			]);
			const dao = new ProdutoDAO();
			const [cart, publishedProducts] = await Promise.all([
				obterCarrinho(uid),
				dao.obterPublicados()
			]);
			const entries = Object.entries(cart).filter(([, quantity]) => Number.isInteger(quantity) && quantity > 0);
			const productsById = new Map(publishedProducts.map((product) => [product.id, product]));
			const results = entries.map(([id, quantidade]) => {
				const product = productsById.get(id);
				return product ? { ...product, quantidade } : null;
			});
			if (version !== loadVersion) return;
			items = results.filter(Boolean);
			unavailableItems = entries.filter((_, index) => !results[index]).map(([id, quantidade]) => ({ id, quantidade }));
		} catch (error) {
			if (version === loadVersion) {
				errorMessage = error.code === 'permission-denied'
					? 'O Firestore recusou a leitura. Publique as regras atuais e confira se este carrinho pertence à conta conectada.'
					: error.message || 'Não foi possível carregar seu carrinho.';
			}
		} finally {
			if (version === loadVersion) loading = false;
		}
	}

	async function setQuantity(productId, quantity) {
		savingId = productId;
		errorMessage = '';
		if (quantity === 0) {
			items = items.filter((item) => item.id !== productId);
			unavailableItems = unavailableItems.filter((item) => item.id !== productId);
		} else {
			items = items.map((item) => item.id === productId ? { ...item, quantidade: quantity } : item);
		}

		try {
			const { definirQuantidade } = await import('$lib/dao/carrinhoDAO.js');
			await definirQuantidade(authState.user.uid, productId, quantity);
		} catch (error) {
			const message = error.code === 'permission-denied'
				? 'O Firestore recusou a alteração. Publique as regras atuais e confira se este carrinho pertence à conta conectada.'
				: error.message || 'Não foi possível atualizar o carrinho.';
			await loadCart(authState.user.uid);
			errorMessage = message;
		} finally {
			savingId = '';
		}
	}
</script>

<svelte:head><title>Meu carrinho — Empório Arcano</title></svelte:head>

<main class="cart-page">
	<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Meu carrinho</span></nav>
	<section class="cart" aria-labelledby="cart-title">
		<header class="cart__header"><div><p class="eyebrow">Seus produtos</p><h1 class="title" id="cart-title">Meu carrinho</h1></div><a class="btn btn--ghost" href="/produtos">Continuar comprando</a></header>
		{#if !authState.ready}
			<p class="catalog-message" role="status">Verificando sua conta…</p>
		{:else if !authState.user}
			<div class="cart__empty"><p>Entre na sua conta para acessar e salvar produtos no carrinho.</p><a class="btn" href="/login">Entrar na minha conta</a></div>
		{:else if loading}
			<p class="catalog-message" role="status">Carregando seu carrinho…</p>
		{:else if errorMessage}
			<p class="form-message form-message--error" role="alert">{errorMessage}</p>
		{:else if items.length === 0 && unavailableItems.length === 0}
			<div class="cart__empty"><p>Seu carrinho está vazio.</p><a class="btn" href="/produtos">Explorar produtos</a></div>
		{:else}
			{#if errorMessage}<p class="form-message form-message--error" role="alert">{errorMessage}</p>{/if}
			<div class="cart__layout">
				<div class="cart__items">
					{#each items as item (item.id)}
						<article class="cart-item">
							<img class="cart-item__image" src={item.imagemUrl} alt={item.nome} />
							<div class="cart-item__details"><p class="pcard__cat">{item.categoria}</p><h2 class="cart-item__name">{item.nome}</h2><p class="cart-item__price">{formatPrice(item.preco)} cada</p></div>
							<div class="cart-item__quantity" aria-label={`Quantidade de ${item.nome}`}><button type="button" aria-label={`Diminuir quantidade de ${item.nome}`} disabled={savingId === item.id || item.quantidade <= 1} onclick={() => setQuantity(item.id, item.quantidade - 1)}>−</button><span>{item.quantidade}</span><button type="button" aria-label={`Aumentar quantidade de ${item.nome}`} disabled={savingId === item.id || item.quantidade >= item.estoque} onclick={() => setQuantity(item.id, item.quantidade + 1)}>+</button></div>
							<strong class="cart-item__subtotal">{formatPrice(item.preco * item.quantidade)}</strong>
							<button class="cart-item__remove" type="button" disabled={savingId === item.id} onclick={() => setQuantity(item.id, 0)}>Remover</button>
						</article>
					{/each}
					{#each unavailableItems as item (item.id)}
						<article class="cart-item cart-item--unavailable"><div class="cart-item__details"><h2 class="cart-item__name">Produto indisponível</h2><p class="cart-item__price">Este produto não está mais publicado no catálogo.</p></div><button class="cart-item__remove" type="button" disabled={savingId === item.id} onclick={() => setQuantity(item.id, 0)}>Remover</button></article>
					{/each}
				</div>
				<aside class="cart-summary" aria-label="Resumo do carrinho"><h2>Resumo do pedido</h2><p><span>Produtos</span><span>{itemCount}</span></p><p class="cart-summary__total"><span>Subtotal</span><strong>{formatPrice(total)}</strong></p><p class="cart-summary__note">Frete e pagamento serão calculados na finalização do pedido.</p></aside>
			</div>
		{/if}
	</section>
</main>
