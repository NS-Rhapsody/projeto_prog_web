<script>
	import { getContext } from 'svelte';

	const authState = getContext('auth');
	let quantidades = $state({});
	let produtos = $state([]);
	let carregando = $state(true);
	let salvandoUid = $state('');
	let erro = $state('');
	let carregamentoCarrinho = $state('');
	let carregamentoVersao = 0;

	let produtosPorUid = $derived(Object.fromEntries(produtos.map((produto) => [produto.id, produto])));
	let itensDisponiveis = $derived(Object.entries(quantidades)
		.filter(([produtoUid, quantidade]) => quantidade > 0 && produtosPorUid[produtoUid])
		.map(([produtoUid, quantidade]) => ({ produto: produtosPorUid[produtoUid], quantidade })));
	let itensIndisponiveis = $derived(Object.entries(quantidades)
		.filter(([produtoUid, quantidade]) => quantidade > 0 && !produtosPorUid[produtoUid])
		.map(([produtoUid, quantidade]) => ({ produtoUid, quantidade })));
	let quantidadeTotal = $derived(Object.values(quantidades).reduce((total, quantidade) => total + quantidade, 0));
	let subtotal = $derived(itensDisponiveis.reduce((total, item) => total + Number(item.produto.preco || 0) * item.quantidade, 0));
	const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

	$effect(() => {
		const uid = authState.user?.uid;
		if (!authState.ready) return;
		if (!uid) {
			quantidades = {};
			produtos = [];
			carregando = false;
			carregamentoCarrinho = '';
			return;
		}

		let ativo = true;
		let pararObservacao;
		const versao = ++carregamentoVersao;
		carregando = true;
		erro = '';

		Promise.all([
			import('$lib/dao/carrinhoDAO.js'),
			import('$lib/dao/produtoDAO.js')
		]).then(async ([carrinhoDAO, produtoModulo]) => {
			if (!ativo) return;
			const ProdutoDAO = produtoModulo.default;
			pararObservacao = carrinhoDAO.observarCarrinho(uid, (novoCarrinho) => {
				if (ativo) quantidades = novoCarrinho;
			}, (error) => {
				if (!ativo) return;
				erro = error?.code === 'permission-denied'
					? 'O Firestore recusou o acesso ao carrinho. Confira as regras publicadas para a coleção carrinhos.'
					: 'Não foi possível atualizar o carrinho. Verifique sua conexão.';
			});
			produtos = await new ProdutoDAO().obterPublicados();
		}).catch(() => {
			if (ativo) erro = 'Não foi possível carregar o carrinho. Verifique sua conexão e as regras do Firestore.';
		}).finally(() => {
			if (ativo && versao === carregamentoVersao) carregando = false;
		});

		return () => {
			ativo = false;
			pararObservacao?.();
		};
	});

	async function alterarQuantidade(produtoUid, quantidade) {
		const uid = authState.user?.uid;
		if (!uid || salvandoUid) return;
		const anterior = quantidades[produtoUid] || 0;
		if (anterior === quantidade) return;

		const produto = produtosPorUid[produtoUid];
		if (quantidade > 0 && produto && quantidade > Number(produto.estoque || 0)) {
			erro = 'A quantidade escolhida ultrapassa o estoque disponível.';
			return;
		}

		const atualizadas = { ...quantidades };
		if (quantidade === 0) delete atualizadas[produtoUid];
		else atualizadas[produtoUid] = quantidade;
		quantidades = atualizadas;
		salvandoUid = produtoUid;
		erro = '';

		try {
			const { definirQuantidade } = await import('$lib/dao/carrinhoDAO.js');
			await definirQuantidade(uid, produtoUid, quantidade);
		} catch (error) {
			const revertidas = { ...quantidades };
			if (anterior === 0) delete revertidas[produtoUid];
			else revertidas[produtoUid] = anterior;
			quantidades = revertidas;
			erro = error?.code === 'permission-denied'
				? 'O Firestore recusou a alteração. Publique as regras da coleção carrinhos.'
				: error?.message || 'Não foi possível atualizar a quantidade. Tente novamente.';
		} finally {
			salvandoUid = '';
		}
	}
</script>

<svelte:head><title>Meu carrinho — Empório Arcano</title></svelte:head>

<main class="cart-page">
	<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Meu carrinho</span></nav>
	<section class="cart">
		<header class="cart__header"><div><p class="eyebrow">Seus produtos</p><h1 class="cart__title">Meu carrinho</h1></div><a class="btn btn--ghost" href="/produtos">Continuar comprando</a></header>
		{#if !authState.ready || carregando}
			<p class="catalog-message" role="status">Carregando seu carrinho…</p>
		{:else if !authState.user}
			<div class="cart__empty"><h2>Entre para acessar seu carrinho</h2><p>Seu carrinho fica salvo na sua conta.</p><a class="btn" href="/login">Ir para o login</a></div>
		{:else if erro && quantidadeTotal === 0}
			<p class="catalog-message form-message--error" role="alert">{erro}</p>
		{:else if quantidadeTotal === 0}
			<div class="cart__empty"><h2>Seu carrinho está vazio</h2><p>Encontre seus próximos acessórios para a mesa.</p><a class="btn" href="/produtos">Ver produtos</a></div>
		{:else}
			{#if erro}<p class="form-message form-message--error cart__error" role="alert">{erro}</p>{/if}
			<div class="cart__layout">
				<div class="cart__items" aria-label="Itens do carrinho">
					{#each itensDisponiveis as item (item.produto.id)}
						<article class="cart-item">
							<img class="cart-item__image" src={item.produto.imagemUrl} alt={item.produto.nome} />
							<div class="cart-item__details"><p class="cart-item__category">{item.produto.categoria}</p><h2>{item.produto.nome}</h2><p class="cart-item__price">{formatPrice(item.produto.preco)} cada</p>
								<div class="cart-item__quantity" aria-label="Quantidade de {item.produto.nome}">
									<button type="button" aria-label="Diminuir quantidade" disabled={Boolean(salvandoUid) || item.quantidade <= 1} onclick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}>−</button>
									<output aria-live="polite">{item.quantidade}</output>
									<button type="button" aria-label="Aumentar quantidade" disabled={Boolean(salvandoUid) || item.quantidade >= Number(item.produto.estoque || 0)} onclick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}>+</button>
								</div>
							</div>
							<strong class="cart-item__subtotal">{formatPrice(Number(item.produto.preco || 0) * item.quantidade)}</strong>
							<button class="cart-item__remove" type="button" disabled={Boolean(salvandoUid)} onclick={() => alterarQuantidade(item.produto.id, 0)}>Remover</button>
						</article>
					{/each}
					{#each itensIndisponiveis as item (item.produtoUid)}
						<article class="cart-item cart-item--unavailable"><div class="cart-item__details"><h2>Produto indisponível</h2><p class="cart-item__price">Este produto não está mais publicado no catálogo.</p></div><button class="cart-item__remove" type="button" disabled={Boolean(salvandoUid)} onclick={() => alterarQuantidade(item.produtoUid, 0)}>Remover</button></article>
					{/each}
				</div>
				<aside class="cart-summary" aria-label="Resumo do pedido"><h2>Resumo do pedido</h2><p><span>Produtos</span><span>{itensDisponiveis.reduce((total, item) => total + item.quantidade, 0)}</span></p><p class="cart-summary__total"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p><p class="cart-summary__note">Frete e pagamento serão calculados na finalização do pedido.</p></aside>
			</div>
		{/if}
	</section>
</main>
