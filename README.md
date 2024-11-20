# Documentation
- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- https://medium.com/@avinashanshu.iitb/create-a-multiple-nest-package-and-publish-it-privately-and-publically-8003dde4497e

# Setup
- Install Git.
- Instlall nvm (https://github.com/nvm-sh/nvm).
- Install Docker:
    1. Docker Desktop (https://docs.docker.com/desktop/):
        1.1. Install WSL (https://learn.microsoft.com/en-us/windows/wsl/install):
            - `wsl --install` (PowerShell)
            - `wsl --update` (PowerShell)
        1.2. Microsoft store -> Ubuntu
        1.3. Enable Ubuntu in Docker settings
    2. Without Docker Desktop
        2.1. https://docs.docker.com/engine/install/ubuntu/
        2.2. Copy project from Windows file system to WSL. In WSL terminal:
            - Copy project to Ubuntu:
                - `cp -R /mnt/c/Users/Andrii_Veldymanov/Documents/projects/my_projects/ng-nest-postgre-workspace/apps/api/luv-coffee-be ~/luv-coffee-be`
            - Run VS Code on WSL. In terminal:
                - `cd ~/luv-coffee-be`
                - `code .`
- Install Cloud SDK (https://cloud.google.com/sdk/docs/install).
- If you are not on Windows x64:
  Install Cloud SQL Auth Proxy (https://cloud.google.com/sql/docs/postgres/connect-admin-proxy#connecting-client).

- Clone repo:
    - Run `git clone https://github.com/NgNestPostgres/luv-coffee-be.git`
        - Username for 'https://github.com': ngnestpostgres
        - Password for 'https://ngnestpostgres@github.com': access_token_classic

- Run `nvm install 1.x.x`
- Run `nvm use x.x.x` (according to Dockerfile)
- Run `npm i -g @nestjs/cli`
- Run `npm install -g npm-check-updates`
- Run `npx husky init`

## Dependencies CLI
- `gcloud` (Google Cloud SDK)
- `node` version x.x.x (according to Dockerfile)
- `docker`, used only for local development
- `@nestjs/cli`.

## Update npm packages
- Run `ncu`
- Run `ncu -u`
- Run `gcloud components update`

# Development
## Development targeted to local DB
1. After each `npm install`:
    - run `npm run compose:local:update`,
    - and don't forget to remove old docker volume.
2. Or run `npm run compose:local` if no new npm modules were installed.

## Development targeted to dev DB (needs testing!!!! move to docker!!!!)
(local cloud-sql-proxy must be authenticated: gcloud auth application-default login)
- Run `npm run db:proxy` in the first terminal.
- Run `npm run serve:dev` in the second terminal.

## Run build locally
- Run `npm run compose:local:db` in the first terminal. Then:
    1 Run `npm run docker:build:local:image` and
    2 Run `npm run docker:run:local:image`.

## Debugging
In VS Code open only luv-coffee-be project. Use VS Code debugging tools.

# Libraries/Packages
## Private GitHub Library
### GitHub Registry Auth
https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
https://github.com/settings/tokens

1. Authenticate with personal access token (classic) with `write` permissions:
    - Run `npm login --scope=@ngnestpostgres --auth-type=legacy --registry=https://npm.pkg.github.com`
        - Username: ngnestpostgres <br />
        - Password: access_token_classic
2. Personal Access Token Classic (within the Organization)
    2.1 Generate `access_token_classic` for `luv-coffee-be` with `read/write` and `repo/repo:status/repo_deployment/public_repo/repo:invite/security:ivents` permissions.
    2.2 Generate `access_token_classic` for `luv-coffee-fe` with `read` permissions.
    2.3* In `luv-coffee-fe` repo add token as a `Actions` secret with the name `NPM_FE_SHARED_TOKEN`. (https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)

### Publish libraries/packages
0. Create release branch:
    - example: `git checkout -b release_0.0.31`
1. Update versions in (versions the same???):
    - package.json
    - libs/package.json
    - .github/workflows/ci.yaml (Docker meta -> type=raw,value=x.y.z)
2. Publish from local machine:
    2.1 Authenticate to GitHub Registry (see [GitHub Registry Auth](#gitHub-registry-auth))
    2.2 Run `npm run publish:fe-shared`.
3. Publish with GitHub Actions (https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions#upgrading-a-workflow-that-accesses-a-registry-using-a-personal-access-token):
    3.1 On `dev` branch create release (set as pre-release).

# TypeOrm
## DB Migrations
Run `npm run serve:local` (to run DB)

1a. Create migration (create SQL changes manually)
    - Set migration path in
        `"typeorm:create-migration": "npx typeorm migration:create src/db/migrations/CoffeeRefactor"`
        by changing `CoffeeRefactor` to the right name.
    - Run `npm run typeorm:create-migration`.
    - In the created `1711698670588-CoffeeRefactor.ts` input SQL commands for `up()` and `down()` methods.
    - In `typeorm.config.ts` file in `migrations` array add migration class `CoffeeRefactor1711698670588` from created `1711698670588-CoffeeRefactor.ts` file.
    - Run `npm run typeorm:migrate:local`. (Be sure that application must be built before `npx typeorm migration:run -d dist/typeorm.config`)

1b. Generate migration (let typeorm generate SQL changes)
    - In `typeorm.config.ts` file in `entities` array add entities (entities: [Coffee, Flavor]):
        `import { Coffee } from './src/modules/coffees/entities/coffee.entity';`
        `import { Flavor } from './src/modules/coffees/entities/flavor.entity';`
        which are going to be changed.
    - Run `npm run typeorm:generate-migration`. (Be sure that application must be built before `npx typeorm migration:generate src/db/migrations/SchemaSync -d dist/typeorm. config`).
    - In `typeorm.config.ts` file in `migrations` array add migration class `SchemaSync1711700291982` from created `1711700291982-SchemaSync.ts` file.
    - Run `npm run typeorm:migrate:local`. (Be sure that application must be built before `npx typeorm migration:run -d dist/typeorm.config`)

2. Local migrations:
  - Run `npm run db:migrate:local`
  - Run `npm run db:migration:revert:local`
  - Run `npm run db:migration:status:local`

3. dev environment migrations:
  (local cloud-sql-proxy must be authenticated: gcloud auth application-default login)
    - in the first terminal:
        Run `yarn db:proxy`
    - in the second terminal:
        Run `yarn db:migrate:dev`
        Run `yarn db:migration:revert:dev`
        Run `yarn db:migration:status:dev`

## DB Seeding
https://github.com/w3tecch/typeorm-seeding

# Unit tests
- Run `npm run test` to run all unit tests.
- Run `npm run test:watch -- coffees.service` to watch only one file.
- Run `npm run test:cov` to run all unit tests with test coverage.

<!-- TODO: e2e tests have to be reajusted -->
# e2e tests
- Run `yarn test:e2e:run` to run e2e tests.
- Run `jest --config ./test/jest-e2e.json -- coffees` to run e2e for just one file.

# CI
According to GitHub WorkFlows.

# Release
1. Create release branch `release_x.y.z`.
2. Update versions in:
    - package.json (version x.y.z as release branch)
    - packages/package.json (version x.y.z)
    - .github/workflows/ci.yaml (Docker meta -> type=raw,value=x.y.z).
3. Make PR `release_x.y.z` to `dev`.
4. Make PR `dev` to `main`.

# Deployment ???
https://cloud.google.com/appengine/docs/the-appengine-environments

- Run `gcloud auth application-default login`

## GCP protected package.json scripts:
    "start" - setup in `app.dev.json` as a enntry point (defualt)
    "gcp-build" - used by AppEngine to built the application

# Project Setup/Implementation Details

## Authenication / Authorization
### How email/password auth was setup
https://wanago.io/2020/09/21/api-nestjs-refresh-tokens-jwt/

Store tokens (https://indepth.dev/posts/1382/localstorage-vs-cookies):
    accessToken - localStorage
    refreshToken - Cookies

### How email was setup
Setup: https://wanago.io/2021/01/18/api-nestjs-cron-nodemailer/

If you want to use Gmail with Nodemailer, you need to turn on the less secure apps (https://support.google.com/accounts/answer/6010255?hl=en) access as stated in the official Nodemailer documentation (https://nodemailer.com/usage/using-gmail/).

## gcloud to play
- Run `gcloud --version`
- Run `gcloud config list`
- Run `gcloud config configurations list`
- Run `gcloud components list`
- Run `gcloud components install [COMPONENT-ID]`
- Run `gcloud components remove [COMPONENT-ID]`
- Run `gcloud components update`
- Run `gcloud app describe`

## Connect to Cloud SQL
https://cloud.google.com/sql/docs/postgres/connect-overview

1. Cloud SQL Auth Proxy (https://cloud.google.com/sql/docs/postgres/connect-admin-proxy#connecting-client)
2. Testing:
- Run `./cloud_sql_proxy -help`
- Run `gcloud auth login`
- Run `gcloud auth list`
- Run `gcloud config list account`
- Run `gcloud sql instances describe luv-coffee-dev-1`


# GCP Theory
