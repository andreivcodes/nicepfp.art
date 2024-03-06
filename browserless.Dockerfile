FROM browserless/chrome:latest

ENV TOKEN=<your_secret_token>
ENV MAX_CONCURRENT_SESSIONS=100

EXPOSE 3000
