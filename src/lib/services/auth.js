import {
	browserLocalPersistence,
	browserSessionPersistence,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	setPersistence,
	signInWithEmailAndPassword,
	signOut,
	updateProfile
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getAuthClient, getFirestoreClient } from '../firebase/firebase.js';

export function observarAutenticacao(callback) {
	return onAuthStateChanged(getAuthClient(), callback);
}

export async function cadastrarUsuario({ nome, email, senha }) {
	const credential = await createUserWithEmailAndPassword(getAuthClient(), email.trim(), senha);
	await updateProfile(credential.user, { displayName: nome.trim() });
	return credential.user;
}

export async function entrar(email, senha, lembrar) {
	const auth = getAuthClient();
	await setPersistence(auth, lembrar ? browserLocalPersistence : browserSessionPersistence);
	const credential = await signInWithEmailAndPassword(auth, email.trim(), senha);
	return credential.user;
}

export async function sair() {
	await signOut(getAuthClient());
}

export async function redefinirSenha(email) {
	await sendPasswordResetEmail(getAuthClient(), email.trim());
}

export async function usuarioAdministrador(uid) {
	if (!uid) return false;
	const snapshot = await getDoc(doc(getFirestoreClient(), 'admins', uid));
	return snapshot.exists() && snapshot.data().ativo === true;
}

export function mensagemErroAutenticacao(error) {
	const messages = {
		'auth/email-already-in-use': 'Este e-mail já está cadastrado. Entre na sua conta.',
		'auth/invalid-email': 'Confira o endereço de e-mail informado.',
		'auth/invalid-credential': 'E-mail ou senha incorretos.',
		'auth/user-disabled': 'Esta conta está desativada. Entre em contato com o atendimento.',
		'auth/weak-password': 'Escolha uma senha com pelo menos 6 caracteres.',
		'auth/missing-password': 'Informe sua senha.',
		'auth/network-request-failed': 'Não foi possível conectar. Verifique a internet e tente novamente.',
		'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
		'auth/operation-not-allowed': 'O login por e-mail e senha ainda não está habilitado no Firebase.',
		'auth/admin-restricted-operation': 'O cadastro está desativado no Firebase. Habilite o provedor E-mail/senha nas configurações do Authentication.',
		'auth/invalid-api-key': 'A configuração do Firebase está com uma chave de API inválida. Confira a configuração do app Web no Firebase Console.',
		'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'A configuração do Firebase está com uma chave de API inválida. Confira a configuração do app Web no Firebase Console.',
		'auth/invalid-app-credential': 'Não foi possível validar a configuração deste app no Firebase. Confira o app Web e as restrições da chave de API.',
		'auth/app-not-authorized': 'Este app não está autorizado a usar o projeto Firebase configurado.',
		'auth/unauthorized-domain': 'Este domínio ainda não está autorizado no Firebase Authentication.'
	};

	return messages[error?.code] ?? `Não foi possível concluir a operação. Código do Firebase: ${error?.code ?? 'desconhecido'}.`;
}
