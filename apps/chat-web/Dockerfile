FROM node:18-alpine3.16 AS base
WORKDIR /app
# Only copy what's needed for the final image
COPY ./apps/chat-web/package.json .
COPY ./apps/chat-web/next.config.js .
COPY ./apps/chat-web/.next ./.next
COPY ./apps/chat-web/public ./public

# Install only production dependencies
RUN npm install -g pnpm
RUN pnpm install --prod

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["pnpm", "start"]