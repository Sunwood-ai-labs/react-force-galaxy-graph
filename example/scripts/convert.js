import { convertMemoryToMiserables, convertWithDebugInfo } from '../utils/dataConverter.js';
import fs from 'fs';
import path from 'path';

/**
 * memory.jsonをmiserables.json形式に変換するスクリプト
 */
(async function() {
  try {
    // 引数の解析
    const args = process.argv.slice(2);
    const debug = args.includes('--debug');
    const input = args.find(arg => arg.startsWith('--input='))?.split('=')[1] || '../datasets/memory.json';
    const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || '../datasets/memory.miserables.json';
    
    console.log(`入力ファイル: ${input}`);
    console.log(`出力ファイル: ${output}`);
    
    // 入力ファイルの読み込み
    const memoryData = fs.readFileSync(input, 'utf8');
    
    // 出力ディレクトリの確認と作成
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    if (debug) {
      // デバッグモード: より詳細な情報を出力
      const debugDir = path.join(outputDir, 'debug');
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir, { recursive: true });
      }
      
      const result = convertWithDebugInfo(memoryData);
      
      // パース結果の保存
      fs.writeFileSync(
        path.join(debugDir, 'memory.parsed.json'), 
        JSON.stringify(result.parsed, null, 2)
      );
      
      // 変換結果の保存
      fs.writeFileSync(
        path.join(debugDir, 'memory.converted.json'), 
        JSON.stringify(result.converted, null, 2)
      );
      
      // 統計情報の出力
      console.log('変換統計:');
      console.log(`- エンティティ数: ${result.stats.entityCount}`);
      console.log(`- リレーション数: ${result.stats.relationCount}`);
      console.log(`- ノード数: ${result.stats.nodeCount}`);
      console.log(`- リンク数: ${result.stats.linkCount}`);
      
      // 最終出力
      fs.writeFileSync(output, JSON.stringify(result.converted, null, 2));
    } else {
      // 通常モード: シンプルに変換して出力
      const converted = convertMemoryToMiserables(memoryData);
      fs.writeFileSync(output, JSON.stringify(converted, null, 2));
    }
    
    console.log(`変換が完了しました: ${output}`);
  } catch (error) {
    console.error('変換中にエラーが発生しました:', error);
    process.exit(1);
  }
})();
