# react-force-galaxy-graph

メモリデータとLes Misérablesデータを表示するグラフビジュアライゼーション

## データ変換

memory.json形式のデータをmiserables.json形式に変換する方法は以下の3通りです：

### 1. アプリケーション実行時の自動変換

アプリケーション実行時に自動的にmemory.jsonを変換し、グラフ表示します。
エラーが発生した場合は自動的にmiserables.jsonにフォールバックします。

### 2. スクリプトによる手動変換

```bash
node example/scripts/convert.js
```

memory.jsonを読み込み、memory.miserables.jsonとして出力します。

### 3. ユーティリティ関数としての利用

```javascript
import { convertMemoryToMiserables } from './utils/dataConverter.js';

const memoryData = `{"type":"entity",...}`;
const converted = convertMemoryToMiserables(memoryData);
```

## ファイル構造

- `datasets/`
  - `memory.json` - 元のメモリデータ
  - `miserables.json` - Les Misérablesデータ
  - `memory.miserables.json` - 変換後のメモリデータ
- `example/`
  - `utils/dataConverter.js` - 変換ユーティリティ
  - `scripts/convert.js` - 変換スクリプト
  - `app.jsx` - メインアプリケーション
