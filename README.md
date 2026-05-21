# Gestão de Veículos

Frontend web para cadastro e administração de veículos e multas, desenvolvido com **[Next.js](https://nextjs.org)** (App Router), React e TypeScript. A interface consome uma API REST em Laravel e oferece listagem, detalhes, cadastro com multas opcionais e exclusão de registros.

## Sobre o projeto

O sistema permite visualizar a frota em uma tabela, abrir o detalhe de cada veículo (dados, imagem e histórico de multas), cadastrar novos veículos com formulário completo e registrar multas no mesmo fluxo. A exclusão passa por rotas internas do Next (`app/api`), que fazem proxy para o backend — o navegador não fala diretamente com o Laravel nessas operações.

A UI usa Bootstrap 5, FastBootstrap e Bootstrap Icons, com tema escuro nas telas principais e feedback via SweetAlert2.

### Funcionalidades

- Listagem de veículos com indicação de multas
- Página de detalhes por placa
- Cadastro de veículo (dados, imagem opcional, multas dinâmicas)
- Exclusão com confirmação
- Sidebar responsiva (desktop e mobile)

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | **Next.js 16** (App Router) |
| UI | React 19, TypeScript, Bootstrap 5 |
| API (backend) | Laravel — `https://github.com/SidSan97/api-veiculos-laravel` em `http://localhost:8000` |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- API Laravel rodando em `http://localhost:8000` (projeto separado)

## Clone e execução

```bash
git clone <url-do-repositorio>
cd gestao_veiculos
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Variáveis de ambiente (opcional)

Crie um `.env.local` na raiz se a API não estiver no endereço padrão:

```env
BACKEND_API_URL=http://localhost:8000/api
```

Sem esse arquivo, o projeto usa `http://localhost:8000/api` por padrão (`lib/backend.ts`).

### Outros comandos

```bash
npm run build   # build de produção
npm run start   # servidor após o build
npm run lint    # ESLint
```

## Estrutura principal

```
app/
  page.tsx                    # lista de veículos
  cadastrar-veiculo/          # formulário de cadastro
  detalhes-veiculo/[veiculo]/ # detalhes por placa
  api/veiculos/[id]/          # rota DELETE (proxy)
  components/                 # tabela, sidebar, multas-form
lib/
  backend.ts                  # URL da API Laravel
```

