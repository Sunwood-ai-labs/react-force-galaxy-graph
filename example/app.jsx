import ForceGraph3D from "https://esm.sh/react-force-graph-3d?external=react";
import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";

fetch("../datasets/miserables.json")
  .then((res) => res.json())
  .then((data) => {
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
  });
