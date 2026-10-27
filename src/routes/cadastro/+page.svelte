<script>
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let passwordConfirmation = $state('');
	let acceptedTerms = $state(false);
	let showPassword = $state(false);
	let submitting = $state(false);
	let errorMessage = $state('');

	async function signUp(event) {
		event.preventDefault();
		errorMessage = '';

		if (password.length < 8) {
			errorMessage = 'Use uma senha com pelo menos 8 caracteres.';
			return;
		}
		if (password !== passwordConfirmation) {
			errorMessage = 'As senhas não coincidem.';
			return;
		}
		if (!acceptedTerms) {
			errorMessage = 'Aceite os termos para criar sua conta.';
			return;
		}

		submitting = true;
		try {
			const auth = await import('$lib/services/auth.js');
			await auth.cadastrarUsuario({ nome: name, email, senha: password });
			await goto('/');
		} catch (error) {
			const auth = await import('$lib/services/auth.js');
			errorMessage = auth.mensagemErroAutenticacao(error);
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head><title>Criar conta — Empório Arcano</title></svelte:head>

<main id="cadastro">
	<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Início</a><span aria-hidden="true">/</span><span aria-current="page">Cadastro</span></nav>
	<div class="auth">
		<section class="auth__welcome" aria-label="Boas-vindas">
			<div class="auth__intro"><span class="badge badge--seal"><svg class="icon" aria-hidden="true"><use href="#i-sparkles" /></svg>SEU PORTAL PARA A AVENTURA</span><h2 class="auth__title">Toda grande jornada tem um começo.</h2><p class="auth__lead">Junte-se ao Empório Arcano e encontre os próximos tesouros para sua mesa de RPG.</p></div>
			<ul class="auth__benefits">
				<li class="benefit"><svg class="icon" aria-hidden="true"><use href="#i-package" /></svg><div class="benefit__body"><h3 class="benefit__title">Seus pedidos, sempre à mão</h3><p class="benefit__text">Acompanhe cada tesouro até a sua porta.</p></div></li>
				<li class="benefit"><svg class="icon" aria-hidden="true"><use href="#i-pin" /></svg><div class="benefit__body"><h3 class="benefit__title">Mais praticidade na próxima compra</h3><p class="benefit__text">Salve seus endereços e prepare a próxima sessão.</p></div></li>
				<li class="benefit"><svg class="icon" aria-hidden="true"><use href="#i-shieldcheck" /></svg><div class="benefit__body"><h3 class="benefit__title">Uma jornada com confiança</h3><p class="benefit__text">Seus dados pessoais tratados com cuidado.</p></div></li>
			</ul>
		</section>
		<form class="auth__card auth__card--signup" onsubmit={signUp}>
			<div class="auth__head"><p class="auth__kicker">Um lugar à mesa espera por você</p><h2 class="auth__heading">Crie sua conta</h2><p class="auth__text">Preencha seus dados para fazer parte do Empório.</p></div>
			<div class="auth__fields">
				<div class="field-auth"><label class="field-auth__label">Nome completo<span class="field-auth__control"><input class="field-auth__input" bind:value={name} type="text" placeholder="Como você se chama?" autocomplete="name" required /></span></label></div>
				<div class="field-auth"><label class="field-auth__label">E-mail<span class="field-auth__control"><input class="field-auth__input" bind:value={email} type="email" placeholder="seuemail@exemplo.com" autocomplete="email" required /></span></label></div>
				<div class="field-auth"><label class="field-auth__label">Senha<span class="field-auth__control"><input class="field-auth__input" bind:value={password} type={showPassword ? 'text' : 'password'} placeholder="Crie uma senha" autocomplete="new-password" minlength="8" required /><button class="field-auth__eye" type="button" onclick={() => (showPassword = !showPassword)} aria-label="Mostrar ou ocultar senha"><svg class="icon" aria-hidden="true"><use href="#i-eye" /></svg></button></span></label><p class="auth__hint">Use pelo menos 8 caracteres, com letras e números.</p></div>
				<div class="field-auth"><label class="field-auth__label">Confirmação de senha<span class="field-auth__control"><input class="field-auth__input" bind:value={passwordConfirmation} type={showPassword ? 'text' : 'password'} placeholder="Digite a senha novamente" autocomplete="new-password" minlength="8" required /><button class="field-auth__eye" type="button" onclick={() => (showPassword = !showPassword)} aria-label="Mostrar ou ocultar senha"><svg class="icon" aria-hidden="true"><use href="#i-eye" /></svg></button></span></label></div>
			</div>
			<label class="check check--consent"><input class="check__input" bind:checked={acceptedTerms} type="checkbox" /><span>Li e aceito os <span class="auth__legal-link">Termos de Uso</span> e a <span class="auth__legal-link">Política de Privacidade</span> do Empório Arcano.</span></label>
			{#if errorMessage}<p class="form-message form-message--error" role="alert">{errorMessage}</p>{/if}
			<button class="btn btn--auth" type="submit" disabled={submitting}>{submitting ? 'Criando conta…' : 'Criar conta'}</button>
			<div class="auth__alt"><p class="auth__alt-text">Já faz parte do Empório?</p><a class="auth__alt-link" href="/login">Entrar na minha conta</a></div>
		</form>
	</div>
</main>
