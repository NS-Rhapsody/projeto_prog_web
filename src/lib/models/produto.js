export class Produto {
	constructor({
		id = null,
		nome,
		descricao = '',
		preco,
		estoque = 0,
		categoria = '',
		material = '',
		imagemUrl = '',
		publicado = false,
		destacado = false,
		selo = ''
	}) {
		this.id = id;
		this.nome = nome;
		this.descricao = descricao;
		this.preco = preco;
		this.estoque = estoque;
		this.categoria = categoria;
		this.material = material;
		this.imagemUrl = imagemUrl;
		this.publicado = publicado;
		this.destacado = destacado;
		this.selo = selo;
	}
}
