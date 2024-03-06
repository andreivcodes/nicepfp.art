FROM redis/redis-stack:latest

EXPOSE 8001
EXPOSE 6379

CMD [ "redis-stack-server"]
