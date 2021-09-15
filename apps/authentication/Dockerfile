FROM node:14 as builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install npm -g
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .
RUN npm run build

FROM node:14
WORKDIR /app
COPY --from=builder /app .
RUN apt-get update && apt-get install sudo -y
RUN npm install pm2 -g

ARG VAULT_ADDR="http://127.0.0.1:8200"
ARG VAULT_TOKEN=""
ARG GIT_HASH=""
ARG GIT_TAG=""
ARG PM2_PUBLIC_KEY=""
ARG PM2_SECRET_KEY=""

ENV VAULT_ADDR=${VAULT_ADDR}
ENV VAULT_TOKEN=${VAULT_TOKEN}
ENV GIT_HASH=${GIT_HASH}
ENV GIT_TAG=${GIT_TAG}
ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
ENV PM2_SECRET_KEY=${PM2_SECRET_KEY}

CMD ["npm", "run", "start:prod"]
