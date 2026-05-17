import { Link } from 'react-router-dom';
import './Landing.css'; 

function Landing() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">VISUALGO Clone</div>
        <div className="nav-links">
          <span>About</span>
          <span>Team</span>
          <span>Login</span>
        </div>
      </header>

      <main className="hero-section">
        <h1>visualising data structures and algorithms through animation</h1>
        
        <div className="search-container">
          <input type="text" placeholder="Search an algorithm..." className="search-bar" />
        </div>

        <div className="module-grid">
          {/* Active Card: Sorting */}
          <Link to="/sorting" className="module-card active-card">
            <div className="card-icon">📊</div>
            <h3>Sorting</h3>
            <p>Bubble, Selection, Insertion, Merge, Quick, Radix</p>
          </Link>

          {/* Inactive Cards */}
          <div className="module-card inactive-card">
            <div className="card-icon">🌳</div>
            <h3>Binary Search Tree</h3>
            <p>Coming Soon</p>
          </div>
          <div className="module-card inactive-card">
            <div className="card-icon">🔗</div>
            <h3>Linked List</h3>
            <p>Coming Soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;