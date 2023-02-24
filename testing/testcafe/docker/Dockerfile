FROM node:18-slim

RUN apt update \
    && apt install chromium -y \
    && apt install wget -y \
    && mkdir /devextreme

RUN wget https://dot.net/v1/dotnet-install.sh \
    && chmod +x ./dotnet-install.sh \
    && ./dotnet-install.sh

EXPOSE 1437 1438 3000
WORKDIR /devextreme
STOPSIGNAL SIGKILL

COPY package*.json .

RUN npm install --no-audit --no-fund

COPY . .

COPY /node_modules/testcafe/lib/proxyless/request-pipeline/index.js node_modules/testcafe/lib/proxyless/request-pipeline/index.js

RUN export PATH=$PATH:~/.dotnet \
    && npm run build:testcafe \
    && npx gulp localization \
    && cd testing/renovation \
    && npm install --no-audit --no-fund --legacy-peer-deps \
    && cd ../.. \
    && npm run build:react \
    && npx gulp build-renovation-testing

RUN npm run build:react \
    && npx gulp build-renovation-testing

ENTRYPOINT ["node", "./testing/testcafe/docker/run-testcafe"]
