# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.1 create --template minimal --no-types --add tailwindcss="plugins:typography,forms" --install npm projeto-prog-web-1
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Firebase: autenticação e produtos

O projeto usa Firebase Authentication para contas por e-mail e senha e Cloud Firestore para os produtos. A URL da imagem é armazenada no campo `imagemUrl`; a imagem continua hospedada no serviço externo.

1. No Firebase Console do projeto `emporio-arcano`, habilite o provedor **E-mail/senha** em Authentication e crie o banco do Cloud Firestore.
2. Com o Firebase CLI instalado e autenticado na conta do projeto, aplique as regras deste repositório:

   ```sh
   firebase deploy --only firestore:rules
   ```

3. Crie uma conta pela tela `/cadastro`. Qualquer usuário autenticado pode acessar `/admin` e cadastrar produtos, que são publicados imediatamente. Para liberar edição e remoção, copie o UID da conta administradora na lista de usuários do Authentication e crie no Firestore o documento `admins/{UID}` com o campo booleano `ativo: true`. As regras impedem que usuários criem ou alterem documentos nessa coleção pelo aplicativo.
4. Produtos publicados aparecem em `/produtos`; rascunhos ficam visíveis apenas no painel administrativo.

O painel exige uma sessão para cadastrar produtos. As regras em `firestore.rules` permitem que usuários autenticados publiquem novos produtos; somente contas com documento `admins/{UID}` ativo podem listar produtos não publicados, editar ou remover produtos. Essas permissões são aplicadas no banco, além da interface.
