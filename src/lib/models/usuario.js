export class Usuario {
	constructor({ uid = null, nome = '', email = '' }) {
		this.uid = uid;
		this.nome = nome;
		this.email = email;
	}

	static deFirebase(user) {
		return new Usuario({
			uid: user.uid,
			nome: user.displayName ?? '',
			email: user.email ?? ''
		});
	}

	static validarNome(nome) {
		const valor = String(nome ?? '').trim();
		if (valor.length < 2) throw new Error('Informe seu nome completo.');
		if (valor.length > 80) throw new Error('O nome deve ter no máximo 80 caracteres.');
		return valor;
	}

	static validarEmail(email) {
		const valor = String(email ?? '').trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) throw new Error('Confira o endereço de e-mail informado.');
		return valor;
	}

	static validarSenha(senha) {
		if (String(senha ?? '').length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.');
		return senha;
	}
}
