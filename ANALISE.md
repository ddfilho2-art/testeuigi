# Análise do projeto `testeluigi-main`

Relatório gerado em 2026-07-03.

## Resumo

A maior parte dos erros relatados (código ruim, falha de tipo no build, login
quebrado) tinha **causa raiz comum: uma instalação `npm` corrompida**. Pacotes
como `framer-motion`, `motion` e `motion-dom` estavam presentes fisicamente em
`node_modules/` mas **sem seus arquivos `.d.ts` e sem entrypoints válidos**,
o que fazia o `tsc` e o `vite build` falharem.

Após apagar `node_modules` e reinstalar do zero (`rm -rf node_modules
package-lock.json && npm install`), **todos os erros de tipo e de build
sumiram**.

O login também foi validado de verdade: ao rodar `npm run dev` (que sobe o
`server.ts` com o middleware do Vite na porta 3000), o `POST /api/auth/login`
retorna `{"success":true,...}` com as credenciais padrão da tela.

## O que foi corrigido

### 1. Stubs duplicados na raiz (removidos)

| Arquivo removido | Real em `src/` | Motivo |
|---|---|---|
| `AdminLogin.tsx` | `src/components/AdminLogin.tsx` | stub vazio (`export {};`), não importado por nada |
| `types.ts` | `src/types.ts` | stub vazio (`export {};`), não importado por nada |

Confirmado via `grep` que nenhum arquivo do projeto importava esses stubs
(todas as referências a `./types` vinham de `node_modules/`). Remoção segura.

> Observação: `vite-env.d.ts` existe tanto na raiz quanto em `src/` — são
> idênticos e ambos inofensivos (apenas `/// <reference types="vite/client" />`).
> Mantidos como estavam.

### 2. Reinstalação limpa das dependências

A instalação existente estava corrompida. Feito:

```bash
rm -rf node_modules package-lock.json
npm install
```

Resultado:
- `tsc --noEmit` → **0 erros**
- `vite build` → **sucesso** (2082 módulos, ~449 kB JS gzipped 132 kB)

## Diagnóstico do login (validado empiricamente)

Rodei o servidor de verdade e disparei requisições:

```
POST /api/auth/login  { email: "admin@controlseg.com.br", password: "admin_secure_password" }
→ 200 {"success":true,"token":"admin-token-admin_secure_password"}

POST /api/auth/login  { email: "admin@controlseg.com.br", password: "errada" }
→ 401 {"error":"Credenciais inválidas. Verifique o email e senha."}
```

**Conclusão: o login funciona** com as credenciais mostradas na dica da tela,
desde que o server esteja rodando.

### Por que você pode ter achado que não funcionava

1. **Estava rodando só o Vite**, sem o backend. O `AdminLogin.tsx` faz
   `fetch('/api/auth/login')` (caminho relativo). Se você abriu o app só via
   `vite preview` ou `vite dev` puro, a rota `/api/*` não existe e o fetch
   falha com "Erro de conexão com o servidor". O comando correto é
   `npm run dev` (que roda `tsx server.ts` e integra o Vite middleware na
   porta 3000).

2. **Build quebrado pela instalação corrompida** — qualquer tentativa de
   deploy/preview do build ia falhar em `vite build` antes mesmo de chegar
   no login.

3. **Em produção (Vercel)**, se as env vars `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   não estiverem configuradas no painel do projeto, o sistema usa o fallback
   `admin@controlseg.com.br` / `admin_secure_password` (o mesmo da dica).
   Se você configurou `ADMIN_PASSWORD` lá para outro valor, a dica da tela
   passa a ser **enganosa** — ela sempre mostra `admin_secure_password`.

4. **`email_config.json` persistente** (`server.ts` linhas 111-157): em
   desenvolvimento local, se você já salvou um perfil de admin via dashboard,
   a senha fica em `email_config.json` na raiz do projeto e passa a valer em
   vez do fallback. Se não lembra qual é, apague `email_config.json` para
   voltar ao padrão.

### Credenciais efetivas (ordem de precedência)

`server.ts` linhas 131-133:
```ts
function getAdminPassword(): string {
  return emailConfig.adminPassword || process.env.ADMIN_PASSWORD || 'admin_secure_password';
}
```

1. `email_config.json` (`adminPassword`) — se existir
2. `ADMIN_PASSWORD` no `.env` / env do Vercel
3. fallback fixo `admin_secure_password`

E-mail: `emailConfig.adminEmail || process.env.ADMIN_EMAIL || 'admin@controlseg.com.br'`.

## Itens de qualidade (não corrigidos — recomendações)

### `server.ts` gigante (1500+ linhas)

Tudo em um arquivo: rotas de auth, CRUD de companies/questions, Supabase,
email SMTP, geração de PDF, export XLSX, upload de avatar, dashboard.
Recomendável separar em módulos:

```
server/
  index.ts          (app + listen)
  auth.ts           /api/auth/*
  companies.ts      /api/companies/*
  questions.ts      /api/questions/*
  submissions.ts    /api/submissions/*
  admin.ts          /api/admin/* (perfil, email config, avatar)
  lib/
    supabase.ts     (getSupabase, getSupabaseAuth)
    email.ts        (sendSubmissionNotification, transporter)
    pdf.ts          /api/export/pdf
    xlsx.ts         /api/export/xlsx
```

### Pasta `assets/` órfã na raiz

`testeluigi-main/assets/.aistudio/` — parece resíduo do AI Studio. As imagens
reais usadas pelo app estão em `src/assets/images/`. Confirmar se
`assets/.aistudio/` pode ser removida.

### `lucide-react` não estava em `package.json`

Apesar de listado agora em `dependencies` (linha 22 do `package.json`), em uma
das execuções anteriores o `lucide-react` apareceu como "Cannot find module"
no `tsc`. A versão instalada funcionou após a reinstalação limpa, mas vale
confirmar que o `lucide-react@^0.546.0` no `package.json` está realmente
resolvendo no Vercel.

### Token de admin fraco

O token local é literalmente `admin-token-${adminPassword}` (linha 492 do
`server.ts`). Não é assinado nem tem expiração. Para uma aplicação de
verdade, considere usar JWT com segredo + expiração (ou reusar o session
token do Supabase para tudo).

## Como rodar (correto)

```bash
# 1. Instalar dependências (use uma instalação limpa se houver dúvida)
rm -rf node_modules package-lock.json
npm install

# 2. Rodar em desenvolvimento (backend + frontend na porta 3000)
npm run dev
# acesse http://localhost:3000
# login: admin@controlseg.com.br / admin_secure_password

# 3. Build de produção
npm run build:all

# 4. Typecheck
npm run lint   # = tsc --noEmit
```

## Status final das validações

| Validação | Resultado |
|---|---|
| `tsc --noEmit` | ✅ 0 erros |
| `vite build` | ✅ sucesso |
| Login local (curl) | ✅ funciona com credenciais padrão |
| Stubs duplicados | ✅ removidos |
