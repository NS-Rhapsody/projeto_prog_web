<script>
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let remember = $state(false);
	let showPassword = $state(false);
	let submitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	async function signIn(event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';
		submitting = true;
		try {
			const auth = await import('$lib/services/auth.js');
			const user = await auth.entrar(email, password, remember);
			let isAdmin = false;
			try {
				isAdmin = await auth.usuarioAdministrador(user.uid);
			} catch {
				isAdmin = false;
			}
			await goto(isAdmin ? '/admin' : '/');
		} catch (error) {
			const auth = await import('$lib/services/auth.js');
			errorMessage = auth.mensagemErroAutenticacao(error);
		} finally {
			submitting = false;
		}
	}

	async function sendPasswordReset() {
		errorMessage = '';
		successMessage = '';
		if (!email.trim()) {
			errorMessage = 'Informe seu e-mail para receber o link de redefinição.';
			return;
		}
		try {
			const auth = await import('$lib/services/auth.js');
			await auth.redefinirSenha(email);
			successMessage = 'Se a conta existir, você receberá um e-mail com as instruções para redefinir a senha.';
		} catch (error) {
			const auth = await import('$lib/services/auth.js');
			errorMessage = auth.mensagemErroAutenticacao(error);
		}
	}
</script>

<svelte:head><title>Entrar — Empório Arcano</title></svelte:head>

<main id="login">
	<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Login</span></nav>
	<div class="auth">
		<section class="auth__welcome" aria-label="Boas-vindas">
			<div class="auth__intro"><span class="badge badge--seal"><svg class="icon" aria-hidden="true"><use href="#i-sparkles" /></svg>SEU PORTAL PARA A AVENTURA</span><h2 class="auth__title">Sua aventura continua.</h2><p class="auth__lead">Entre na sua conta e prepare-se para o próximo capítulo da sua mesa de RPG.</p></div>
			<ul class="auth__benefits">
				<li class="benefit"><svg class="icon" aria-hidden="true"><use href="#i-package" /></svg><div class="benefit__body"><h3 class="benefit__title">Seus pedidos, sempre à mão</h3><p class="benefit__text">Acompanhe cada tesouro até a sua porta.</p></div></li>
				<li class="benefit"><svg class="icon" aria-hidden="true"><use href="#i-pin" /></svg><div class="benefit__body"><h3 class="benefit__title">Mais praticidade na próxima compra</h3><p class="benefit__text">Salve seus endereços e prepare a próxima sessão.</p></div></li>
				<li class="benefit"><svg class="icon" aria-hidden="true"><use href="#i-shieldcheck" /></svg><div class="benefit__body"><h3 class="benefit__title">Uma jornada com confiança</h3><p class="benefit__text">Seus dados pessoais tratados com cuidado.</p></div></li>
			</ul>
		</section>
		<div class="auth__side">
			<form class="auth__card auth__card--login" onsubmit={signIn}>
				<div class="auth__head"><p class="auth__kicker">Bem-vindo de volta, aventureiro</p><h2 class="auth__heading">Entrar na sua conta</h2><p class="auth__text">Acesse seus pedidos e continue sua jornada.</p></div>
				<div class="auth__fields auth__fields--login">
					<div class="field-auth"><label class="field-auth__label">E-mail<span class="field-auth__control"><input class="field-auth__input" bind:value={email} type="email" placeholder="seuemail@exemplo.com" autocomplete="email" required /></span></label></div>
					<div class="field-auth"><label class="field-auth__label">Senha<span class="field-auth__control"><input class="field-auth__input" bind:value={password} type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" autocomplete="current-password" required /><button class="field-auth__eye" type="button" onclick={() => (showPassword = !showPassword)} aria-label="Mostrar ou ocultar senha"><svg class="icon" aria-hidden="true"><use href="#i-eye" /></svg></button></span></label></div>
				</div>
				<div class="auth__row"><label class="check"><input class="check__input" bind:checked={remember} type="checkbox" /><span>Lembrar de mim</span></label><button class="auth__link auth__link-button" type="button" onclick={sendPasswordReset}>Esqueci minha senha</button></div>
				{#if errorMessage}<p class="form-message form-message--error" role="alert">{errorMessage}</p>{/if}
				{#if successMessage}<p class="form-message form-message--success" role="status">{successMessage}</p>{/if}
				<button class="btn btn--auth" type="submit" disabled={submitting}>{submitting ? 'Entrando…' : 'Entrar'}</button>
				<div class="auth__alt"><p class="auth__alt-text">Ainda não tem uma conta?</p><a class="auth__alt-link" href="/cadastro">Criar minha conta</a></div>
			</form>
			<p class="auth__help"><svg class="icon" aria-hidden="true"><use href="#i-mail" /></svg><span>Precisa de ajuda?</span><span>Fale com o Empório</span></p>
		</div>
	</div>
</main>
