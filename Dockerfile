FROM node:16 as builder
ARG APP_NAME

WORKDIR /app
COPY ./apps/$APP_NAME/package.json ./
COPY ./package-lock.json ./
RUN npm install -g npm
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .
RUN npm run build --workspace=$APP_NAME && npm prune --production

FROM node:16-stretch-slim

ARG APP_NAME
ARG GIT_HASH=""
ARG GIT_TAG=""

WORKDIR /app
COPY --from=builder /app/apps/$APP_NAME/package.json /app/package.json
COPY --from=builder /app/dist/apps/$APP_NAME /app/dist
COPY --from=builder /app/node_modules /app/node_modules

ENV GIT_HASH=${GIT_HASH}
ENV GIT_TAG=${GIT_TAG}

CMD ["npm", "run", "start:prod"]
