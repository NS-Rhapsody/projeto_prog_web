<script>
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
	let menuOpen = $state(false);
	let authNotice = $state('');
	let authState = $state({ user: null, ready: false, isAdmin: false });
	let currentView = $derived(page.url.pathname.replace(/^\/+|\/+$/g, '') || 'home');
	let isAdmin = $derived(currentView === 'admin');

	setContext('auth', authState);

	onMount(() => {
		let stopObserving;
		let cancelled = false;

		async function startAuthObserver() {
			const auth = await import('$lib/services/auth.js');
			if (cancelled) return;

			stopObserving = auth.observarAutenticacao(async (user) => {
				authState.user = user;
				authState.ready = false;
				try {
					authState.isAdmin = user ? await auth.usuarioAdministrador(user.uid) : false;
				} catch {
					authState.isAdmin = false;
				}
				authState.ready = true;
			});
		}

		startAuthObserver().catch(() => {
			authState.ready = true;
		});

		return () => {
			cancelled = true;
			stopObserving?.();
		};
	});

	async function logout() {
		authNotice = '';
		try {
			const auth = await import('$lib/services/auth.js');
			await auth.sair();
			await goto('/');
		} catch {
			authNotice = 'Não foi possível encerrar a sessão. Tente novamente.';
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Figtree:wght@400;500;600;700&family=MedievalSharp&display=swap"
	/>
	<title>Empório Arcano — Acessórios para RPG de Mesa</title>
</svelte:head>

<div class="app-shell" data-view={currentView}>
	<svg class="sprite" width="0" height="0" aria-hidden="true">
		<symbol id="i-x" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></symbol>
		<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
		<symbol id="i-bag" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></symbol>
		<symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></symbol>
		<symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
		<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
		<symbol id="i-flame" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.4 1-3 .5 1.1 1.5 2.5 2.5 2.5z"/></symbol>
		<symbol id="i-scroll" viewBox="0 0 24 24"><path d="M15 12h-5M15 8h-5M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></symbol>
		<symbol id="i-insta" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></symbol>
		<symbol id="i-yt" viewBox="0 0 24 24"><path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2.5 2.5 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></symbol>
		<symbol id="i-dash" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></symbol>
		<symbol id="i-package" viewBox="0 0 24 24"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></symbol>
		<symbol id="i-layers" viewBox="0 0 24 24"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></symbol>
		<symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
		<symbol id="i-ticket" viewBox="0 0 24 24"><path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 9h.01M15 15h.01m0-6-6 6"/></symbol>
		<symbol id="i-settings" viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></symbol>
		<symbol id="i-ext" viewBox="0 0 24 24"><path d="M15 3h6v6M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></symbol>
		<symbol id="i-shield" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></symbol>
		<symbol id="i-shieldcheck" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></symbol>
		<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></symbol>
		<symbol id="i-bold" viewBox="0 0 24 24"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></symbol>
		<symbol id="i-italic" viewBox="0 0 24 24"><path d="M19 4h-9M14 20H5M15 4 9 20"/></symbol>
		<symbol id="i-list" viewBox="0 0 24 24"><path d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13"/></symbol>
		<symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></symbol>
		<symbol id="i-coins" viewBox="0 0 24 24"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4m8.71 3.88.7.71-2.82 2.82"/></symbol>
		<symbol id="i-images" viewBox="0 0 24 24"><path d="M18 22H4a2 2 0 0 1-2-2V6M22 13l-1.3-1.3a2.41 2.41 0 0 0-3.4 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></symbol>
		<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></symbol>
		<symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/></symbol>
		<symbol id="i-image" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/></symbol>
		<symbol id="i-send" viewBox="0 0 24 24"><path d="M14.54 21.69a.5.5 0 0 0 .94-.03L21.99 2.5a.5.5 0 0 0-.65-.65L2.34 8.53a.5.5 0 0 0-.03.94l6.76 2.66a2 2 0 0 1 1.1 1.1z"/><path d="m21.85 2.15-10.94 10.93"/></symbol>
		<symbol id="i-fileclock" viewBox="0 0 24 24"><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="8" cy="16" r="6"/><path d="M9.5 17.5 8 16.25V14"/></symbol>
		<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 5-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></symbol>
		<symbol id="i-mail" viewBox="0 0 24 24"><path d="m22 7-8.99 5.73a2 2 0 0 1-2.02 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></symbol>
	</svg>

	{#if !isAdmin}
		<header class="header">
			<a class="header__logo" href="/" aria-label="Empório Arcano — página inicial">
				<svg class="icon header__logo-icon" aria-hidden="true"><use href="#i-x"/></svg>
				<span><span class="header__brand">EMPÓRIO ARCANO</span><br/><span class="header__tagline">Acessórios para RPG de Mesa</span></span>
			</a>
			<nav class="nav" class:is-open={menuOpen} id="nav" aria-label="Navegação principal">
				<ul class="nav__list">
					<li><a href="/" onclick={() => (menuOpen = false)}>Home</a></li>
					<li><a href="/produtos" onclick={() => (menuOpen = false)}>Miniaturas</a></li>
					<li><a href="/produtos" onclick={() => (menuOpen = false)}>Suplementos</a></li>
					<li><a href="/produtos" onclick={() => (menuOpen = false)}>Mapas</a></li>
					<li><a href="/produtos" onclick={() => (menuOpen = false)}>Dados</a></li>
					<li><a href="/produtos" onclick={() => (menuOpen = false)}>Literatura</a></li>
				</ul>
			</nav>
			<div class="header__actions">
				<button class="header__search" type="button" aria-label="Buscar"><svg class="icon" aria-hidden="true"><use href="#i-search"/></svg></button>
				{#if authState.user}
					<span class="header__account" title={authState.user.email}>{authState.user.displayName || authState.user.email}</span>
					<button class="header__login header__logout" type="button" onclick={logout}>Sair</button>
				{:else}
					<a class="header__login" href="/login">Login</a>
				{/if}
				<button class="header__cart" type="button"><svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg><span class="header__cart-label">CARRINHO </span>(3)</button>
			</div>
			<button class="header__toggle" type="button" aria-expanded={menuOpen} aria-controls="nav" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onclick={() => (menuOpen = !menuOpen)}>
				<span class="header__bar"></span><span class="header__bar"></span><span class="header__bar"></span>
			</button>
		</header>
	{/if}

	{#if isAdmin && !authState.ready}
		<main class="auth-access" aria-live="polite"><p>Verificando sua sessão…</p></main>
	{:else if isAdmin && !authState.user}
		<main class="auth-access"><h1>Entre para continuar</h1><p>Faça login para cadastrar produtos.</p><a class="btn" href="/login">Ir para o login</a></main>
	{:else}
		{@render children()}
	{/if}

	{#if authNotice}<p class="auth-notice" role="status">{authNotice}</p>{/if}

	{#if !isAdmin}
		<footer class="footer">
			<div class="footer__main">
				<div class="footer__brand">
					<p class="footer__logo"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg>EMPÓRIO ARCANO</p>
					<p class="footer__about">Acessórios de alta qualidade para RPG de mesa. Produtos artesanais feitos com paixão e dedicação.</p>
				</div>
				<nav class="footer__col" aria-label="Produtos">
					<h3 class="footer__heading">Produtos</h3>
					<a href="/produtos">Dados</a><a href="/produtos">Cadernos de Couro</a><a href="/produtos">Miniaturas Pintadas</a><a href="/produtos">Escudos de Mestre</a><a href="/produtos">Mapas</a>
				</nav>
				<nav class="footer__col" aria-label="Institucional">
					<h3 class="footer__heading">Institucional</h3>
					<a href="/#historia">Sobre Nós</a><a href="/#top">Atendimento</a><a href="/#top">Envio e Entrega</a><a href="/#top">Trocas e Devoluções</a><a href="/#top">FAQ</a>
				</nav>
				<div class="footer__col footer__col--wide">
					<h3 class="footer__heading">Pagamento Seguro</h3>
					<p class="footer__text">Suas compras são protegidas com criptografia de ponta a ponta. Aceitamos diversas formas de pagamento.</p>
					<div class="footer__pay"><span class="footer__pay-item">Pix</span><span class="footer__pay-item">Boleto</span><span class="footer__pay-item">Cartão Credito</span></div>
				</div>
			</div>
			<div class="footer__bottom">
				<p>© 2026 Empório Arcano RPG Ltda. Todos os direitos reservados.</p>
				<div class="footer__legal"><a href="/#top">Termos de Uso</a><a href="/#top">Política de Privacidade</a></div>
			</div>
		</footer>
	{/if}
</div>
