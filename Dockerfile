FROM node:20-alpine

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "Building DA HelpHub Next server..." && npm run build

EXPOSE 3000

CMD ["npm", "start"]
