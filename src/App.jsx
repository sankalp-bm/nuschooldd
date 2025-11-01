import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import { THEMES, applyTheme, triggerSuccessFeedback } from './utils';
import nuLogo from './assets/nu-logo.svg';
import './App.css'; 

// --- Component 1: Menu Overlay ---
// This handles the Contact/Themeing/Admin links
const MenuOverlay = ({ setView, onClose, clientName, setClientName }) => {
    const themes = Object.keys(THEMES);
    const currentTheme = localStorage.getItem('theme') || 'bronze-black';
    const [nameInput, setNameInput] = useState(clientName);
    const [themeLabel, setThemeLabel] = useState(currentTheme);

    const handleThemeChange = (themeKey) => {
        applyTheme(themeKey);
        setThemeLabel(themeKey);
        // Note: The main app will automatically re-render due to the CSS variables changing
    };

    // Auto-save name when Back button is clicked
    const handleBackClick = () => {
        if (nameInput.trim() !== '') {
            localStorage.setItem('clientName', nameInput.trim());
            setClientName(nameInput.trim());
        }
        onClose();
    };

    const handleShare = async () => {
        const shareData = {
            title: 'NU School - Educational Platform',
            text: 'Check out NU School for amazing learning adventures!',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            // User cancelled or error occurred
            if (err.name !== 'AbortError') {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(shareData.url).then(() => {
                    alert('Link copied to clipboard!');
                });
            }
        }
    };

    return (
        <div className="card-container menu-overlay" role="dialog" aria-modal="true">
            {/* Name Change Input at Top - No Update Button */}
            <div className="name-change-section">
                <label htmlFor="name-input" style={{display: 'block', marginBottom: '8px', fontWeight: '500', textAlign: 'left', color: 'var(--color-text-dark)'}}>
                    Change Name:
                </label>
                <input
                    id="name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="form-input"
                    placeholder="Enter your name"
                />
            </div>

            {/* Contact Options - Reordered: Share, WhatsApp, Email */}
            <button 
                onClick={handleShare}
                className="menu-button menu-button-share"
                aria-label="Share this page"
            >
                <span style={{ fontSize: '1.2em' }}>🔗</span> Share
            </button>
            
            <a 
                href="https://wa.me/917676885989" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="menu-button menu-button-whatsapp"
                aria-label="WhatsApp us"
            >
                <span style={{ fontSize: '1.2em' }}>💬</span> WhatsApp Us
            </a>
            
            <a 
                href="mailto:friend@nuschool.org" 
                className="menu-button menu-button-email"
                aria-label="Email us"
            >
                <span style={{ fontSize: '1.2em' }}>✉️</span> Email Us
            </a>

            {/* Theme Switcher */}
            <div className="theme-section">
                <h3>Change Theme ({themeLabel})</h3>
                <div className="theme-options" role="group" aria-label="Theme selector">
                    {themes.map(themeKey => (
                        <button
                            key={themeKey}
                            type="button"
                            className={`theme-swatch ${themeKey === currentTheme ? 'active' : ''}`}
                            style={{ 
                                backgroundColor: THEMES[themeKey]['--color-primary'],
                            }}
                            onClick={() => handleThemeChange(themeKey)}
                            title={themeKey}
                            aria-label={`Switch to ${themeKey} theme`}
                            aria-pressed={themeKey === currentTheme}
                        />
                    ))}
                </div>
            </div>

            {/* Admin Login as Text Link at Bottom */}
            <div className="admin-link-section">
                <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setView('admin'); onClose(); }} 
                    className="admin-link"
                    aria-label="Admin login"
                >
                    Admin Login
                </a>
            </div>

            {/* Back Button at Bottom Left - Auto-saves name */}
            <div className="menu-footer">
                <button 
                    onClick={handleBackClick} 
                    className="back-button-footer"
                    aria-label="Close menu"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
};


// --- Component 2: Home Category Content ---
const HomeContent = ({ clientName }) => {
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => {
                    console.error('Error playing audio:', err);
                    alert('Unable to play audio. Please try again.');
                });
            }
        }
    };

    return (
        <div className="home-card">
            <h1>Hi {clientName}! 👋</h1>
            <p style={{ fontSize: '1.1em', color: '#555', marginBottom: '20px' }}>
                Welcome to Buddy's NU School. This app is purely about learning in a fun way.
            </p>
            
            <h2>How to get started:</h2>
            <ol style={{textAlign: 'left', maxWidth: '400px', margin: '0 auto 20px'}}>
                <li>Select the subject from dropdown above</li>
                <li>Enjoy the learning & activities</li>
                <li>Have fun & celebrate your learning</li>
            </ol>
            
            <p style={{ fontSize: '1em', color: '#555', marginBottom: '25px', fontStyle: 'italic' }}>
                No Login, No Ads, No Payment :)
            </p>
            
            {/* Hidden Audio Element */}
            <audio ref={audioRef} preload="auto">
                <source src="/nu-rhyme.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            
            <button 
                onClick={handlePlayPause}
                className="primary-button" 
                style={{ width: 'auto', padding: '15px 30px', marginTop: '10px' }}
                aria-label={isPlaying ? "Pause NU Rhyme" : "Play NU Rhyme"}
            >
                {isPlaying ? '⏸ Pause NU Rhyme' : '▶ Play NU Rhyme'}
            </button>
        </div>
    );
};


