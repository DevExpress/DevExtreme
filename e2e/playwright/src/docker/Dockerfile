FROM mcr.microsoft.com/playwright:v1.53.1-jammy
ENV DOCKER=1

WORKDIR /app
STOPSIGNAL SIGKILL

COPY . .

RUN npm install -g pnpm && pnpm install

CMD ["pnpm", "exec", "playwright", "test"]
