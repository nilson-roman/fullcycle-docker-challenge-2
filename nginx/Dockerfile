FROM nginx:latest as builder

RUN apt update && \
    apt install -y wget netcat && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for

FROM nginx:1.15-alpine

COPY start.sh .

RUN apk add --update netcat-openbsd && \
     apk add --update bash

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/bin/wait-for /usr/bin/

COPY nginx.conf /etc/nginx/conf.d/nginx.conf
