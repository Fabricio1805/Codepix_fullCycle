FROM node:20-slim

RUN apt-get update && apt-get install -y procps

RUN npm install -g @nestjs/cli@10.0.0

WORKDIR /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]