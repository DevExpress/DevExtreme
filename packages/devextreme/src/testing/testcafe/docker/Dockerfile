FROM node:18

RUN wget https://dot.net/v1/dotnet-install.sh \
    && chmod +x ./dotnet-install.sh \
    && ./dotnet-install.sh

RUN apt update \
    && apt install chromium -y \
    && mkdir /devextreme

EXPOSE 1437 1438
WORKDIR /devextreme
STOPSIGNAL SIGKILL

COPY package*.json .

RUN npm install --no-audit --no-fund

COPY . .

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
