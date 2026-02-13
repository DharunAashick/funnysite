import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import videoFile from './assets/vid.mp4'
import './App.css'
import { API_ENDPOINTS } from './config'

function App() {
  const [name, setName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [noPressed, setNoPressed] = useState(false);
  const [yesBtnPosition, setYesBtnPosition] = useState({});

  // Floating hearts generation
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate initial hearts
    const newHearts = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 10 + 10 + 's',
      delay: Math.random() * 10 + 's',
      size: Math.random() * 20 + 10 + 'px'
    }));
    setHearts(newHearts);
  }, []);

  const moveYesButton = () => {
    const x = Math.random() * 200 - 100; // Increased range: -100 to 100
    const y = Math.random() * 200 - 100; // Increased range: -100 to 100

    setYesBtnPosition({
      transform: `translate(${x}px, ${y}px)`,
      transition: 'all 0.2s ease'
    });
  };



  const [yesHoverCount, setYesHoverCount] = useState(0);

  const getYesButtonText = () => {
    if (yesHoverCount === 0) return "YES";
    if (yesHoverCount === 1) return "Please No 🥰";
    return "think again 😃";
  };

  const handleYesHover = () => {
    moveYesButton();
    setYesHoverCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setNoPressed(true);
  };

  const handleNoClick = () => {
    setNoPressed(true);
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        // Save name to backend server
        const response = await fetch(API_ENDPOINTS.saveName, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name.trim() }),
        });

        if (response.ok) {
          console.log('Name saved to server:', name.trim());
          setNameSubmitted(true);
        } else {
          console.error('Failed to save name');
          // Still allow them to continue even if save fails
          setNameSubmitted(true);
        }
      } catch (error) {
        console.error('Error saving name:', error);
        // Still allow them to continue even if save fails
        setNameSubmitted(true);
      }
    }
  };

  useEffect(() => {
    if (noPressed) {
      const colors = ['#ff69b4', '#ffd700', '#00bfff', '#32cd32']; // Vibrant paper colors

      const interval = setInterval(function () {
        // Continuous Poppers/Paper effect
        const particleCount = 2; // Low density for constant background

        confetti({
          particleCount: 5, // Spawn a few at a time
          startVelocity: 30,
          spread: 360,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: colors,
          shapes: ['square'], // Paper look
          scalar: 1.2,
          gravity: 0.6,
          ticks: 600, // Stay on screen longer
          zIndex: 0,
          disableForReducedMotion: true
        });
      }, 200);

      // We still need to clear interval on unmount to avoid leaks if component unmounts
      return () => clearInterval(interval);
    }
  }, [noPressed]);

  return (
    <div className="container">
      {/* Hidden admin link - Click on the title */}
      <a 
        href="/admin" 
        style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          opacity: '0.1',
          fontSize: '12px',
          color: '#e84393',
          textDecoration: 'none',
          zIndex: 1000
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.1'}
      >
        Admin
      </a>
      
      {/* Background Hearts */}
      <div className="hearts-container">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: heart.left,
              animationDuration: heart.animationDuration,
              animationDelay: heart.delay,
              fontSize: heart.size
            }}
          >
            ❤️
          </div>
        ))}
        {/* We can also just use CSS shapes if we prefer, but emojis are vibrant */}
      </div>

      {!nameSubmitted ? (
        <div className="card">
          <h1 className="title">
            Welcome! 💖
          </h1>
          <p className="subtext">Please enter your name to continue</p>
          <form onSubmit={handleNameSubmit} style={{ marginTop: '30px' }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="name-input"
              autoFocus
            />
            <button type="submit" className="btn no-btn" style={{ marginTop: '20px' }}>
              Continue
            </button>
          </form>
        </div>
      ) : noPressed ? (
        <div className="card success-container">
          <h1 className="success-title">April Fool!!! 😂🤣</h1>
          <h3 className="subtext">Indha twist epadi iruku 🤣</h3>
          <img
            src="https://media.tenor.com/dgLnWn-cuooAAAAi/its-just-a-prank-just-a-prank-bro.gif"
            alt="Just a prank"
            style={{ width: '800px', maxWidth: '100%', borderRadius: '16px', marginTop: '20px' }}
          />
        </div>
      ) : (
        <div className="card">
          <h1 className="title">
            <span className="highlight">{name},</span>
            Will you be my Valentine? 💖💞
          </h1>

          <p className="subtext">Choose wisely. (The "Yes" button is... playing hard to get.)</p>

          <div className="btn-group">
            <button
              className="btn yes-btn"
              style={yesBtnPosition}
              onMouseEnter={handleYesHover}
              onClick={handleYesClick}
            >
              {getYesButtonText()}
            </button>

            <button
              className="btn no-btn"
              onClick={handleNoClick}
            >
              NO
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
