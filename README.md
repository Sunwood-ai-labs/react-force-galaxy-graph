<p align="center">
  <img src="docs/header.png" alt="React Force Galaxy Graph">
</p>

<h1 align="center">🌌 react-force-galaxy-graph</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
メモリデータとLes Misérablesデータを表示するグラフビジュアライゼーション
</p>

## ✨ 機能

- 🔍 メモリデータとLes Misérablesデータの視覚化
- 🎮 3D力学モデルによるインタラクティブな表示
- 🎨 ブルームエフェクトを使用した美しい視覚表現
- 💾 データのダウンロード機能
- 🔄 メモリデータの自動変換機能

## 🚀 始め方

1. リポジトリをクローン:
   ```bash
   git clone https://github.com/yourusername/react-force-galaxy-graph.git
   cd react-force-galaxy-graph
   ```

2. Webサーバーでexampleディレクトリを起動:
   ```bash
   cd example
   # お好みのWebサーバーを使用
   npx serve
   # または
   python -m http.server
   ```

3. ブラウザで`http://localhost:5000`（またはサーバーが表示するURL）にアクセス

## 🔄 データ変換

MCPサーバーから生成されるmemory.jsonのエンティティと関係性のデータを、グラフ表示用のフォーマット（miserables.json形式）に変換する処理がアプリケーション内に実装されています。

変換の流れ：
- エンティティ → グラフのノードに変換
- 関係性 → グラフのリンクに変換
- 自動的にメモリデータを読み込み、インタラクティブな3Dグラフとして表示

## 📁 アプリケーション構造

- `datasets/`: データファイル
  - `memory.json`: 元のメモリデータ
  - `miserables.json`: Les Misérablesデータ

- `example/`: アプリケーション
  - `app.jsx`: メインアプリケーションコード（React）
  - `index.html`: HTMLエントリポイント
  - `styles/app.css`: スタイルシート
  - `scripts/`: 変換スクリプト（Node.js環境用）

## 🏗 アーキテクチャ

アプリケーションは単一ファイルのReactアプリケーションとして設計されています。主要なコンポーネントは:

1. **App**: メインのアプリケーションコンテナ
2. **Graph**: 3Dフォースグラフの描画を担当
3. **ControlPanel**: データセット選択とダウンロード機能を提供

データは以下のように処理されます:
1. JSONデータの読み込み（メモリデータまたはLes Misérablesデータ）
2. データの変換（必要に応じて）
3. 3Dフォースグラフによる視覚化
4. ブルームエフェクトなどの視覚的な強化
