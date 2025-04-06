# 🚀 サンプルアプリケーション

このディレクトリには、react-force-galaxy-graphのデモアプリケーションが含まれています。

## 📁 ディレクトリ構造

### 📄 メインファイル
- `app.jsx`: Reactアプリケーションのメインコンポーネント
- `index.html`: アプリケーションのエントリーポイント

### 🎨 スタイル
- `styles/app.css`: アプリケーションのスタイルシート

### 🛠 スクリプト
- `scripts/convert.js`: データ変換用スクリプト
- `scripts/convertDebug.js`: デバッグ用データ変換スクリプト

## 🏃‍♀️ 実行方法

1. このディレクトリに移動:
   ```bash
   cd example
   ```

2. Webサーバーを起動:
   ```bash
   # npmパッケージの'serve'を使用する場合
   npx serve

   # または、Pythonの組み込みサーバーを使用する場合
   python -m http.server
   ```

3. ブラウザで以下のURLにアクセス:
   - `serve`使用時: `http://localhost:5000`
   - Python使用時: `http://localhost:8000`

## 🎮 使用方法

1. 画面上部のドロップダウンメニューからデータセットを選択
2. マウスでグラフを操作:
   - ドラッグ: 視点の回転
   - スクロール: ズームイン/アウト
   - 右クリック+ドラッグ: パン（移動）
3. 「Download」ボタンで現在のデータセットをダウンロード可能

## 🔍 詳細情報
より詳しい情報は[メインのREADME](../README.md)を参照してください。
