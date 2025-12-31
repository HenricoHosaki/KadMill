# Kadmill – Plataforma SaaS para Gestão Industrial

## O Kadmill é um SaaS moderno em desenvolvimento, criado para atender as necessidades da empresa LR Usinagem, com foco em controle operacional, gestão de usuários, ordens de serviço, apontamentos, estoque e segurança de acesso.
O projeto está sendo desenvolvido com foco em arquitetura escalável, boas práticas de backend, segurança, e organização de código, simulando um ambiente real de software corporativo.


## Objetivo do Projeto

O Kadmill tem como objetivos principais:

Atender uma demanda real de negócio da empresa LR Usinagem

Centralizar processos operacionais em uma única plataforma

Implementar controle de acesso por função (admin, gerente, operador)

Garantir segurança com JWT, Redis e hash de senhas

Aplicar arquitetura em camadas e separação de responsabilidades

Criar uma base sólida para evolução do sistema como SaaS

### Status do Projeto
Em desenvolvimento ativo

## Arquitetura

O backend do Kadmill segue uma arquitetura bem definida:

Routes → Definição das rotas HTTP

Middlewares → Autenticação, autorização e tratamento global de erros

Controllers → Camada de entrada e saída das requisições

Services → Regras de negócio (isoladas da infraestrutura)

Errors → Erros customizados da aplicação (AppError)

Bootstrap → Rotinas executadas na inicialização do sistema (ex: criação do admin)

Database → Prisma ORM + PostgreSQL

Cache → Redis (blacklist de tokens JWT)

## Tecnologias Utilizadas

Node.js

TypeScript

Express

Prisma ORM

PostgreSQL

JWT (jsonwebtoken)

Redis

bcrypt-ts

dotenv

## Pré-requisitos

Node.js (18+)

PostgreSQL

Redis

Git
