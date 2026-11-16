FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
EXPOSE 3000
# main.ts conecta a la base, sincroniza las tablas y ejecuta el seed (idempotente)
CMD ["node", "dist/main.js"]
