// メモリデータをグラフ表示用のデータに変換する
export function convertMemoryToGraph(memoryData) {
  // 文字列の場合は行ごとにJSONパース
  const lines = typeof memoryData === 'string' 
    ? memoryData.split('\n').filter(line => line.trim())
    : Array.isArray(memoryData) ? memoryData : [memoryData];

  const entities = [];
  const relations = [];

  // 各行をパースしてentityとrelationに分類
  lines.forEach(line => {
    const data = typeof line === 'string' ? JSON.parse(line) : line;
    if (data.type === 'entity') {
      entities.push(data);
    } else if (data.type === 'relation') {
      relations.push(data);
    }
  });

  // entityTypeごとにグループ番号を割り当て
  const entityTypes = [...new Set(entities.map(e => e.entityType))];
  const groupMap = Object.fromEntries(entityTypes.map((type, i) => [type, i + 1]));

  // ノードの作成
  const nodes = entities.map(entity => ({
    id: entity.name,
    group: groupMap[entity.entityType],
    entityType: entity.entityType,
    observations: entity.observations || []
  }));

  // リンクの作成
  const links = relations.map(relation => ({
    source: relation.from,
    target: relation.to,
    value: 1,
    type: relation.relationType
  }));

  return { nodes, links };
}
