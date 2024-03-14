FROM denoland/deno

EXPOSE 8080

WORKDIR /app

ADD . .

RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-write", "--allow-read", "main.ts"]