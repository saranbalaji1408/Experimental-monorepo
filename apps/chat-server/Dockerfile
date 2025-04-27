FROM node:18-alpine3.16 AS base
WORKDIR /app
RUN npm install -g turbo@latest
COPY . .
RUN turbo prune chat-server --docker

FROM node:18-alpine3.16 AS installer
WORKDIR /app
COPY --from=base /app/out/json/ .
COPY --from=base /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm install

FROM node:18-alpine3.16 AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=base /app/out/full/ .
RUN npm install -g pnpm turbo
RUN pnpm turbo run build --filter=chat-server 

FROM ubuntu:20.04 AS runner
WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN apt-get update && \
    apt-get install -y gnupg wget && \
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    mkdir -p /data/db

COPY --from=builder /app/apps/chat-server/package.json .
COPY --from=builder /app/apps/chat-server/dist ./dist
COPY --from=builder /app/apps/chat-server/node_modules ./node_modules

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

# Start MongoDB in the background, then start the Node.js app
CMD mongod --dbpath /data/db --bind_ip_all & node dist/index.js


