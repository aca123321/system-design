FROM alpine:latest

RUN apk add --no-cache git

WORKDIR /app

COPY git_sync.sh /usr/local/bin/git_sync.sh
RUN chmod +x /usr/local/bin/git_sync.sh

CMD ["sh", "/usr/local/bin/git_sync.sh"]