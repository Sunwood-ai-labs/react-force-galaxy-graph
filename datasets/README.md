# 📊 データセット

このディレクトリには、グラフビジュアライゼーションで使用されるデータセットが含まれています。

## 📂 ファイル構成

### memory.json
MCPサーバーから生成されるメモリデータ。エンティティとその関係性を表現します。

形式:
```json
{
  "type": "entity" | "relation",
  "name": "string",          // エンティティ名
  "entityType": "string",    // エンティティの種類
  "observations": string[],  // エンティティの観察情報
  // または
  "from": "string",         // 関係性の開始エンティティ
  "to": "string",          // 関係性の終了エンティティ
  "relationType": "string" // 関係性の種類
}
```

### miserables.json
Les Misérables（レ・ミゼラブル）の登場人物の関係性を表すデータセット。グラフ表示用の標準フォーマットとして使用されています。

形式:
```json
{
  "nodes": [
    {
      "id": "string",
      "group": "number"
    }
  ],
  "links": [
    {
      "source": "string",
      "target": "string",
      "value": "number"
    }
  ]
}
```

### データ変換について
アプリケーションは自動的にmemory.jsonのエンティティと関係性のデータを、グラフ表示用のノードとリンクの形式に変換します：
- エンティティ → ノード
- 関係性 → リンク

## 🔍 詳細情報
より詳しい情報は[メインのREADME](../README.md)を参照してください。
