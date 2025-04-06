import ForceGraph3D from "https://esm.sh/react-force-graph-3d?external=react";
import React, { useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { convertMemoryToGraph } from "./utils/dataConverter.js";

function App() {
  const [graphData, setGraphData] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState('memory');
  const [rawData, setRawData] = useState(null);

  // データをダウンロードする関数
  const downloadData = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // データセットを読み込む関数
  const loadDataset = async (datasetName) => {
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
    }
  };

  // 初回マウント時とデータセット変更時にロード
  useEffect(() => {
    loadDataset(selectedDataset);
  }, [selectedDataset]);

  // UIのスタイル
  const controlStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: '100',
    background: 'rgba(0,0,0,0.7)',
    padding: '10px',
    borderRadius: '4px',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  };

  const selectStyle = {
    padding: '5px',
    background: '#333',
    color: 'white',
    border: '1px solid #666',
    borderRadius: '3px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const buttonStyle = {
    padding: '5px 10px',
    background: '#444',
    color: 'white',
    border: '1px solid #666',
    borderRadius: '3px',
    cursor: 'pointer',
    marginLeft: '5px'
  };

  // データが読み込まれるまでローディング表示
  if (!graphData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white',
        background: '#000003'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={controlStyle}>
        <div style={{ marginBottom: '10px' }}>
          データセット:
          <select 
            value={selectedDataset} 
            onChange={(e) => setSelectedDataset(e.target.value)}
            style={selectStyle}
          >
            <option value="memory">メモリデータ</option>
            <option value="miserables">レ・ミゼラブル</option>
          </select>
        </div>
        <div>
          <button 
            onClick={() => downloadData(rawData, `${selectedDataset}_raw.json`)}
            style={buttonStyle}
          >
            元データをダウンロード
          </button>
          <button 
            onClick={() => downloadData(graphData, `${selectedDataset}_converted.json`)}
            style={buttonStyle}
          >
            変換データをダウンロード
          </button>
        </div>
      </div>
      <Graph data={graphData} />
    </div>
  );
}

// グラフコンポーネント
function Graph({ data }) {
  const fgRef = useRef();

  useEffect(() => {
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 4;
    bloomPass.radius = 1;
    bloomPass.threshold = 0;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  const formatNodeLabel = node => {
    const title = `<div style="
      font-size: 14px;
      font-weight: bold;
      color: #FFF;
      background: rgba(0,0,0,0.7);
      padding: 5px;
      border-radius: 4px;
      margin-bottom: 5px;
    ">${node.id}</div>`;

    const observations = node.observations ? node.observations.map(obs => 
      `<div style="
        background: rgba(0,0,0,0.6);
        padding: 3px 5px;
        margin: 2px 0;
        border-radius: 3px;
        font-size: 12px;
        color: #DDD;
      ">${obs}</div>`
    ).join('') : '';

    return `<div style="
      min-width: 200px;
      max-width: 300px;
    ">${title}${observations}</div>`;
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
      linkLabel={link => `<div style="
        background: rgba(0,0,0,0.7);
        padding: 3px 6px;
        border-radius: 3px;
        font-size: 12px;
        color: #FFF;
      ">${link.type || ''}</div>`}
    />
  );
}

// Reactアプリケーションのマウント
createRoot(document.getElementById("graph")).render(<App />);
