import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
	runTransaction,
	serverTimestamp,
	where
} from 'firebase/firestore';
import { getFirestoreClient } from '../firebase/firebase.js';

const carrinhosCollection = 'carrinhos';

function validarUid(uid) {
	if (!uid) throw new Error('Entre na sua conta para usar o carrinho.');
}

function referenciaDoItem(uid, produtoUid) {
	validarUid(uid);
	if (!produtoUid || String(produtoUid).includes('/')) throw new Error('Produto inválido.');
	return doc(getFirestoreClient(), carrinhosCollection, `${uid}_${produtoUid}`);
}

function consultaDoUsuario(uid) {
	validarUid(uid);
	return query(collection(getFirestoreClient(), carrinhosCollection), where('usuarioUid', '==', uid));
}

function mapearCarrinho(snapshot) {
	return Object.fromEntries(snapshot.docs.map((item) => {
		const dados = item.data();
		return [dados.produtoUid, Number(dados.quantidade) || 0];
	}).filter(([produtoUid, quantidade]) => produtoUid && quantidade > 0));
}

export async function obterCarrinho(uid) {
	return mapearCarrinho(await getDocs(consultaDoUsuario(uid)));
}

export function observarCarrinho(uid, callback, onError = () => {}) {
	return onSnapshot(consultaDoUsuario(uid), (snapshot) => callback(mapearCarrinho(snapshot)), onError);
}

export async function adicionarProduto(uid, produtoUid) {
	validarUid(uid);
	const itemRef = referenciaDoItem(uid, produtoUid);
	const produtoRef = doc(getFirestoreClient(), 'produtos', produtoUid);

	await runTransaction(getFirestoreClient(), async (transaction) => {
		const [itemSnapshot, produtoSnapshot] = await Promise.all([
			transaction.get(itemRef),
			transaction.get(produtoRef)
		]);
		if (!produtoSnapshot.exists() || produtoSnapshot.data().publicado !== true) {
			throw new Error('Este produto não está disponível no catálogo.');
		}

		const estoque = Number(produtoSnapshot.data().estoque) || 0;
		const quantidadeAtual = itemSnapshot.exists() ? Number(itemSnapshot.data().quantidade) || 0 : 0;
		if (quantidadeAtual >= estoque) throw new Error('Não há mais unidades disponíveis para adicionar.');

		transaction.set(itemRef, {
			usuarioUid: uid,
			produtoUid,
			quantidade: quantidadeAtual + 1,
			atualizadoEm: serverTimestamp()
		});
	});
}

export async function definirQuantidade(uid, produtoUid, quantidade) {
	validarUid(uid);
	if (!Number.isInteger(quantidade) || quantidade < 0) {
		throw new Error('A quantidade precisa ser um número inteiro igual ou maior que zero.');
	}

	const itemRef = referenciaDoItem(uid, produtoUid);
	const produtoRef = doc(getFirestoreClient(), 'produtos', produtoUid);
	await runTransaction(getFirestoreClient(), async (transaction) => {
		const itemSnapshot = await transaction.get(itemRef);
		if (quantidade === 0) {
			if (itemSnapshot.exists()) transaction.delete(itemRef);
			return;
		}

		const produtoSnapshot = await transaction.get(produtoRef);
		if (!produtoSnapshot.exists() || produtoSnapshot.data().publicado !== true) {
			throw new Error('Este produto não está mais disponível no catálogo.');
		}
		const quantidadeAtual = itemSnapshot.exists() ? Number(itemSnapshot.data().quantidade) || 0 : 0;
		const estoque = Number(produtoSnapshot.data().estoque) || 0;
		if (quantidade > estoque && quantidade > quantidadeAtual) {
			throw new Error('A quantidade escolhida ultrapassa o estoque disponível.');
		}

		transaction.set(itemRef, {
			usuarioUid: uid,
			produtoUid,
			quantidade,
			atualizadoEm: serverTimestamp()
		});
	});
}
