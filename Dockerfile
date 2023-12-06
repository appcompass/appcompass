FROM node:18-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ===============================
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

ARG GITHUB_TOKEN=""
ENV GITHUB_TOKEN=$GITHUB_TOKEN

RUN rm -rf /usr/src/app/libs
RUN pnpm uninstall -w @appcompass/common
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm build


# ===============================
FROM base AS deploy
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app

ARG APP_NAME=""
ARG GITHUB_TOKEN=""
ENV GITHUB_TOKEN=$GITHUB_TOKEN

RUN pnpm deploy --prod --no-optional --filter=$APP_NAME /prod/$APP_NAME

# ===============================
FROM base AS final

ARG APP_NAME=""

COPY --from=deploy /prod/$APP_NAME /prod/$APP_NAME
WORKDIR /prod/$APP_NAME

ARG GIT_HASH=""
ARG GIT_TAG=""
ENV GIT_HASH=${GIT_HASH}
ENV GIT_TAG=${GIT_TAG}

CMD [ "pnpm", "start:prod" ]
