import { convertMemoryToMiserables } from '../utils/dataConverter.js';
import fs from 'fs';

// memory.jsonを読み込んで変換
const memoryData = fs.readFileSync('./datasets/memory.json', 'utf8');
try {
  convertMemoryToMiserables(memoryData);
  console.log('変換とデバッグファイルの生成が完了しました');
  console.log('デバッグファイルの場所:');
  console.log('- datasets/debug/memory.parsed.json');
  console.log('- datasets/debug/memory.converted.json');
} catch (error) {
  console.error('変換中にエラーが発生しました:', error);
  process.exit(1);
}
