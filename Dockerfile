# ベースイメージとしてNode.js使うよ！✨
FROM node:20-slim

# 作業ディレクトリの設定
WORKDIR /app

# 必要なファイルをコピー
COPY package*.json ./
COPY example/ example/
COPY datasets/ datasets/
COPY server-memory/ server-memory/

# 依存関係のインストール
RUN npm install

# アプリの起動ポート
EXPOSE 3000

# 起動コマンド
CMD ["npx", "serve", "example"]
