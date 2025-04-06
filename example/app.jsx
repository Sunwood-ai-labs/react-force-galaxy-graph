import ForceGraph3D from "https://esm.sh/react-force-graph-3d?external=react";
import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { convertMemoryToMiserables, getDebugData } from "./utils/dataConverter.js";

// デバッグデータをダウンロードする関数
function downloadDebugData(key, filename) {
  const data = getDebugData(key);
  if (data) {
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
}

// memory.jsonを読み込んで変換、エラー時はmiserables.jsonにフォールバック
fetch("../datasets/memory.json")
  .then((res) => res.text())
  .then((text) => {
    try {
      const data = convertMemoryToMiserables(text);
      // デバッグデータのダウンロードボタンを追加
      const debugDiv = document.createElement('div');
      debugDiv.style.position = 'absolute';
      debugDiv.style.top = '10px';
      debugDiv.style.right = '10px';
      debugDiv.style.zIndex = '100';
      debugDiv.innerHTML = `
        <button onclick="window.downloadParsed()">Download Parsed Data</button>
        <button onclick="window.downloadConverted()">Download Converted Data</button>
      `;
      document.body.appendChild(debugDiv);
      
      // グローバルにダウンロード関数を公開
      window.downloadParsed = () => downloadDebugData('memory_parsed', 'memory.parsed.json');
      window.downloadConverted = () => downloadDebugData('memory_converted', 'memory.converted.json');

      initializeGraph(data);
    } catch (error) {
      console.warn('memory.jsonの処理中にエラーが発生しました。miserables.jsonを使用します:', error);
      // フォールバック: miserables.jsonを使用
      fetch("../datasets/miserables.json")
        .then((res) => res.json())
        .then((data) => initializeGraph(data))
        .catch((error) => console.error('miserables.jsonの読み込みに失敗しました:', error));
    }
  })
  .catch((error) => {
    console.warn('memory.jsonの読み込みに失敗しました。miserables.jsonを使用します:', error);
    // フォールバック: miserables.jsonを使用
    fetch("../datasets/miserables.json")
      .then((res) => res.json())
      .then((data) => initializeGraph(data))
      .catch((error) => console.error('miserables.jsonの読み込みに失敗しました:', error));
  });

function initializeGraph(data) {
  const FocusGraph = () => {
    const fgRef = useRef();

    useEffect(() => {
      const bloomPass = new UnrealBloomPass();
      bloomPass.strength = 4;
      bloomPass.radius = 1;
      bloomPass.threshold = 0;
      fgRef.current.postProcessingComposer().addPass(bloomPass);
    }, []);

    return (
      <ForceGraph3D
        ref={fgRef}
        backgroundColor="#000003"
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles={1}
        linkOpacity={0.1}
        linkWidth={0.3}
        linkCurvature="curvature"
      />
    );
  };

  createRoot(document.getElementById("graph")).render(<FocusGraph />);
}
