import { Link } from 'react-router-dom';
import './Landing.css'; 
import sortingImg from '../assets/sorting.gif';
import graphImg from '../assets/graph.gif';

function Landing() {
  return (
    <div className="landing-container">
      <main className="hero-section">
        
        {/* YOUR ASCII ART GOES HERE */}
        <pre className="ascii-art">
{`
 █████╗ ██╗      ██████╗  ██████╗ ██╗   ██╗██╗███████╗
██╔══██╗██║     ██╔════╝ ██╔═══██╗██║   ██║██║╚══███╔╝
███████║██║     ██║  ███╗██║   ██║██║   ██║██║  ███╔╝ 
██╔══██║██║     ██║   ██║██║   ██║╚██╗ ██╔╝██║ ███╔╝  
██║  ██║███████╗╚██████╔╝╚██████╔╝ ╚████╔╝ ██║███████╗
╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝   ╚═══╝  ╚═╝╚══════╝
`}
        </pre>
        
        <h2>visualising data structures and algorithms<br/>through animation</h2>
        
        <div className="module-grid">
          {/* Active Card 1: Sorting */}
          <Link to="/sorting" className="module-card">
            <img src={sortingImg} alt="Sorting Algorithms" className="card-image" />
            <div className="card-content">
              <h3>Sorting</h3>
              <div className="card-tags">
                <span>Bubble</span>
                <span>Selection</span>
                <span>Insertion</span>
              </div>
            </div>
          </Link>

          {/* Active Card 2: Graphs */}
          <Link to="/graph" className="module-card">
            <img src={graphImg} alt="Graph Traversal" className="card-image" />
            <div className="card-content">
              <h3>Graph Traversal</h3>
              <div className="card-tags">
                <span>BFS</span>
                <span>DFS</span>
                <span>Topological Sort</span>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* NEW: Minimalist GitHub Footer */}
      <footer className="landing-footer">
        <a href="https://github.com/ace81x/Algoviz" target="_blank" rel="noopener noreferrer">
          {/* This SVG draws the GitHub Logo natively without needing an image file */}
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          Github
        </a>
      </footer>


    </div>
  );
}

export default Landing;