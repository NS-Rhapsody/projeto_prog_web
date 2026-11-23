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

const cartItemsCollection = 'carrinhos';

function validarUsuario(uid) {
	if (!uid) throw new Error('Entre na sua conta para usar o carrinho.');
}

function idDoItem(uid, produtoUid) {
	validarUsuario(uid);
	if (!produtoUid) throw new Error('Produto inválido.');
	return `${uid}_${produtoUid}`;
}

function referenciaDoItem(uid, produtoUid) {
	return doc(getFirestoreClient(), cartItemsCollection, idDoItem(uid, produtoUid));
}

function consultaDoCarrinho(uid) {
	validarUsuario(uid);
	return query(collection(getFirestoreClient(), cartItemsCollection), where('usuarioUid', '==', uid));
}

function mapearItens(snapshot) {
	return Object.fromEntries(snapshot.docs.map((item) => [
		item.data().produtoUid,
		Number(item.data().quantidade) || 0
	]));
}

export async function obterCarrinho(uid) {
	return mapearItens(await getDocs(consultaDoCarrinho(uid)));
}

export function observarCarrinho(uid, callback, onError) {
	return onSnapshot(consultaDoCarrinho(uid), (snapshot) => callback(mapearItens(snapshot)), onError);
}

export async function adicionarProduto(uid, produtoUid) {
	const db = getFirestoreClient();
	const cartItemRef = referenciaDoItem(uid, produtoUid);
	const productRef = doc(db, 'produtos', produtoUid);

	await runTransaction(db, async (transaction) => {
		const [cartItemSnapshot, productSnapshot] = await Promise.all([
			transaction.get(cartItemRef),
			transaction.get(productRef)
		]);
		if (!productSnapshot.exists() || productSnapshot.data().publicado !== true) {
			throw new Error('Este produto não está disponível no catálogo.');
		}

		const product = productSnapshot.data();
		const currentQuantity = cartItemSnapshot.exists()
			? Number(cartItemSnapshot.data().quantidade) || 0
			: 0;
		if (Number(product.estoque) <= currentQuantity) {
			throw new Error('Não há mais unidades disponíveis para adicionar.');
		}

		transaction.set(cartItemRef, {
			usuarioUid: uid,
			produtoUid,
			quantidade: currentQuantity + 1,
			atualizadoEm: serverTimestamp()
		});
	});
}

export async function definirQuantidade(uid, produtoUid, quantidade) {
	if (!Number.isInteger(quantidade) || quantidade < 0) {
		throw new Error('A quantidade precisa ser um número inteiro igual ou maior que zero.');
	}

	const db = getFirestoreClient();
	const cartItemRef = referenciaDoItem(uid, produtoUid);
	const productRef = doc(db, 'produtos', produtoUid);

	await runTransaction(db, async (transaction) => {
		const cartItemSnapshot = await transaction.get(cartItemRef);
		if (quantidade === 0) {
			if (cartItemSnapshot.exists()) transaction.delete(cartItemRef);
			return;
		}

		const productSnapshot = await transaction.get(productRef);
		if (!productSnapshot.exists() || productSnapshot.data().publicado !== true) {
			throw new Error('Este produto não está mais disponível no catálogo.');
		}
		const currentQuantity = cartItemSnapshot.exists()
			? Number(cartItemSnapshot.data().quantidade) || 0
			: 0;
		if (quantidade > currentQuantity && quantidade > Number(productSnapshot.data().estoque)) {
			throw new Error('A quantidade solicitada é maior que o estoque disponível.');
		}

		transaction.set(cartItemRef, {
			usuarioUid: uid,
			produtoUid,
			quantidade,
			atualizadoEm: serverTimestamp()
		});
	});
}
