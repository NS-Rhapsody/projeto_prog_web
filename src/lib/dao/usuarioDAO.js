import {
	EmailAuthProvider,
	deleteUser,
	reauthenticateWithCredential,
	updatePassword,
	updateProfile,
	verifyBeforeUpdateEmail
} from 'firebase/auth';
import { getAuthClient } from '../firebase/firebase.js';

class UsuarioDAO {
	obterAtual() {
		return getAuthClient().currentUser;
	}

	async reautenticar(senhaAtual) {
		const user = this.obterAtual();
		if (!user) throw new Error('Entre na sua conta para continuar.');
		const credencial = EmailAuthProvider.credential(user.email, senhaAtual);
		await reauthenticateWithCredential(user, credencial);
		return user;
	}

	async atualizarNome(nome) {
		const user = this.obterAtual();
		if (!user) throw new Error('Entre na sua conta para continuar.');
		await updateProfile(user, { displayName: nome });
	}

	async atualizarEmail(novoEmail, senhaAtual) {
		const user = await this.reautenticar(senhaAtual);
		await verifyBeforeUpdateEmail(user, novoEmail);
	}

	async atualizarSenha(novaSenha, senhaAtual) {
		const user = await this.reautenticar(senhaAtual);
		await updatePassword(user, novaSenha);
	}

	async remover(senhaAtual) {
		const user = await this.reautenticar(senhaAtual);
		await deleteUser(user);
	}
}

export default UsuarioDAO;
