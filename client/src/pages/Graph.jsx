import { useState, useEffect, useCallback } from 'react';
import '../App.css';

// Our hardcoded graph coordinates to make it look like the VisuAlgo screenshot
const GRAPH_NODES = [
  { id: 1, x: 150, y: 100 },  // Top Left
  { id: 3, x: 650, y: 100 },  // Top Right
  { id: 0, x: 400, y: 250 },  // Center
  { id: 2, x: 480, y: 400 },  // Shifted Right
  { id: 4, x: 480, y: 550 }   // Directly below Node 2
];

const GRAPH_EDGES = [
  [0, 1], [0, 2], [0, 3], // 0's outgoing edges
  [1, 3], [1, 4],         // 1's outgoing edges
  [2, 4],                 // 2's outgoing edges
  [3, 4]                  // 3's outgoing edges
];

const ALGORITHMS = {
  bfs: {
    title: "BREADTH-FIRST SEARCH",
    endpoint: "http://localhost:8080/api/graph/bfs",
    code: [
      { line: 1, text: "queue.push(startNode), mark as visited" },
      { line: 2, text: "while !queue.isEmpty() // u = queue.pop()" },
      { line: 3, text: "  for each neighbor v of u" },
      { line: 4, text: "    if v is unvisited" },
      { line: 5, text: "      mark v as visited, queue.push(v)" },
      { line: 6, text: "Traversal Complete!" }
    ]
  },

  dfs: {
    title: "DEPTH-FIRST SEARCH",
    endpoint: "http://localhost:8080/api/graph/dfs",
    code: [
      { line: 1, text: "DFS(u)" },
      { line: 2, text: "  mark u as visited" },
      { line: 3, text: "  for each neighbor v of u" },
      { line: 4, text: "    if v is unvisited" },
      { line: 5, text: "      DFS(v)" },
      { line: 6, text: "Traversal Complete!" }
    ]
  },

  topo: {
    title: "TOPOLOGICAL SORT",
    endpoint: "http://localhost:8080/api/graph/topo",
    code: [
      { line: 1, text: "init array topoList" },
      { line: 2, text: "for each vertex u in graph" },
      { line: 3, text: "  if u is unvisited, DFS(u)" },
      { line: 4, text: "    mark u as visited" },
      { line: 5, text: "    for each neighbor v of u" },
      { line: 6, text: "      if v is unvisited, DFS(v)" },
      { line: 7, text: "    push u to front of topoList" }
    ]
  }
};

