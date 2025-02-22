FROM node:22-alpine AS common

WORKDIR source

COPY .yarnrc.yml .
COPY turbo.json .
COPY .yarn .yarn
COPY .npmrc .

COPY package.json .
COPY yarn.lock .

COPY packages/ ./packages/

COPY apps/api/package.json ./apps/api/
COPY apps/app/package.json ./apps/app/


RUN yarn install --immutable

COPY apps/api/ ./apps/api/
WORKDIR /source/apps/api

# Generating prisma anyway even if not api going to be built
RUN npx prisma generate

FROM node:22-alpine AS builder

ARG BUILD_CONTEXT

COPY --from=common /source /source
WORKDIR source

# Remove all folder from app other than build context
RUN find apps/* -mindepth 0 -maxdepth 0 -type d ! -name "$BUILD_CONTEXT" -exec rm -rf {} +

COPY .env .
COPY packages packages
COPY ./apps/$BUILD_CONTEXT/ ./apps/$BUILD_CONTEXT/

RUN yarn build

FROM node:22-alpine AS runner

ARG PORT

COPY --from=builder /source /source

EXPOSE $PORT
ENTRYPOINT ["yarn", "start", "-p", "$PORT"]
