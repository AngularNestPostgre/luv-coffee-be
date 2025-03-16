# Documentation
- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- https://medium.com/@avinashanshu.iitb/create-a-multiple-nest-package-and-publish-it-privately-and-publically-8003dde4497e

# Setup
- Install Git.
- Instlall nvm (https://github.com/nvm-sh/nvm).
- Install VS Code.
- Clone repo:
    - Run `git clone https://github.com/NgNestPostgres/luv-coffee-be.git`
        - Username for 'https://github.com': ngnestpostgres
        - Password for 'https://ngnestpostgres@github.com': access_token_classic

- Run `nvm install 1.x.x`
- Run `nvm use x.x.x` (according to Dockerfile)
- Run `npm i -g @nestjs/cli`
- Run `npm install -g npm-check-updates`
- Run `npm i`
- Run `npx husky init`
- Install WSL (https://code.visualstudio.com/docs/remote/wsl):
    - In PowerShell:
        - `wsl --install`
        - `wsl --update`
    - In WSL terminal:
        - Install all global npm packages (see above).
        - Install Docker: https://docs.docker.com/engine/install/ubuntu/
        - `sudo apt-get update`
        - Copy project to Ubuntu:
            `cp -R /mnt/c/Users/Andrii_Veldymanov/Documents/projects/my_projects/ng-nest-postgre-workspace/apps/api/luv-coffee-be ~/luv-coffee-be`
        - `cd ~/luv-coffee-be`
        - `code .`

<!-- TODO: Does not do changes when save file. Check later!
- Run project in WSL. In VS Code:
    1. Open project.
    2. Open WLS terminal.
    3. Run: `code .`
-->

<!-- TODO: update after GCP setup
- Install Cloud SDK (https://cloud.google.com/sdk/docs/install)
- If you are not on Windows x64:
  Install Cloud SQL Auth Proxy (https://cloud.google.com/sql/docs/postgres/connect-admin-proxy#connecting-client).
-->

## Dependencies CLI
<!-- - `gcloud` (Google Cloud SDK) -->
- `node` version x.x.x (according to Dockerfile)
- `docker`, used only for local development
- `@nestjs/cli`.

## Update npm packages
- Run `ncu`
- Run `ncu -u`
<!-- - Run `gcloud components update` -->

# Development
## Development targeted to local DB
1. After each `npm install`:
    - run `npm run compose:local:update`,
    - and don't forget to remove old docker images and volumes:
        - docker image ls
        - docker image rm 07e
        - docker volume ls
        - docker volume prune
2. Or run `npm run compose:local` if no new npm modules were installed.

<!-- (needs testing!!!! move to docker!!!!)
## Development targeted to dev DB
(local cloud-sql-proxy must be authenticated: gcloud auth application-default login)
- Run `npm run db:proxy` in the first terminal.
- Run `npm run serve:dev` in the second terminal.
 -->

## Run build locally
- Run `npm run compose:local:db` in the first terminal. Then:
    1. Run `npm run docker:build:local:image` and
    2. Run `npm run docker:run:local:image`.

## Debugging
In VS Code open only luv-coffee-be project. Use VS Code debugging tools.

# Libraries/Packages
## Private GitHub Library
### GitHub Registry Auth
https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
https://github.com/settings/tokens

1. Authenticate with personal access token (classic) with `write` permissions:
    - Run `npm login --scope=@ngnestpostgres --auth-type=legacy --registry=https://npm.pkg.github.com`
        - Username: ngnestpostgres
        - Password: access_token_classic (`pass-token`)
2. Personal Access Token Classic (within the Organization)
    1. Generate `access_token_classic` for `luv-coffee-be` with `workflow` and `read/write` and `repo/repo:status/repo_deployment/public_repo/repo:invite/security:ivents` permissions.
    2. Generate `access_token_classic` for `luv-coffee-fe` with `read` permissions.
    3. * In `luv-coffee-fe` repo add token as `Actions` secret with the name `NPM_FE_SHARED_TOKEN` with value `access_token_classic`. (https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)

### Publish libraries/packages for FE development
1. In working branch update MINOR versions
    - package.json (version x.y.z+1)
    - libs/package.json (version x.y.z+1)
    - .github/workflows/ci.yaml (Docker meta -> type=raw,value=x.y.z+1)
2. Update package-lock.json: `npm update`
3. Publish from local machine:
    1. Authenticate to GitHub Registry (see [GitHub Registry Auth](#gitHub-registry-auth))
    2. Run `npm run publish:fe-shared`.
4. Publish with GitHub Actions
  (https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions#upgrading-a-workflow-that-accesses-a-registry-using-a-personal-access-token):
    - On `current working` branch create release (set as pre-release).

# Lint
## Setup linter
1. Install linter:
  `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`
2. Init linter:
  `npm init @eslint/config@latest`


# Unit tests
- Run `npm run test` to run all unit tests.
- Run `npm run test:watch -- coffees.service` to watch only one file.
- Run `npm run test:cov` to run all unit tests with test coverage.

<!-- TODO: e2e tests have to be reajusted
# e2e tests
- Run `yarn test:e2e:run` to run e2e tests.
- Run `jest --config ./test/jest-e2e.json -- coffees` to run e2e for just one file.
-->

# CI
According to GitHub WorkFlows.

# Release
1. Create release branch `release_x.y.z`.
2. Update versions in:
    - package.json (version x.y.z as release branch)
    - libs/fe-shared/package.json (version x.y.z as release branch)
    - .github/workflows/ci.yaml (Docker meta -> type=raw,value=x.y.z).
3. Update package-lock.json: `npm update`
4. Make PR and merge `release_x.y.z` to `main`.
5. Make PR and merge `main` to `dev`.
6. In GitHub on `main` branch create release (to trigger packages publishing).
7. Clean packages:
    - ngx-shared: leave +2 recent versions (https://github.com/NgNestPostgres/luv-coffee-fe/pkgs/npm/ngx-shared)
    - luv-coffee-be: delete (https://github.com/NgNestPostgres/luv-coffee-be/pkgs/container/luv-coffee-be)
8. Clean Docker Hub (https://hub.docker.com/repository/docker/angularnestpostgre/luv-coffee-be/tags)

# TypeOrm
## DB Migrations
Run `npm run serve:local` (to run DB)

1. a. Create migration (create SQL changes manually)
    - Set migration path in
        `"typeorm:create-migration": "npx typeorm migration:create src/db/migrations/CoffeeRefactor"`
        by changing `CoffeeRefactor` to the right name.
    - Run `npm run typeorm:create-migration`.
    - In the created `1711698670588-CoffeeRefactor.ts` input SQL commands for `up()` and `down()` methods.
    - In `typeorm.config.ts` file in `migrations` array add migration class `CoffeeRefactor1711698670588` from created `1711698670588-CoffeeRefactor.ts` file.
    - Run `npm run typeorm:migrate:local`. (Be sure that application must be built before `npx typeorm migration:run -d dist/typeorm.config`)

1. b. Generate migration (let typeorm generate SQL changes)
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

<!-- TODO: change after setup
  3. dev environment migrations:
  (local cloud-sql-proxy must be authenticated: gcloud auth application-default login)
    - in the first terminal:
        Run `yarn db:proxy`
    - in the second terminal:
        Run `yarn db:migrate:dev`
        Run `yarn db:migration:revert:dev`
        Run `yarn db:migration:status:dev`
-->

## DB Seeding
https://github.com/w3tecch/typeorm-seeding

<!-- TODO: change after setup
# Deployment
https://cloud.google.com/appengine/docs/the-appengine-environments

- Run `gcloud auth application-default login`

## GCP protected package.json scripts:
    "start" - setup in `app.dev.json` as a enntry point (defualt)
    "gcp-build" - used by AppEngine to built the application
-->

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
