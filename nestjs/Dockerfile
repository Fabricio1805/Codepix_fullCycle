FROM node:20-slim

RUN apt update -y && apt install -y procps && npm install -g @nestjs/cli

WORKDIR /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]
