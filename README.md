# tcc-ativa-server

Para rodar o server de maneira local, você precisará instalar duas CLI's:

1. Yarn: https://classic.yarnpkg.com/pt-BR/docs/install/#windows-stable
2. Nodemon: https://nodemon.io/

Clone o repositório para sua máquina.

Em seguida, você precisa criar um arquivo de nome `.env` e colocar os valores de variáveis que estão no arquivo `.env-sample`

Após feito isso, basta rodar os comandos:

- yarn
- nodemon index.js


Assim o server estará rodando.


Para testá-lo, você pode utilizar o [Postman](https://www.postman.com/). Caso queira ver o server em conjunto com o client, será necessário clonar o [Ativa! client](https://github.com/ocl-matheusalcuri/tcc-ativa-client).
Após o clone, altere o valor do arquivo `url.ts` para seu IP Expo, que poderá ser encontrado logo acima da imagem do QR Code. Troque a porta deste IP para a 3001.


