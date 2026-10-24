import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";

class ProdutoDAO {

    async obterTodas() {
        const produtosRef = collection(db, "produtos");

        const snapshot = await getDocs(produtosRef);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async obter(id) {
        const produtoRef = doc(db, "produtos", id);

        const snapshot = await getDoc(produtoRef);

        if (snapshot.exists()) {
            return {
                id: snapshot.id,
                ...snapshot.data()
            };
        }

        return null;
    }

    async inserir(nome, preco, estoque) {
        const produtosRef = collection(db, "produtos");

        const docRef = await addDoc(produtosRef, {
            nome: nome,
            preco: preco,
            estoque: estoque
        });

        return docRef.id;
    }

    async atualizar(nome, preco, estoque, id) {
        const produtoRef = doc(db, "produtos", id);

        await updateDoc(produtoRef, {
            nome: nome,
            preco: preco,
            estoque: estoque
        });

        return true;
    }

    async remover(id) {
        const produtoRef = doc(db, "produtos", id);

        await deleteDoc(produtoRef);

        return true;
    }
}

export default ProdutoDAO;