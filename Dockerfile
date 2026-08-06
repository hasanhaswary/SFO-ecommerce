FROM node:20-alpine

# Install OpenSSL for Prisma engine compatibility on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package manifest files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm ci
RUN npx prisma generate

# Copy application source code and public assets
COPY public ./public
COPY src ./src

EXPOSE 5300

# Default command: sync database schema, seed initial data, and start server
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js && npm start"]
