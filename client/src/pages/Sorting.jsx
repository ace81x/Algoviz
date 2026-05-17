import { useState, useEffect, useCallback } from 'react'
import '../App.css' 

// NEW: We store all algorithm info in one object so it's easy to add more later!
const ALGORITHMS = {
  bubble: {
    title: "BUBBLE SORT",
    endpoint: "http://localhost:8080/api/sort/bubble",
    code: [
      { line: 1, text: "do" },
      { line: 2, text: "  swapped = false" },
      { line: 3, text: "  for i = 1 to indexOfLastUnsortedElement-1" },
      { line: 4, text: "    if leftElement > rightElement" },
      { line: 5, text: "      swap(leftElement, rightElement)" },
      { line: 6, text: "      swapped = true" },
      { line: 7, text: "while swapped" }
    ]
  },
  selection: {
    title: "SELECTION SORT",
    endpoint: "http://localhost:8080/api/sort/selection",
    code: [
      { line: 1, text: "repeat (numOfElements - 1) times" },
      { line: 2, text: "  set first unsorted element as minimum" },
      { line: 3, text: "  for each of the unsorted elements" },
      { line: 4, text: "    if element < currentMinimum" },
      { line: 5, text: "      set element as new minimum" },
      { line: 6, text: "  swap minimum with first unsorted position" }
    ]
  },
  insertion: {
    title: "INSERTION SORT",
    endpoint: "http://localhost:8080/api/sort/insertion",
    code: [
      { line: 1, text: "mark first element as sorted" },
      { line: 2, text: "for each unsorted element X" },
      { line: 3, text: "  'extract' the element X" },
      { line: 4, text: "  for j = lastSortedIndex down to 0" },
      { line: 5, text: "    if current element j > X" },
      { line: 6, text: "      move sorted element to the right by 1" },
      { line: 7, text: "  break loop and insert X here" }
    ]
  }
}

function Sorting() {
  const [activeAlgo, setActiveAlgo] = useState('bubble') // Tracks which tab is clicked
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [arraySize, setArraySize] = useState(10)
  const [inputValue, setInputValue] = useState("")
  const [playbackSpeed, setPlaybackSpeed] = useState(3)

  // Use useCallback so we can safely call this inside useEffect when the algo changes
  const fetchSortingSteps = useCallback(async (arrayToSend) => {
    try {
      // It now dynamically fetches from whatever algo tab is active
      const response = await fetch(ALGORITHMS[activeAlgo].endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arrayToSend)
      })
      const data = await response.json()
      setSteps(data)
      setCurrentStep(0)
      setIsPlaying(false)
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }, [activeAlgo])

  const handleRandomize = useCallback(() => {
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5)
    fetchSortingSteps(newArr)
  }, [arraySize, fetchSortingSteps])

  const handleCreateArray = () => {
    if (!inputValue.trim()) return;
    
    const parsedArray = inputValue
      .split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num)); 

    if (parsedArray.length > 0) {
      fetchSortingSteps(parsedArray);
    }
  }

  // Action 2: "Sort" - Starts the animation immediately
  const handleSortClick = () => {
    // If they click Sort when it's already finished, restart it from the beginning
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }

  // Re-generate array and steps whenever they click a new tab
  useEffect(() => { handleRandomize() }, [handleRandomize, activeAlgo])

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      // Calculate dynamic delay: 1x = 1000ms, 5x = 200ms
      const delay = 1000 / playbackSpeed; 
      
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
      }, delay)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
    // Crucial: Add playbackSpeed to dependencies so changing the slider updates the interval!
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, playbackSpeed])

  if (steps.length === 0) return <div className="loading">Loading Algorithm...</div>

