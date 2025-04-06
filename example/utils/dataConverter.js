/**
 * デバッグ用データをローカルストレージに保存
 * @param {string} key ストレージのキー
 * @param {Object} data 保存するデータ
 */
function saveDebugData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data, null, 2));
    console.log(`デバッグデータを保存しました: ${key}`);
  } catch (error) {
    console.error(`デバッグデータの保存中にエラーが発生しました(${key}):`, error);
  }
}

/**
 * メモリデータをmiserables形式に変換する
 * @param {string|Array} memoryData - JSONLデータ（文字列または配列）
 * @returns {Object} miserables形式のデータ
 */
export function convertMemoryToMiserables(memoryData) {
  try {
    // 入力データのパース
    const data = typeof memoryData === 'string' 
      ? memoryData.split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line))
      : memoryData;

    // デバッグ用：パース後のデータを保存
    saveDebugData('memory_parsed', data);
    console.log('===== Parsed Memory Data =====');
    console.log(data);

    const entities = data.filter(item => item.type === "entity");
    const relations = data.filter(item => item.type === "relation");

    // entityTypeごとにグループ番号を割り当て
    const entityTypes = [...new Set(entities.map(e => e.entityType))];
    const entityTypeToGroup = Object.fromEntries(
      entityTypes.map((type, index) => [type, index + 1])
    );

    // ノードの変換
    const nodes = entities.map(entity => ({
      id: entity.name,
      group: entityTypeToGroup[entity.entityType]
    }));

    // エッジの変換（すべての関係の重みを1に設定）
    const links = relations.map(relation => ({
      source: relation.from,
      target: relation.to,
      value: 1
    }));

    const result = { nodes, links };

    // デバッグ用：変換後のデータを保存
    saveDebugData('memory_converted', result);
    console.log('===== Converted Miserables Format =====');
    console.log(result);

    return result;
  } catch (error) {
    console.error('データ変換中にエラーが発生しました:', error);
    throw error;
  }
}

// デバッグデータを取得するユーティリティ関数
export function getDebugData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`デバッグデータの取得中にエラーが発生しました(${key}):`, error);
    return null;
  }
}
