FROM node:22.22.0-alpine3.23

RUN apk update && \
    apk add --no-cache git curl sudo

RUN (grep -q '^wheel:' /etc/group || addgroup -S wheel) \
 && addgroup node wheel \
 && echo "%wheel ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/wheel \
 && chmod 0440 /etc/sudoers.d/wheel

WORKDIR /app

USER node

EXPOSE 3000

# コンテナ作成
# cd ~/vercel-with-supabase/docker && docker build -t vercel-supabase-app .
# postgresコンテナ
# docker run -d --name postgres_vercel_container --network docker_vercel_network \
#   -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=verceldb \
#   --mount source=pg_vercel_data,target=/var/lib/postgresql/data postgres:17
# Dockerネットワーク
# docker network create --driver bridge --subnet 192.168.10.64/27 --gateway 192.168.10.65 docker_vercel_network
# ボリューム
# docker volume create pg_vercel_data