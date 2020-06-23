Docker Image: Postgres
BD: insta
BD_PORT: 5432
BD_username: insta
BD_PASSWORD: 1234

Iniciando o servidor em maquina local

Na estrutura de arquivos existe um arquivo Docker-compose.yaml nele tem um container configurado para criar o banco de dados.

Após subir o container do banco será necessário rodar as migrations para criar as tabelas no banco segue os comandos
Rodar migrations:
npm run sequelize db:migrate

Após rodar as migrations para criar as tabelas o servidor está configurado para rodar na porta (3333) basta rodar o comando a seguir para iniciar o servidor

Rodar servidor:
Npm run nodemon
