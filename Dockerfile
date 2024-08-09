FROM node:22-alpine3.19 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine3.19 AS production
# ARG NODE_ENV=local-build
# ENV NODE_ENV=${NODE_ENV}
# EXPOSE 3000
WORKDIR /usr/src/app
COPY package*.json ./
# install only dependecies
# move husky to dependencies
RUN npm install --omit=dev
# COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/src/main"]
