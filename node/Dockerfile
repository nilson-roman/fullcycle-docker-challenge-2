FROM node:18 as builder

RUN apt update && \
    apt install -y wget netcat && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for

WORKDIR /usr/src/app

COPY . .

FROM node:18-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y netcat

COPY --from=builder /usr/src/app .
COPY --from=builder /usr/bin/wait-for /usr/bin/

CMD ["node","index.js"]