function Graph() {
  const [activeAlgo, setActiveAlgo] = useState('bfs');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(2);

  const fetchGraphSteps = useCallback(async () => {
    try {
      const response = await fetch(ALGORITHMS[activeAlgo].endpoint, { method: 'POST' });
      const data = await response.json();
      setSteps(data);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [activeAlgo]);

  useEffect(() => { fetchGraphSteps(); }, [fetchGraphSteps]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      const delay = 1000 / playbackSpeed;
      interval = setInterval(() => setCurrentStep(prev => prev + 1), delay);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, playbackSpeed]);

  if (steps.length === 0) return <div className="loading">Loading Graph...</div>;

  const currentData = steps[currentStep];
  const activeLine = currentData.activeLine;
  const currentNode = currentData.currentNode;
  const visitedNodes = currentData.visitedNodes || [];
  const activeEdge = currentData.activeEdge || [];

  const togglePlay = () => setIsPlaying(!isPlaying);
  const stepForward = () => { setIsPlaying(false); if (currentStep < steps.length - 1) setCurrentStep(c => c + 1); }
  const stepBackward = () => { setIsPlaying(false); if (currentStep > 0) setCurrentStep(c => c - 1); }
  const goToStart = () => { setIsPlaying(false); setCurrentStep(0); }
  const goToEnd = () => { setIsPlaying(false); setCurrentStep(steps.length - 1); }
  const handleTimelineChange = (e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); }

  return (
    <div className="app-container">
      {/* 1. TOP NAVBAR (Simplified) */}
      <header className="top-nav">
        <div className="logo-section">
          <span className="logo-text">AlgoViz</span> 
          <span className="route-text">/graph</span>
        </div>
        {/* Notice we completely removed the <div className="algo-tabs"> from here */}
      </header>

      {/* 2. GRAPH CANVAS */}
      <main className="canvas">
        <h2 style={{ position: 'absolute', top: '20px', left: '20px', letterSpacing: '2px', fontWeight: 300, margin: 0 }}>
          {ALGORITHMS[activeAlgo]?.title || "GRAPH TRAVERSAL"}
        </h2>

        {/* BOTTOM-LEFT ALGORITHM MENU */}
        <div className="left-menu">
          <div className={`menu-item ${activeAlgo === 'dfs' ? 'active' : ''}`} onClick={() => setActiveAlgo('dfs')}>Depth-First Search</div>
          <div className={`menu-item ${activeAlgo === 'bfs' ? 'active' : ''}`} onClick={() => setActiveAlgo('bfs')}>Breadth-First Search</div>
          <div className={`menu-item ${activeAlgo === 'topo' ? 'active' : ''}`} onClick={() => setActiveAlgo('topo')}>Topological Sort</div>
        </div>

        <div className="graph-wrapper" style={{ position: 'relative', width: '800px', height: '650px' }}>
          
          {/* SVG Layer for Edges */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {GRAPH_EDGES.map((edge, idx) => {
              const source = GRAPH_NODES.find(n => n.id === edge[0]);
              const target = GRAPH_NODES.find(n => n.id === edge[1]);
              const isActive = activeEdge && activeEdge[0] === edge[0] && activeEdge[1] === edge[1];
              
              return (
                <line 
                  key={idx} x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                  stroke={isActive ? "#d2737d" : "#333"} // CHANGED: Default is now bold dark grey
                  strokeWidth={isActive ? "6" : "4"}     // CHANGED: Thicker lines
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#333" /> {/* CHANGED: Dark grey arrowheads */}
              </marker>
            </defs>
          </svg>

          {/* HTML Layer for Nodes */}
          {GRAPH_NODES.map((node) => {
            let nodeClass = "graph-node";
            if (currentNode === node.id) nodeClass += " current-node";
            else if (visitedNodes.includes(node.id)) nodeClass += " visited-node";

            // Extract Topo Index (if it exists for this node)
            const topoOrderMap = currentData.topoOrder || {};
            const topoIndex = topoOrderMap[node.id];

            return (
              <div 
                key={node.id} className={nodeClass}
                style={{ position: 'absolute', left: node.x - 20, top: node.y - 20, zIndex: 10 }}
              >
                {node.id}
                
                {/* NEW: Render the Red Topo Index! */}
                {activeAlgo === 'topo' && topoIndex !== undefined && (
                  <div className="topo-index">{topoIndex}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pseudo-Code Tracker */}
        <div className="code-tracker">
          {ALGORITHMS[activeAlgo]?.code?.map((codeObj) => (
            <div key={codeObj.line} className={`code-line ${activeLine === codeObj.line ? 'active-line' : ''}`}>
              <pre>{codeObj.text}</pre>
            </div>
          ))}
        </div>
      </main>

      {/* 3. BOTTOM CONTROL BAR */}
      <footer className="bottom-bar">
         <div className="speed-controls">
          <span style={{ minWidth: '35px' }}>{playbackSpeed}x</span>
          <input type="range" min="1" max="5" step="0.5" value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} className="mini-slider" />
        </div>
        <div className="media-controls">
          <div className="media-buttons">
            <button onClick={goToStart}>|◁</button>
            <button onClick={stepBackward}>◁</button>
            <button onClick={togglePlay} className="play-btn-main">{isPlaying ? '⏸' : '▶'}</button>
            <button onClick={stepForward}>▷</button>
            <button onClick={goToEnd}>▷|</button>
          </div>
          <input type="range" className="timeline-slider" min="0" max={steps.length > 0 ? steps.length - 1 : 0} value={currentStep} onChange={handleTimelineChange} />
        </div>
        <div className="footer-spacer"></div>
      </footer>    
    </div>
  );
}

export default Graph;