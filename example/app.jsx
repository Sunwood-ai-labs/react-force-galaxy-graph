import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ForceGraph3D from "react-force-graph-3d";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// 以前の分割コンポーネントに相当する機能をインラインで定義
// グラフコンポーネント
function Graph({ data }) {
  const fgRef = React.useRef();

  React.useEffect(() => {
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 4;
    bloomPass.radius = 1;
    bloomPass.threshold = 0;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  const formatNodeLabel = node => {
    return `<div class="node-label">
      <div class="node-title">${node.id}</div>
      ${node.observations ? node.observations.map(obs => 
        `<div class="node-observation">${obs}</div>`
      ).join('') : ''}
    </div>`;
  };

  return (
    <ForceGraph3D
      ref={fgRef}
      backgroundColor="#000003"
      graphData={data}
      nodeLabel={formatNodeLabel}
      nodeAutoColorBy="group"
      linkDirectionalParticles={1}
      linkOpacity={0.1}
      linkWidth={0.3}
      linkCurvature="curvature"
      linkLabel={link => `<div class="link-label">${link.type || ''}</div>`}
    />
  );
}

// コントロールパネルコンポーネント
function ControlPanel({ selectedDataset, setSelectedDataset, downloadRawData, downloadConvertedData }) {
  return (
    <div className="control-panel">
      <div className="control-group">
        データセット:
        <select 
          value={selectedDataset} 
          onChange={(e) => setSelectedDataset(e.target.value)}
          className="dataset-select"
        >
          <option value="memory">メモリデータ</option>
          <option value="miserables">レ・ミゼラブル</option>
        </select>
      </div>
      <div>
        <button 
          onClick={downloadRawData}
          className="control-button"
        >
          元データをダウンロード
        </button>
        <button 
          onClick={downloadConvertedData}
          className="control-button"
        >
          変換データをダウンロード
        </button>
      </div>
    </div>
  );
}

// データコンバーター関数
function convertMemoryToGraph(memoryData) {
  // 文字列の場合は行ごとにJSONパース
  const lines = typeof memoryData === 'string' 
    ? memoryData.split('\n').filter(line => line.trim())
    : Array.isArray(memoryData) ? memoryData : [memoryData];

  const entities = [];
  const relations = [];

  // 各行をパースしてentityとrelationに分類
  lines.forEach(line => {
    try {
      const data = typeof line === 'string' ? JSON.parse(line) : line;
      if (data.type === 'entity') {
        entities.push(data);
      } else if (data.type === 'relation') {
        relations.push(data);
      }
    } catch (error) {
      console.warn('無効なJSONデータをスキップしました:', line);
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

// JSONデータをファイルとしてダウンロードする関数
function downloadJsonData(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// メインアプリケーション
function App() {
  const [graphData, setGraphData] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState('memory');
  const [rawData, setRawData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // データセットを読み込む関数
  const loadDataset = async (datasetName) => {
    setIsLoading(true);
    try {
      if (datasetName === 'memory') {
        const response = await fetch("../datasets/memory.json");
        const text = await response.text();
        setRawData(text);  // 生データを保存
        const data = convertMemoryToGraph(text);
        setGraphData(data);
      } else {
        const response = await fetch("../datasets/miserables.json");
        const data = await response.json();
        setRawData(data);  // 生データを保存
        setGraphData(data);
      }
    } catch (error) {
      console.error('データセットの読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回マウント時とデータセット変更時にロード
  useEffect(() => {
    loadDataset(selectedDataset);
  }, [selectedDataset]);

  // 元データのダウンロード
  const handleDownloadRawData = () => {
    downloadJsonData(rawData, `${selectedDataset}_raw.json`);
  };

  // 変換データのダウンロード
  const handleDownloadConvertedData = () => {
    downloadJsonData(graphData, `${selectedDataset}_converted.json`);
  };

  // ローディング中の表示
  if (isLoading || !graphData) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="graph-container">
      <ControlPanel
        selectedDataset={selectedDataset}
        setSelectedDataset={setSelectedDataset}
        downloadRawData={handleDownloadRawData}
        downloadConvertedData={handleDownloadConvertedData}
      />
      <Graph data={graphData} />
    </div>
  );
}

// Reactアプリケーションのマウント
createRoot(document.getElementById("graph")).render(<App />);