// --- Component 3: Main Application ---
function App() {
  const [view, setView] = useState('prompt');
  const [categories, setCategories] = useState([]);
  const [selectedLink, setSelectedLink] = useState('home'); // Default to home view
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeKey, setThemeKey] = useState(localStorage.getItem('theme') || 'bronze-black');
  const [isLoading, setIsLoading] = useState(true);
  
  // Apply theme immediately on load
  useEffect(() => {
    applyTheme(themeKey);
  }, [themeKey]);


// --- Fetch Data and Check Local Storage ---
useEffect(() => {
    // Check for saved name and auto-navigate
    const storedName = localStorage.getItem('clientName');
    if (storedName) {
        setClientName(storedName);
        if (view === 'prompt') setView('main');
    } else if (view !== 'prompt') {
        setView('prompt'); // Redirect to prompt if name is missing
    }

    // Fetch categories only in main view
    if (view === 'main') {
        async function fetchCategories() {
            setIsLoading(true);
            let { data, error } = await supabase
                .from('categories')
                .select('id, title, lovable_link')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching categories:', error);
                setError('Could not load categories. Check Supabase RLS policies and Vercel Environment Variables.');
                setIsLoading(false);
            } else {
                // Prepend the required Home category
                const homeCategory = { id: 0, title: "Home", lovable_link: "home" };
                const allCategories = [homeCategory, ...data];
                
                setCategories(allCategories);
                setIsLoading(false);
                
                // If a non-home link was previously selected, default back to home
                if (selectedLink !== 'home' && selectedLink === '') {
                    setSelectedLink('home');
                }
            }
        }
        fetchCategories();
    } else {
        setIsLoading(false);
    }
  }, [view, selectedLink]);

  const handleNameSubmit = () => {
    if (clientName.trim() !== '') {
      localStorage.setItem('clientName', clientName);
      setView('main');
      setThemeKey(localStorage.getItem('theme') || 'bronze-black'); // Re-apply theme
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedLink(event.target.value);
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to close menu
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
      // Alt+M to open menu
      if (e.altKey && e.key === 'm' && !isMenuOpen) {
        setIsMenuOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);
  
  // --- FINAL RENDER LOGIC (Router) ---

  // Show Admin Panel
  if (view === 'admin') {
      return <Admin setView={setView} theme={themeKey} />;
  }

  // Show Menu Overlay
  if (isMenuOpen) {
      return <MenuOverlay setView={setView} onClose={() => setIsMenuOpen(false)} clientName={clientName} setClientName={setClientName} />;
  }
  
  // Show Name Prompt (Initial screen)
  if (view === 'prompt') {
      return (
          <div className="card-container">
              <h1>Welcome to NU School!</h1>
              <p>Let's start your learning adventure! 🚀</p>
              <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter your name..."
                  className="form-input"
              />
              <button 
                  onClick={handleNameSubmit} 
                  className="primary-button"
                  aria-label="Start learning"
              >
                  Start Learning!
              </button>
          </div>
      );
  }
  
  // Show Main Dashboard
  return (
      // Main App Container uses CSS classes for responsiveness
      <div className="app-container">
          
          <header className="responsive-header" role="banner">
              <div className="header-logo">
                  <img src={nuLogo} alt="NU School Logo" loading="lazy" />
                  <h2 style={{ margin: 0, fontSize: '1.2em', color: 'var(--color-primary)', fontWeight: '600' }}>NU School</h2>
              </div>
              
              {/* Menu Icon */}
              <button 
                  onClick={() => setIsMenuOpen(true)} 
                  className="menu-icon"
                  style={{ color: 'var(--color-secondary)' }}
                  aria-label="Open menu"
                  aria-expanded={isMenuOpen}
              >
                  ☰
              </button>
          </header>

          <div className="main-content">
              
              <div className="category-select-container">
                  {/* Dropdown Only - No Search */}
                  <select 
                      onChange={handleCategoryChange} 
                      value={selectedLink} 
                      className="category-select"
                      aria-label="Select a category"
                  >
                      {categories.map((cat) => (
                          <option key={cat.id} value={cat.lovable_link}> 
                              {cat.title}
                          </option>
                      ))}
                  </select>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}
              
              {/* --- Lovable Category Section (Dynamically Renders Home or iFrame) --- */}
              <div className="lovable-section">
                  {isLoading ? (
                      <div className="loading-placeholder">
                          <span>l</span>
                          <span> </span>
                          <span>o</span>
                          <span> </span>
                          <span>a</span>
                          <span> </span>
                          <span>d</span>
                          <span> </span>
                          <span>i</span>
                          <span> </span>
                          <span>n</span>
                          <span> </span>
                          <span>g</span>
                      </div>
                  ) : selectedLink === 'home' ? (
                      <HomeContent clientName={clientName} />
                  ) : (
                      <iframe
                          title="Lovable Category Section"
                          className="lovable-iframe"
                          src={selectedLink} 
                          key={selectedLink}
                          loading="lazy"
                          aria-label={`Content for ${categories.find(c => c.lovable_link === selectedLink)?.title || 'selected category'}`}
                      />
                  )}
              </div>
          </div>
      </div>
  );
}

export default App;
