import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	updateDoc,
	where
} from 'firebase/firestore';
import { getFirestoreClient } from '../firebase/firebase.js';

const produtosCollection = 'produtos';

export function normalizarProduto(dados) {
	const nome = String(dados.nome ?? '').trim();
	const descricao = String(dados.descricao ?? '').trim();
	const categoria = String(dados.categoria ?? '').trim();
	const material = String(dados.material ?? '').trim();
	const selo = String(dados.selo ?? '').trim();
	const imagemUrl = String(dados.imagemUrl ?? '').trim();
	const preco = Number(dados.preco);
	const estoque = Number(dados.estoque);

	if (!nome || !descricao || !categoria || !imagemUrl) {
		throw new Error('Preencha nome, descrição, categoria e imagem do produto.');
	}
	if (!Number.isFinite(preco) || preco <= 0) {
		throw new Error('Informe um preço maior que zero.');
	}
	if (!Number.isInteger(estoque) || estoque < 0) {
		throw new Error('O estoque deve ser um número inteiro igual ou maior que zero.');
	}

	let url;
	try {
		url = new URL(imagemUrl);
	} catch {
		throw new Error('Informe uma URL válida para a imagem.');
	}
	if (!['http:', 'https:'].includes(url.protocol)) {
		throw new Error('A imagem precisa usar uma URL http ou https.');
	}

	return {
		nome,
		descricao,
		categoria,
		material,
		preco: Math.round(preco * 100) / 100,
		estoque,
		imagemUrl: url.toString(),
		publicado: Boolean(dados.publicado),
		destacado: Boolean(dados.destacado),
		selo
	};
}

class ProdutoDAO {
	async obterPublicados() {
		const produtosRef = collection(getFirestoreClient(), produtosCollection);
		const snapshot = await getDocs(query(produtosRef, where('publicado', '==', true)));
		return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
	}

	async obterTodos() {
		const snapshot = await getDocs(collection(getFirestoreClient(), produtosCollection));
		return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
	}

	async obter(id) {
		const snapshot = await getDoc(doc(getFirestoreClient(), produtosCollection, id));
		return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
	}

	async inserir(dados) {
		const produto = normalizarProduto(dados);
		const reference = await addDoc(collection(getFirestoreClient(), produtosCollection), {
			...produto,
			criadoEm: serverTimestamp(),
			atualizadoEm: serverTimestamp()
		});
		return reference.id;
	}

	async atualizar(id, dados) {
		const produto = normalizarProduto(dados);
		await updateDoc(doc(getFirestoreClient(), produtosCollection, id), {
			...produto,
			atualizadoEm: serverTimestamp()
		});
	}

	async remover(id) {
		await deleteDoc(doc(getFirestoreClient(), produtosCollection, id));
	}
}

export default ProdutoDAO;
