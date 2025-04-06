import { execSync } from 'child_process';
import path from 'path';

// スクリプトのパス
const convertScriptPath = path.resolve('./convert.js');

try {
  // デバッグモードで変換スクリプトを実行
  execSync(`node ${convertScriptPath} --debug`, { stdio: 'inherit' });
  
  console.log('デバッグ情報の出力が完了しました');
  console.log('デバッグファイルの場所:');
  console.log('- datasets/debug/memory.parsed.json');
  console.log('- datasets/debug/memory.converted.json');
} catch (error) {
  console.error('変換中にエラーが発生しました');
  process.exit(1);
}
