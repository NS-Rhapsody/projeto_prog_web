<script>
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';

	const authState = getContext('auth');
	let isAdmin = $derived(authState.isAdmin);
	let adminName = $derived(authState.user?.displayName || authState.user?.email || 'Conta');
	let adminInitials = $derived(adminName.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase());

	const emptyDraft = () => ({
		nome: '',
		descricao: '',
		categoria: 'Dados',
		material: 'Resina',
		preco: '',
		estoque: 0,
		imagemUrl: '',
		publicado: false,
		destacado: true,
		selo: 'Novidade'
	});

	let draft = $state(emptyDraft());
	let willPublish = $derived(!isAdmin || Boolean(draft.publicado));
	let products = $state([]);
	let editingId = $state(null);
	let loading = $state(true);
	let saving = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let catalogError = $state('');

	const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

	onMount(loadProducts);

	async function loadProducts() {
		loading = true;
		catalogError = '';
		try {
			const { default: ProdutoDAO } = await import('$lib/dao/produtoDAO.js');
			products = isAdmin
				? await new ProdutoDAO().obterTodos()
				: await new ProdutoDAO().obterPublicados();
		} catch (error) {
			catalogError = error.code === 'permission-denied'
				? 'O Firestore recusou o acesso à lista. Confira se as regras do banco foram publicadas.'
				: 'Não foi possível carregar os produtos do Firestore.';
		} finally {
			loading = false;
		}
	}

	async function saveProduct(event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';
		saving = true;
		try {
			const { default: ProdutoDAO } = await import('$lib/dao/produtoDAO.js');
			const dao = new ProdutoDAO();
			const productData = {
				...draft,
				preco: Number(draft.preco),
				estoque: Number(draft.estoque),
				publicado: willPublish
			};
			if (editingId) {
				await dao.atualizar(editingId, productData);
				successMessage = 'Produto atualizado.';
			} else {
				await dao.inserir(productData);
				successMessage = willPublish
					? 'Produto cadastrado e publicado no catálogo.'
					: 'Produto cadastrado como rascunho.';
			}
			resetDraft();
			await loadProducts();
		} catch (error) {
			errorMessage = error.code === 'permission-denied'
				? 'Não foi possível salvar. Confira se as regras do Firestore foram publicadas.'
				: error.message || 'Não foi possível salvar o produto.';
		} finally {
			saving = false;
		}
	}

	function editProduct(product) {
		editingId = product.id;
		draft = {
			...emptyDraft(),
			...product,
			preco: String(product.preco),
			estoque: Number(product.estoque)
		};
		errorMessage = '';
		successMessage = '';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function resetDraft() {
		editingId = null;
		draft = emptyDraft();
		errorMessage = '';
	}

	async function deleteProduct(product) {
		if (!window.confirm(`Remover “${product.nome}” do catálogo?`)) return;
		catalogError = '';
		successMessage = '';
		try {
			const { default: ProdutoDAO } = await import('$lib/dao/produtoDAO.js');
			await new ProdutoDAO().remover(product.id);
			if (editingId === product.id) resetDraft();
			successMessage = 'Produto removido.';
			await loadProducts();
		} catch (error) {
			catalogError = error.code === 'permission-denied'
				? 'Somente administradores podem remover produtos.'
				: 'Não foi possível remover o produto.';
		}
	}

	async function logout() {
		const auth = await import('$lib/services/auth.js');
		await auth.sair();
		await goto('/');
	}
</script>

<svelte:head><title>{isAdmin ? 'Administração' : 'Cadastro de produtos'} — Empório Arcano</title></svelte:head>

<div class="admin">
	<aside class="admin__sidebar" aria-label="Navegação administrativa">
		<div class="admin__brand"><svg class="icon admin__emblem" aria-hidden="true"><use href="#i-x" /></svg><div class="admin__identity"><p class="admin__name">EMPÓRIO ARCANO</p><p class="admin__tag">Acessórios para RPG de Mesa</p></div></div>
		<div class="admin__divider"></div>
		<nav class="admin__menu" aria-label="Cadastro de produtos"><p class="admin__group">{isAdmin ? 'ADMINISTRAÇÃO' : 'CADASTRO'}</p><div class="admin__items">
			<a class="admin__item" href="/admin"><svg class="icon" aria-hidden="true"><use href="#i-dash" /></svg><span>Visão geral</span></a>
			<a class="admin__item admin__item--active" href="/admin"><svg class="icon" aria-hidden="true"><use href="#i-package" /></svg><span>Produtos</span></a>
			<a class="admin__item" href="/admin"><svg class="icon" aria-hidden="true"><use href="#i-layers" /></svg><span>Categorias</span></a>
			<a class="admin__item" href="/admin"><svg class="icon" aria-hidden="true"><use href="#i-bag" /></svg><span>Pedidos</span><span class="admin__count">8</span></a>
			<a class="admin__item" href="/admin"><svg class="icon" aria-hidden="true"><use href="#i-users" /></svg><span>Clientes</span></a>
			<a class="admin__item" href="/admin"><svg class="icon" aria-hidden="true"><use href="#i-ticket" /></svg><span>Cupons</span></a>
		</div></nav>
		<div class="admin__prefs"><div class="admin__divider"></div><a class="admin__settings" href="/admin"><svg class="icon" aria-hidden="true"><use href="#i-settings" /></svg><span>Configurações</span></a></div>
		<div class="admin__spacer"></div>
		<div class="admin__store"><a class="admin__store-link" href="/"><svg class="icon" aria-hidden="true"><use href="#i-ext" /></svg><span>Ver loja</span></a><p class="admin__secure"><svg class="icon" aria-hidden="true"><use href="#i-shieldcheck" /></svg><span>{isAdmin ? 'Painel do administrador' : 'Cadastro de produtos'}</span></p></div>
	</aside>

	<div class="admin__main">
		<header class="admin__topbar"><p class="admin__context"><svg class="icon" aria-hidden="true"><use href="#i-shield" /></svg><span>{isAdmin ? 'Área administrativa' : 'Cadastro de produtos'}</span></p><div class="admin__account"><svg class="icon admin__bell" aria-hidden="true"><use href="#i-bell" /></svg><span class="admin__sep"></span><span class="admin__avatar">{adminInitials}</span><div class="admin__user"><p class="admin__user-name">{adminName}</p><p class="admin__user-role">{isAdmin ? 'Administrador' : 'Conta cadastradora'}</p></div><button class="admin__logout" type="button" onclick={logout}>Sair</button></div></header>
		<form class="admin__content" id="produto-form" onsubmit={saveProduct}>
			<div class="admin__head"><nav class="admin__crumbs" aria-label="Breadcrumb"><a href="/admin">{isAdmin ? 'Administração' : 'Cadastro'}</a><span aria-hidden="true">/</span><a href="/admin">Produtos</a><span aria-hidden="true">/</span><span aria-current="page">{editingId ? 'Editar produto' : 'Adicionar produto'}</span></nav><div class="admin__title-row"><div class="admin__intro"><h1 class="admin__title">{editingId ? 'Editar produto' : 'Adicionar produto'}</h1><p class="admin__subtitle">{isAdmin ? 'Cadastre os dados e publique a peça no catálogo do Empório Arcano.' : 'Preencha os dados do produto. Um administrador poderá revisar e publicar no catálogo.'}</p></div><p class="admin__legend">* Campos obrigatórios</p></div></div>
			{#if errorMessage}<p class="form-message form-message--error" role="alert">{errorMessage}</p>{/if}
			{#if successMessage}<p class="form-message form-message--success" role="status">{successMessage}</p>{/if}
			<div class="admin__grid">
				<div class="admin__form">
					<section class="panel" aria-labelledby="p1"><h2 class="panel__title" id="p1"><svg class="icon" aria-hidden="true"><use href="#i-scroll" /></svg><span>Informações do produto</span></h2>
						<div class="afield"><label class="afield__label">Nome do produto *<span class="afield__control"><input class="afield__input" bind:value={draft.nome} type="text" maxlength="120" required /></span></label></div>
						<div class="afield"><label class="afield__label" for="desc">Descrição *</label><div class="editor"><div class="editor__tools"><svg class="icon" aria-hidden="true"><use href="#i-bold" /></svg><svg class="icon" aria-hidden="true"><use href="#i-italic" /></svg><span class="editor__sep"></span><svg class="icon" aria-hidden="true"><use href="#i-list" /></svg><svg class="icon" aria-hidden="true"><use href="#i-link" /></svg></div><textarea class="editor__body" id="desc" bind:value={draft.descricao} maxlength="5000" required></textarea></div><p class="afield__hint">Conte os detalhes da peça, o acabamento e o que acompanha o produto.</p></div>
						<div class="afield-row"><div class="afield"><label class="afield__label">Categoria *<span class="afield__control"><select class="afield__input" bind:value={draft.categoria} required><option>Dados</option><option>Miniaturas</option><option>Mapas</option><option>Livros e Suplementos</option><option>Acessórios de Mesa</option><option>Escudos do Mestre</option></select><svg class="icon" aria-hidden="true"><use href="#i-chev" /></svg></span></label></div><div class="afield"><label class="afield__label">Material<span class="afield__control"><select class="afield__input" bind:value={draft.material}><option>Resina</option><option>Madeira</option><option>Metal</option><option>Couro</option><option>Outro</option></select><svg class="icon" aria-hidden="true"><use href="#i-chev" /></svg></span></label></div></div>
					</section>
					<section class="panel" aria-labelledby="p2"><h2 class="panel__title" id="p2"><svg class="icon" aria-hidden="true"><use href="#i-coins" /></svg><span>Preço e estoque</span></h2><div class="afield-row"><div class="afield"><label class="afield__label">Preço de venda *<span class="afield__control"><span class="afield__affix">R$</span><input class="afield__input" bind:value={draft.preco} type="number" min="0.01" step="0.01" required /></span></label></div><div class="afield"><label class="afield__label">Estoque disponível *<span class="afield__control"><input class="afield__input" bind:value={draft.estoque} type="number" min="0" step="1" required /><span class="afield__affix afield__affix--sm">unidades</span></span></label></div></div><p class="afield__hint">Informe a quantidade pronta para envio. O estoque será atualizado a cada venda.</p></section>
					<section class="panel panel--images" aria-labelledby="p3"><div class="panel__head"><h2 class="panel__title" id="p3"><svg class="icon" aria-hidden="true"><use href="#i-images" /></svg><span>Imagem do produto</span></h2><p class="afield__hint">Imagem externa</p></div><div class="panel__stack"><div class="afield"><label class="afield__label">URL da imagem *<span class="afield__control"><input class="afield__input" bind:value={draft.imagemUrl} type="url" placeholder="https://exemplo.com/imagem-do-produto.jpg" maxlength="2048" required /></span></label></div><p class="afield__hint afield__hint--loose">Cole uma URL pública da imagem. O catálogo carregará essa imagem diretamente do serviço onde ela está hospedada.</p><p class="afield__hint">Endereços http e https são aceitos.</p></div><p class="panel__tip"><svg class="icon" aria-hidden="true"><use href="#i-info" /></svg><span>A imagem permanece hospedada no link informado.</span></p></section>
				</div>
				<div class="admin__side">
					<section class="panel panel--side panel--preview" aria-labelledby="p4"><h2 class="panel__title panel__title--center" id="p4"><svg class="icon" aria-hidden="true"><use href="#i-eye" /></svg><span>Prévia do produto</span></h2><p class="afield__hint afield__hint--md">A prévia acompanha os campos do formulário.</p><article class="pcard"><div class="pcard__cover">{#if draft.imagemUrl.startsWith('http')}<img class="pcard__cover-image" src={draft.imagemUrl} alt={draft.nome || 'Prévia da imagem do produto'} />{:else}<svg class="icon pcard__icon" aria-hidden="true"><use href="#i-image" /></svg><span>Imagem do produto</span>{/if}{#if draft.selo}<span class="pcard__badge"><svg class="icon" aria-hidden="true"><use href="#i-sparkles" /></svg>{draft.selo}</span>{/if}</div><div class="pcard__info"><p class="pcard__cat">{draft.categoria}</p><h3 class="pcard__name">{draft.nome || 'Nome do produto'}</h3><p class="pcard__desc">{draft.descricao || 'A descrição aparecerá aqui.'}</p></div><div class="pcard__buy"><p class="pcard__price"><span>PREÇO</span><strong>{formatPrice(Number(draft.preco) || 0)}</strong></p><p class="product-stock">{Number(draft.estoque) > 0 ? `${draft.estoque} em estoque` : 'Sem estoque'}</p></div></article></section>
					{#if isAdmin}
						<section class="panel panel--side panel--publish" aria-labelledby="p5"><h2 class="panel__title panel__title--center" id="p5"><svg class="icon" aria-hidden="true"><use href="#i-send" /></svg><span>Publicação</span></h2><div class="afield"><label class="afield__label">Status de publicação<span class="afield__control"><select class="afield__input" bind:value={draft.publicado}><option value={false}>Rascunho</option><option value={true}>Publicado</option></select><svg class="icon" aria-hidden="true"><use href="#i-chev" /></svg></span></label></div><p class="afield__hint afield__hint--md afield__hint--loose">{draft.publicado ? 'O produto ficará visível no catálogo.' : 'O rascunho fica disponível apenas na administração.'}</p><div class="admin__divider"></div><div class="switch-row"><div class="switch-row__text"><p class="switch-row__label">Destacar na loja</p><p class="switch-row__desc">Exibir nos produtos recomendados</p></div><button class="switch" type="button" role="switch" aria-checked={draft.destacado} aria-label="Destacar na loja" onclick={() => (draft.destacado = !draft.destacado)}><span class="switch__knob"></span></button></div><div class="afield"><label class="afield__label">Selo do produto<span class="afield__control"><select class="afield__input" bind:value={draft.selo}><option>Novidade</option><option>Mais Vendido</option><option>Premium</option><option>Edição Limitada</option><option value="">Sem selo</option></select><svg class="icon" aria-hidden="true"><use href="#i-chev" /></svg></span></label></div></section>
					{:else}
						<section class="panel panel--side panel--publish"><h2 class="panel__title panel__title--center"><svg class="icon" aria-hidden="true"><use href="#i-send" /></svg><span>Publicação</span></h2><p class="afield__hint">O produto será publicado imediatamente no catálogo.</p></section>
					{/if}
				</div>
			</div>
			<section class="panel admin-products" aria-labelledby="products-list-title"><div class="panel__head"><h2 class="panel__title" id="products-list-title"><svg class="icon" aria-hidden="true"><use href="#i-package" /></svg><span>Produtos cadastrados</span></h2><button class="admin__publish" type="button" onclick={loadProducts} disabled={loading}>Atualizar lista</button></div>
				{#if catalogError}<p class="form-message form-message--error" role="alert">{catalogError}</p>{/if}
				{#if loading}<p class="afield__hint">Carregando produtos…</p>{:else if products.length === 0}<p class="afield__hint">Ainda não há produtos cadastrados.</p>{:else}
					<div class="admin-product-list">{#each products as product (product.id)}<article class="admin-product"><div class="admin-product__identity">{#if product.imagemUrl}<img class="admin-product__image" src={product.imagemUrl} alt="" loading="lazy" />{/if}<div><h3 class="admin-product__name">{product.nome}</h3><p class="admin-product__meta">{product.categoria} · {formatPrice(product.preco)} · Estoque: {product.estoque}</p><span class="admin-product__status" class:is-published={product.publicado}>{product.publicado ? 'Publicado' : 'Rascunho'}</span></div></div>{#if isAdmin}<div class="admin-product__actions"><button class="admin-product__button" type="button" onclick={() => editProduct(product)}>Editar</button><button class="admin-product__button admin-product__button--danger" type="button" onclick={() => deleteProduct(product)}>Remover</button></div>{/if}</article>{/each}</div>
				{/if}
			</section>
		</form>
		<div class="admin__bar"><div class="admin__state"><svg class="icon" aria-hidden="true"><use href="#i-fileclock" /></svg><div><p class="admin__state-title">{editingId ? 'Editando produto' : 'Produto novo'}</p><p class="admin__state-text">{willPublish ? 'Será publicado no catálogo.' : 'Será salvo como rascunho.'}</p></div></div><div class="admin__actions">{#if editingId}<button class="admin__cancel" type="button" onclick={resetDraft}>Cancelar edição</button>{/if}<a class="admin__cancel" href="/">Voltar à loja</a><button class="admin__publish" type="submit" form="produto-form" disabled={saving}><svg class="icon" aria-hidden="true"><use href="#i-check" /></svg><span>{saving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Salvar produto'}</span></button></div></div>
	</div>
</div>
