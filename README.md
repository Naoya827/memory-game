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

## GitHub に新しいリポジトリとして登録する

1. [GitHub](https://github.com)で **New repository** を開き、名前を決めて（例: `MemoryGame`）**Create repository** まで進む。README などは追加しない（空のリポジトリにする）と手順が簡単です。

2. このフォルダで、初回コミットがまだなら次のようにする。

   ```bash
   cd /path/to/MemoryGame
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. リモートを追加してプッシュする（`YOUR_USER` と `REPO` は自分のアカウント名とリポジトリ名に置き換え）。

   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/REPO.git
   git push -u origin main
   ```

   SSH を使う場合は `git@github.com:YOUR_USER/REPO.git` に置き換えてください。

**補足:** [GitHub CLI](https://cli.github.com/)（`gh`）を入れていれば、`gh auth login` のあと `gh repo create MemoryGame --public --source=. --remote=origin --push` のように一括で作れます。
