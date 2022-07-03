# Build
FROM node:16-alpine as build
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./prisma ./prisma
RUN yarn
COPY . .
RUN yarn build

# Production Dependencies
From node:16-alpine as dependencies
WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./prisma ./prisma
RUN yarn install --production --frozen-lockfile

# Runtime
From node:16-alpine as runtime
USER node:node
WORKDIR /app
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json /app/build ./
EXPOSE 3000
CMD ["node", "index.js"]