// 1. We extract the new sortedIndices array from Java here
  const currentArray = steps[currentStep].array
  const activeLine = steps[currentStep].activeLine
  const activeIndices = steps[currentStep].activeIndices || []
  const sortedIndices = steps[currentStep].sortedIndices || [] 
  const currentAlgoData = ALGORITHMS[activeAlgo]

  const togglePlay = () => setIsPlaying(!isPlaying)
  const stepForward = () => { setIsPlaying(false); if (currentStep < steps.length - 1) setCurrentStep(c => c + 1); }
  const stepBackward = () => { setIsPlaying(false); if (currentStep > 0) setCurrentStep(c => c - 1); }
  const goToStart = () => { setIsPlaying(false); setCurrentStep(0); }
  const goToEnd = () => { setIsPlaying(false); setCurrentStep(steps.length - 1); }
  const handleTimelineChange = (e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); }

  return (
    <div className="app-container">
      {/* TOP NAVBAR */}
      <header className="top-nav">
        <div className="logo-section">
          <span className="logo-text">AlgoViz</span> 
          <span className="route-text">/sorting</span>
        </div>
        <div className="algo-tabs">
          <span className={activeAlgo === 'bubble' ? 'active-tab' : ''} onClick={() => setActiveAlgo('bubble')}>BUB</span>
          <span className={activeAlgo === 'selection' ? 'active-tab' : ''} onClick={() => setActiveAlgo('selection')}>SEL</span>
          <span className={activeAlgo === 'insertion' ? 'active-tab' : ''} onClick={() => setActiveAlgo('insertion')}>INS</span>
        </div>
      </header>

      {/* MAIN VISUALIZATION CANVAS */}
      <main className="canvas">
        <h2 style={{ position: 'absolute', top: '20px', letterSpacing: '2px', fontWeight: 300 }}>
          {currentAlgoData.title}
        </h2>

        <div className="input-panel">
          <input
            type="text"
            placeholder="e.g. 29, 10, 14, 37"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="custom-array-input"
          />
          <button onClick={handleCreateArray} className="action-btn">Go</button>
          <button onClick={handleSortClick} className="action-btn sort-btn">Sort</button>
        </div>

        <div className="array-container">
          {currentArray.map((value, idx) => {
            const isComparing = activeIndices.includes(idx);
            const isSorted = sortedIndices.includes(idx); // Check if Java flagged this as sorted
            
            // 2. Dynamic class logic: red for comparing, orange for sorted
            let barClass = 'array-bar';
            if (isComparing) barClass += ' comparing';
            else if (isSorted) barClass += ' sorted'; 

            return (
              <div key={idx} className="bar-wrapper">
                <div
                  className={barClass}
                  style={{ height: `${value * 3}px` }}
                >
                  {value}
                </div>
                <div className="bar-index">{idx}</div>
              </div>
            )
          })}
        </div>

        {/* Pseudo-Code Tracker */}
        <div className="code-tracker">
          {currentAlgoData.code.map((codeObj) => (
            <div key={codeObj.line} className={`code-line ${activeLine === codeObj.line ? 'active-line' : ''}`}>
              <pre>{codeObj.text}</pre>
            </div>
          ))}
        </div>
      </main>

      {/* BOTTOM CONTROL BAR */}
      <footer className="bottom-bar">
      <div className="speed-controls">
          {/* Dynamically display the current speed so the user knows exactly what it is */}
          <span style={{ minWidth: '35px' }}>{playbackSpeed}x</span>
          <input 
            type="range" 
            min="1" 
            max="5" 
            step="0.5" 
            value={playbackSpeed} 
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="mini-slider" 
          />
        </div>
        <div className="media-controls">
          <div className="media-buttons">
            <button onClick={goToStart}>|◁</button>
            <button onClick={stepBackward}>◁</button>
            <button onClick={togglePlay} className="play-btn-main">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={stepForward}>▷</button>
            <button onClick={goToEnd}>▷|</button>
          </div>
          <input 
            type="range" className="timeline-slider"
            min="0" max={steps.length > 0 ? steps.length - 1 : 0} 
            value={currentStep} onChange={handleTimelineChange} disabled={steps.length === 0}
          />
        </div>
        <div className="footer-spacer"></div>
      </footer>    
    </div>
  )
}

export default Sorting