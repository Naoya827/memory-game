# MemoryGame

Vite + React のフロント（`client`）と、Express の API サーバー（`server`）の2つで動作します。スコア登録・ランキングは API サーバー（ポート 3001）が起動している必要があります。

## 必要なもの

- [Node.js](https://nodejs.org/)（`npm` が使えること）

## 起動手順

### 1. 依存関係のインストール（初回、または `node_modules` を消した直後）

```bash
cd server && npm install
cd ../client && npm install
```

### 2. ターミナル① — API サーバー

```bash
cd server
npm start
```

`Server running on http://localhost:3001` が表示されれば OK です。

### 3. ターミナル② — フロント（開発サーバー）

```bash
cd client
npm run dev
```

ターミナルに表示される **Local** の URL（多くの場合 `http://localhost:5173`）をブラウザで開きます。

## 本番ビルドのプレビュー（任意）

```bash
cd client
npm run build
npm run preview
```

API 経由の機能を使う場合は、引き続き `server` を `npm start` で起動しておいてください。

## 構成

| ディレクトリ | 役割 |
|--------------|------|
| `client` | フロント（Vite。開発時は `/api` を `http://localhost:3001` にプロキシ） |
| `server` | バックエンド（Express、既定ポート 3001） |
