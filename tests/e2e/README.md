# E2E (Playwright)

## Instalacao

```bash
npm install
npm run e2e:install
```

## Execucao

```bash
npm run e2e
```

Modos uteis:

```bash
npm run e2e:headed
npm run e2e:ui
```

## Seed automatico

Antes de iniciar o servidor, a suite executa `scripts/e2e_seed.php`.
Esse script recria um banco SQLite isolado para E2E e semeia usuarios/dados basicos.

Credenciais padrao:

- Usuario: `user.suite@local` / `User#67890`
- Admin: `admin.suite@local` / `Admin#12345`

Variaveis suportadas:

- `E2E_USER_EMAIL`
- `E2E_USER_PASSWORD`
- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`
- `E2E_DB_PATH`
- `E2E_PORT`
- `E2E_BASE_URL`
- `E2E_SERVER_CMD`
