FROM node:20-alpine

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "Building DA HelpHub static export..." && npm run build
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "out", "-l", "tcp://0.0.0.0:3000", "-c", "0"]
