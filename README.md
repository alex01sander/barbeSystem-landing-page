# BarberSys - Sistema de Gestão de Barbearia Premium

Sistema completo para gestão de barbearias, incluindo landing page institucional, agendamento online e painel administrativo para gestão de clientes, serviços, equipe e financeiro.

## 🚀 Guia de Produção

### 1. Backend (Node.js + Express + Prisma)

O backend deve ser hospedado em plataformas como Railway, Render ou VPS.

**Configuração:**
- Copie o arquivo `.env.example` para `.env` no servidor.
- Configure as variáveis de ambiente, especialmente `DATABASE_URL` (PostgreSQL) e `JWT_SECRET`.
- Configure `FRONTEND_URL` com o domínio onde o frontend será hospedado para segurança do CORS.

**Comandos:**
```bash
cd backend
npm install
npm run build
npm run prisma:migrate  # Executa as migrações no banco de produção
npm start               # Inicia o servidor em modo produção
```

### 2. Frontend (Next.js 16)

O frontend pode ser hospedado facilmente na Vercel ou Netlify.

**Configuração:**
- Adicione a variável de ambiente `NEXT_PUBLIC_API_URL` apontando para a URL do seu backend.

**Comandos:**
```bash
cd frontend
npm install
npm run build
npm start
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 16, Tailwind CSS 4, Framer Motion, Lucide React, TanStack Query.
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, JWT para autenticação.
- **Estética**: Design Editorial P&B (Black & White) focado em UX/UI premium.

## 🔒 Segurança em Produção

1. **JWT_SECRET**: Altere para uma chave longa e complexa no servidor de produção.
2. **CORS**: Certifique-se de que a `FRONTEND_URL` no backend está apontando para o seu domínio real.
3. **SSL**: Utilize HTTPS em ambos os serviços (Backend e Frontend).

---
© 2026 IdalgoCortes — Excelência Redefinida.
