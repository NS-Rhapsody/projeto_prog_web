import { Usuario } from '../models/usuario.js';
import UsuarioDAO from '../dao/usuarioDAO.js';
import { mensagemErroAutenticacao } from '../services/auth.js';

export class UsuarioController {
	constructor(dao = new UsuarioDAO()) {
		this.dao = dao;
	}

	carregar() {
		const user = this.dao.obterAtual();
		return user ? Usuario.deFirebase(user) : null;
	}

	async salvarPerfil({ nome, email, novaSenha, senhaAtual }) {
		const atual = this.carregar();
		if (!atual) return { ok: false, mensagem: 'Entre na sua conta para continuar.' };

		try {
			const nomeValido = Usuario.validarNome(nome);
			const emailValido = Usuario.validarEmail(email);
			const mudouNome = nomeValido !== atual.nome;
			const mudouEmail = emailValido.toLowerCase() !== atual.email.toLowerCase();
			const mudouSenha = Boolean(novaSenha);

			if (mudouSenha) Usuario.validarSenha(novaSenha);
			if ((mudouEmail || mudouSenha) && !senhaAtual) {
				throw new Error('Informe sua senha atual para alterar o e-mail ou a senha.');
			}
			if (!mudouNome && !mudouEmail && !mudouSenha) {
				return { ok: true, mensagem: 'Nenhuma alteração para salvar.', usuario: atual };
			}

			const avisos = [];
			if (mudouNome) await this.dao.atualizarNome(nomeValido);
			if (mudouSenha) {
				await this.dao.atualizarSenha(novaSenha, senhaAtual);
				avisos.push('Senha atualizada.');
			}
			if (mudouEmail) {
				await this.dao.atualizarEmail(emailValido, senhaAtual);
				avisos.push('Enviamos um link de confirmação para o novo e-mail. O endereço só muda depois da confirmação.');
			}
			if (mudouNome) avisos.unshift('Nome atualizado.');

			return { ok: true, mensagem: avisos.join(' '), usuario: this.carregar() };
		} catch (error) {
			return { ok: false, mensagem: error.code ? mensagemErroAutenticacao(error) : error.message };
		}
	}

	async excluirConta(senhaAtual) {
		try {
			if (!senhaAtual) throw new Error('Informe sua senha atual para excluir a conta.');
			await this.dao.remover(senhaAtual);
			return { ok: true };
		} catch (error) {
			return { ok: false, mensagem: error.code ? mensagemErroAutenticacao(error) : error.message };
		}
	}
}
