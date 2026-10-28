<script>
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';

	const authState = getContext('auth');

	let nome = $state('');
	let email = $state('');
	let novaSenha = $state('');
	let senhaAtual = $state('');
	let showPassword = $state(false);
	let saving = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	let confirmandoExclusao = $state(false);
	let senhaExclusao = $state('');
	let excluindo = $state(false);
	let deleteError = $state('');

	let carregado = false;

	$effect(() => {
		if (authState.ready && authState.user && !carregado) {
			carregado = true;
			nome = authState.user.displayName ?? '';
			email = authState.user.email ?? '';
		}
	});

	async function criarController() {
		const { UsuarioController } = await import('$lib/controllers/usuarioController.js');
		return new UsuarioController();
	}

	async function salvar(event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';
		saving = true;
		try {
			const controller = await criarController();
			const resultado = await controller.salvarPerfil({ nome, email, novaSenha, senhaAtual });
			if (resultado.ok) {
				successMessage = resultado.mensagem;
				if (resultado.usuario) {
					authState.user = {
						uid: resultado.usuario.uid,
						displayName: resultado.usuario.nome,
						email: resultado.usuario.email
					};
					nome = resultado.usuario.nome;
					email = resultado.usuario.email;
				}
				novaSenha = '';
				senhaAtual = '';
			} else {
				errorMessage = resultado.mensagem;
			}
		} finally {
			saving = false;
		}
	}

	async function excluir(event) {
		event.preventDefault();
		deleteError = '';
		excluindo = true;
		try {
			const controller = await criarController();
			const resultado = await controller.excluirConta(senhaExclusao);
			if (resultado.ok) {
				await goto('/');
			} else {
				deleteError = resultado.mensagem;
			}
		} finally {
			excluindo = false;
		}
	}
</script>

<svelte:head><title>Minha conta — Empório Arcano</title></svelte:head>

{#if !authState.ready}
	<main class="auth-access" aria-live="polite"><p>Verificando sua sessão…</p></main>
{:else if !authState.user}
	<main class="auth-access">
		<h1>Entre para continuar</h1>
		<p>Faça login para editar os dados da sua conta.</p>
		<a class="btn" href="/login">Ir para o login</a>
	</main>
{:else}
	<main id="conta">
		<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Minha conta</span></nav>
		<div class="conta">
			<form class="auth__card" onsubmit={salvar}>
				<div class="auth__head">
					<p class="auth__kicker">Seus dados no Empório</p>
					<h1 class="auth__heading">Minha conta</h1>
					<p class="auth__text">Atualize seu nome, e-mail ou senha.</p>
				</div>
				<div class="auth__fields">
					<div class="field-auth"><label class="field-auth__label">Nome completo<span class="field-auth__control"><input class="field-auth__input" bind:value={nome} type="text" autocomplete="name" required /></span></label></div>
					<div class="field-auth"><label class="field-auth__label">E-mail<span class="field-auth__control"><input class="field-auth__input" bind:value={email} type="email" autocomplete="email" required /></span></label></div>
					<div class="field-auth"><label class="field-auth__label">Nova senha (opcional)<span class="field-auth__control"><input class="field-auth__input" bind:value={novaSenha} type={showPassword ? 'text' : 'password'} placeholder="Deixe em branco para manter a atual" autocomplete="new-password" /></span></label><p class="auth__hint">Use pelo menos 8 caracteres.</p></div>
					<div class="field-auth"><label class="field-auth__label">Senha atual<span class="field-auth__control"><input class="field-auth__input" bind:value={senhaAtual} type={showPassword ? 'text' : 'password'} placeholder="Necessária para alterar e-mail ou senha" autocomplete="current-password" /><button class="field-auth__eye" type="button" onclick={() => (showPassword = !showPassword)} aria-label="Mostrar ou ocultar senha"><svg class="icon" aria-hidden="true"><use href="#i-eye" /></svg></button></span></label></div>
				</div>
				{#if errorMessage}<p class="form-message form-message--error" role="alert">{errorMessage}</p>{/if}
				{#if successMessage}<p class="form-message form-message--success" role="status">{successMessage}</p>{/if}
				<button class="btn btn--auth" type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar alterações'}</button>
			</form>

			<section class="auth__card conta__danger" aria-labelledby="excluir-titulo">
				<div class="auth__head">
					<h2 class="auth__heading conta__danger-title" id="excluir-titulo">Excluir conta</h2>
					<p class="auth__text">Esta ação é permanente. Sua conta e seu acesso ao Empório serão removidos e não poderão ser recuperados.</p>
				</div>
				{#if !confirmandoExclusao}
					<button class="btn btn--danger" type="button" onclick={() => (confirmandoExclusao = true)}>Excluir minha conta</button>
				{:else}
					<form class="auth__fields" onsubmit={excluir}>
						<div class="field-auth"><label class="field-auth__label">Confirme sua senha<span class="field-auth__control"><input class="field-auth__input" bind:value={senhaExclusao} type="password" autocomplete="current-password" required /></span></label></div>
						{#if deleteError}<p class="form-message form-message--error" role="alert">{deleteError}</p>{/if}
						<div class="conta__actions">
							<button class="btn btn--danger" type="submit" disabled={excluindo}>{excluindo ? 'Excluindo…' : 'Confirmar exclusão'}</button>
							<button class="btn btn--ghost" type="button" onclick={() => { confirmandoExclusao = false; senhaExclusao = ''; deleteError = ''; }}>Cancelar</button>
						</div>
					</form>
				{/if}
			</section>
		</div>
	</main>
{/if}
