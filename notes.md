# MemoryGame notes

## ざっくり全体像

このリポジトリは、神経衰弱ゲームの小さなフルスタック構成です。

- `client`: React + Vite + Tailwind CSS のフロントエンド
- `server`: Express + SQLite の API サーバー
- スコア登録とランキング表示だけバックエンドを使い、ゲーム本体の進行はフロント側で完結します。

## 起動方法

初回はそれぞれ依存関係を入れます。

```bash
cd server && npm install
cd ../client && npm install
```

起動はターミナルを2つ使います。

```bash
cd server
npm start
```

```bash
cd client
npm run dev
```

フロントは通常 `http://localhost:5173`、API は `http://localhost:3001` で動きます。Vite の設定で、フロントからの `/api` は `http://localhost:3001` にプロキシされます。

## 主要な画面

- `/`: ホーム画面。モード、難易度、対戦時のプレイヤー名を選んでゲーム開始。
- `/game`: ゲーム画面。カードをめくり、進捗、手数、時間、対戦スコアを表示。
- `/result`: 結果画面。ソロなら名前入力後にスコア登録、対戦なら勝者を登録。
- `/ranking`: ランキング画面。難易度とモードを切り替えてスコア一覧を表示。

ルーティングは `client/src/App.jsx` にまとまっています。

## フロントエンドの中心

ゲームロジックの中心は `client/src/hooks/useGame.js` です。

- 難易度ごとのペア数を決める
  - `easy`: 4ペア
  - `normal`: 8ペア
  - `hard`: 12ペア
- 絵文字カードをシャッフルして生成する
- カードを2枚までめくる
- 一致したら `isMatched` にする
- 不一致なら一定時間後に裏返す
- 対戦モードでは不一致時にプレイヤー交代、一致時に現在プレイヤーへ得点
- ソロモードでは経過時間を計測
- 全ペアが揃ったら `gameOver` にする

表示側は次のように分かれています。

- `client/src/pages/GamePage.jsx`: `useGame` を使い、ゲーム終了後に結果画面へ遷移
- `client/src/components/Board.jsx`: カード一覧をグリッド表示
- `client/src/components/Card.jsx`: 1枚のカードの表裏表示とクリック処理
- `client/src/components/ScoreBoard.jsx`: 手数、時間、対戦スコアなどを表示
- `client/src/components/ProgressBar.jsx`: 揃ったペア数の進捗表示

## バックエンドの中心

API サーバーの入口は `server/index.js` です。

- Express アプリを作る
- CORS と JSON パーサーを有効にする
- `/api` 以下を `server/routes/scores.js` に渡す
- 既定ポート `3001` で起動する

スコア API は `server/routes/scores.js` にあります。

- `POST /api/scores`
  - スコアを SQLite に登録
  - 必須項目は `player_name`, `mode`, `difficulty`
- `GET /api/scores/ranking`
  - `difficulty`, `mode`, `limit` で絞り込み
  - ソロは `moves ASC, time_seconds ASC` で良い記録順
  - 対戦は `created_at DESC` で新しい順

SQLite の初期化は `server/db/database.js` です。`scores` テーブルがなければ起動時に作られます。DB ファイルは `server/db/scores.db` として作成されます。

## データの流れ

1. ホーム画面でモードと難易度を選ぶ
2. `navigate('/game', { state: ... })` でゲーム画面へ渡す
3. `useGame` がカード状態、手数、時間、対戦スコアを管理する
4. 全カードが揃うと `/result` に結果情報を渡して遷移する
5. 結果画面から `postScore()` で `POST /api/scores` を呼ぶ
6. ランキング画面は `getRanking()` で `GET /api/scores/ranking` を呼ぶ

## 変更するときに見る場所

- 難易度やカード枚数を変える: `client/src/hooks/useGame.js`
- 画面遷移を変える: `client/src/App.jsx` と各 `pages`
- カードの見た目を変える: `client/src/components/Card.jsx` と `client/src/index.css`
- スコア登録項目を変える: `client/src/api/scores.js`, `server/routes/scores.js`, `server/db/database.js`
- ランキングの並び順を変える: `server/routes/scores.js`

## 注意点

- スコア登録とランキング取得には `server` の起動が必要です。
- ページ間の値は主に React Router の `location.state` で渡しているため、`/game` や `/result` を直接開くとホームへ戻ります。
- 現状、API 側のバリデーションは最小限です。入力値の厳密チェックやランキング条件を強化するなら `server/routes/scores.js` が主な編集箇所です。
- テストスクリプトはまだ用意されていません。
