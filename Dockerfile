FROM node:22-alpine3.19 AS base
WORKDIR /usr/src/app
# EXPOSE 3000

FROM base AS dev
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM base AS prod
# ARG NODE_ENV=local-build
# ENV NODE_ENV=${NODE_ENV}
COPY package*.json ./
# install only dependecies
# move husky to dependencies
RUN npm ci --omit=dev
# COPY . .
COPY --from=dev /usr/src/app/dist ./dist
CMD ["node", "dist/src/main"]

FROM base AS ci
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run lint
RUN npm run test
RUN npm run build
