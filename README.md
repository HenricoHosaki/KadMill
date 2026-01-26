# KadMill

KadMill é um SaaS de gestão industrial desenvolvido para a empresa LR Usinagem, com foco no controle de cadastros, ordens de serviço, estoque e apontamentos de produção.

O projeto foi pensado desde o início para rodar em ambiente de produção, com arquitetura organizada, segurança, cache e deploy contínuo.

## Objetivo do Projeto

O objetivo do KadMill é centralizar processos operacionais da empresa, permitindo:

Gestão de usuários com controle de acesso por função

Cadastro de clientes, fornecedores e produtos

Controle de ordens de serviço

Gerenciamento de estoque e matéria-prima

Apontamentos de produção

Autenticação segura e controle de sessão

O sistema está em uso contínuo (24/7) e preparado para receber melhorias sob demanda.

## Arquitetura

O projeto segue uma arquitetura em camadas estilo MVC no backend:

routes → controllers → services → middlewares → database


## Principais responsabilidades:

Routes: definição das rotas HTTP

Controllers: camada de entrada (HTTP)

Services: regras de negócio

Middlewares: autenticação, autorização e tratamento de erros

Errors: centralização de erros de domínio

Bootstrap: inicialização de dados essenciais (admin)

## Autenticação e Segurança

Autenticação baseada em JWT

Controle de acesso por função (ADMIN, OPERADOR, GERENTE)

Redis utilizado para blacklist de tokens (revogação no logout)

Middleware de autenticação protegendo rotas sensíveis

Variáveis sensíveis protegidas via .env e ambiente de deploy

##  Tecnologias Utilizadas
Backend

Node.js

TypeScript

Express

Prisma ORM

PostgreSQL

Redis

JWT

Docker / Docker Compose

Frontend

Interface web integrada ao backend

Consumo de API REST

Autenticação via token

## Infraestrutura

Railway (Deploy)

GitHub (Versionamento)

Dockerizado para ambiente local e produção

## Executando o Projeto Localmente
Pré-requisitos

Docker

Docker Compose

Git

Passos
# Clone o repositório
git clone https://github.com/HenricoHosaki/KadMill.git

# Acesse a pasta
cd KadMill

# Suba os serviços
docker compose up


Após isso:

Backend: http://localhost:3333

Frontend: http://localhost:5173

⚙️ Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para segurança e configuração.

Exemplo de variáveis utilizadas:

DATABASE_URL=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_HOST=
REDIS_URL=
JWT_SECRET=
TOKEN_EXPIRE=
BOOTSTRAP_ADMIN_EMAIL=
BOOTSTRAP_ADMIN_PASSWORD=


Essas variáveis são configuradas:

Localmente via .env

Em produção diretamente no Railway

## Bootstrap de Administrador

Na inicialização do sistema, é criado automaticamente um usuário administrador caso não exista, utilizando variáveis de ambiente.

Isso garante:

acesso inicial ao sistema

segurança (senha não fica hardcoded)

controle de permissões desde o primeiro uso

## Deploy

O sistema está em produção utilizando Railway, com:

Backend dockerizado

PostgreSQL gerenciado

Redis gerenciado

Integração com GitHub

Domínios separados para frontend e backend

Aplicação rodando 24h

## Status do Projeto

🟢 Em produção (Manutenção ativa)

O sistema está estável e recebe:

correções pontuais

melhorias incrementais

novas funcionalidades sob demanda

## Autor

Henrico Hosaki
Desenvolvedor Backend em formação
Projeto desenvolvido com foco em aprendizado prático, arquitetura limpa e entrega real de software.

🔗 GitHub: https://github.com/HenricoHosaki
