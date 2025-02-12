# Eleições

## O que é a aplicação
Desenvolvi os casos de uso (use cases) de uma aplicação voltada para eleições. A implementação abrange apenas a lógica dos casos de uso, sem incluir a parte HTTP da API, pois não havia necessidade de testes end-to-end ou de integração.

## Como rodar os testes
1. Node.js versão 18.20.6, para instalar você pode utilizar o `nvm install` caso tenha o nvm instalado
2. `npm install` para instalar as dependências
3. `npx prisma migrate dev` para rodar as migrations
4. `npm run test` para rodar os testes
5. `npm run test:cov`: para rodar os testes e gerar o coverage