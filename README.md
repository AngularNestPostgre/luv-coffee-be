# Documentation
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Global Setup
- Instlall nvm (https://github.com/nvm-sh/nvm).
- Install Installing Cloud SDK (https://cloud.google.com/sdk/docs/install).

Run `nvm install xx.xx.x`
Run `nvm use xx.xx.x`
Run `npm i -g yarn`
Run `npm i -g @angular/cli`
Run `npm i -g @nestjs/cli`
Run `npm install -g npm-check-updates`

# Dependencies CLI
- `gcloud` (Google Cloud SDK)
- `node` version xx.xx.x
- `yarn`, version xx.xx.x
- `docker`, used only for local development
- `@nestjs/cli`.

# Setup
- Install project global dependecies according to `README.md` in the root.
- Install Docker (https://docs.docker.com/desktop/).
- If you are not on Windows x64:
  Install Cloud SQL Auth Proxy (https://cloud.google.com/sql/docs/postgres/connect-admin-proxy#connecting-client).

# Update npm packages
- Run `ncu`
- Run `ncu -u`
- Run `gcloud components update`



# Development
## Development targeted to local DB
1. After each `yarn install`:
  - run `yarn serve:local:docker:update`,
  - and don't forget to remove old docker volume.
2. Or run `yarn serve:local` if no new npm modules were installed.

## Development targeted to dev DB
(local cloud-sql-proxy must be authenticated: gcloud auth application-default login)
- Run `yarn db:proxy` in the first terminal.
- Run `yarn serve:dev` in the second terminal.

## Build fe-shared library for frontend development
Run `yarn build:fe-shared` in the first terminal.

## Debugging
In VS Code open only luv-coffee-be project. Use VS Code debugging tools.


# Docker & Yarn Workspace
Yarn Workspace has only one "yarn.lock" file on the root.
To run Docker for any workspace project the "yarn.lock" file should be copied to project folder.


# TypeOrm
## DB Migrations
Run `yarn serve:local` (to run DB)

1a. Create migration (create SQL changes manually)
  - Set migration path in
     `"typeorm:create-migration": "yarn typeorm migration:create src/db/migrations/CoffeeRefactor"`
    by changing `CoffeeRefactor` to the right name.
  - Run `yarn typeorm:create-migration`.
  - In the created `1711698670588-CoffeeRefactor.ts` input SQL commands for `up()` and `down()` methods.
  - In `typeorm.config.ts` file in `migrations` array add migration class `CoffeeRefactor1711698670588` from created `1711698670588-CoffeeRefactor.ts` file.
  - Run `yarn typeorm:migrate:local`. (Be sure that application must be built before `yarn typeorm migration:run -d dist/typeorm.config`)

1b. Generate migration (let typeorm generate SQL changes)
  - In `typeorm.config.ts` file in `entities` array add entities (entities: [Coffee, Flavor]):
      `import { Coffee } from './src/modules/coffees/entities/coffee.entity';`
      `import { Flavor } from './src/modules/coffees/entities/flavor.entity';`
    which are going to be changed.
  - Run `yarn typeorm:generate-migration`. (Be sure that application must be built before `yarn typeorm migration:generate src/db/migrations/SchemaSync -d dist/typeorm. config`).
  - In `typeorm.config.ts` file in `migrations` array add migration class `SchemaSync1711700291982` from created `1711700291982-SchemaSync.ts` file.
  - Run `yarn typeorm:migrate:local`. (Be sure that application must be built before `yarn typeorm migration:run -d dist/typeorm.config`)

2. Local migrations:
  Run `yarn db:migrate:local`
  Run `yarn db:migration:revert:local`
  Run `yarn db:migration:status:local`

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
Run `yarn test` to run all unit tests.
Run `yarn test:watch -- coffees.service` to watch only one file.
Run `yarn test:cov` to run all unit tests with test coverage.


<!-- TODO: e2e tests have to be reajusted -->
# e2e tests
Run `yarn test:e2e:run` to run e2e tests.
Run `jest --config ./test/jest-e2e.json -- coffees` to run e2e for just one file.


# Deployment
https://cloud.google.com/appengine/docs/the-appengine-environments

Run `gcloud auth application-default login`


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

## Docker commands to play
```bash
# Docker image digest
# FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a
$ docker pull node:lts-alpine
$ docker images --digests

# The -t option is for giving our image a name, i.e., tagging it.
$ docker build -t luv-coffee-be .
# runimage:
$ docker run -p 3000:3000 luv-coffee-be
$ docker images

# Remove image
$ docker rmi <your-image-id>
```

## Docker-Compose commands to play
```bash
$ docker-compose up
$ docker-compose up --build -V
$ docker-compose down
$ docker ps
$ docker inspect afa3a614c7ed | gzep IPAddress

$ docker volume ls
$ docker-compose down
$ docker rm -f $(docker ps -a -q)
$ docker volume rm $(docker volume ls -q)
$ docker-compose up
```

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
  Run `./cloud_sql_proxy -help`
  Run `gcloud auth login`
  Run `gcloud auth list`
  Run `gcloud config list account`
  Run `gcloud sql instances describe luv-coffee-dev-1`


# GCP Theory
