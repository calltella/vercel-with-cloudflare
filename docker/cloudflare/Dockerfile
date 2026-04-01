FROM node:22-bookworm

# root 権限でパッケージをインストール
USER root

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      git \
      curl \
      sudo && \
    rm -rf /var/lib/apt/lists/*

# wheel グループを作成（存在しなければ）
RUN getent group wheel || groupadd wheel

# node ユーザーを wheel に追加
RUN usermod -aG wheel node

# wheel グループに sudo 権限を付与
RUN echo "%wheel ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/wheel && \
    chmod 0440 /etc/sudoers.d/wheel

WORKDIR /app

# node ユーザーに切り替え
USER node

EXPOSE 3000


# コンテナ作成
# cd ~/vercel-with-supabase/docker/cloudflare && docker build -t cloudflare-nextjs .
# コンテナ起動
# docker run -d -v $(pwd):/app -p 8976:8976 --network docker_vercel_network cloudflare-nextjs tail -f /dev/null
# postgresコンテナ
# docker run -d --name postgres_vercel_container --network docker_vercel_network \
#   -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=verceldb \
#   --mount source=pg_vercel_data,target=/var/lib/postgresql/data postgres:17
# Dockerネットワーク
# docker network create --driver bridge --subnet 192.168.10.64/27 --gateway 192.168.10.65 docker_vercel_network
# ボリューム
# docker volume create pg_vercel_data