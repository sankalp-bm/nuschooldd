import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import { THEMES, applyTheme, triggerSuccessFeedback } from './utils';
import nuLogo from './assets/nu-logo.svg';
import './App.css'; 

// --- Component 1: Menu Overlay ---
// This handles the Contact/Themeing/Admin links
const MenuOverlay = ({ setView, onClose }) => {
    const themes = Object.keys(THEMES);
    const currentTheme = localStorage.getItem('theme') || 'bronze-black';

    const handleThemeChange = (themeKey) => {
        applyTheme(themeKey);
        // Note: The main app will automatically re-render due to the CSS variables changing
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
        <div className="card-container menu-overlay" role="dialog" aria-modal="true" aria-labelledby="menu-title">
            <button 
                onClick={onClose} 
                className="back-button"
                aria-label="Close menu"
            >
                ← Back
            </button>
            <h2 id="menu-title">Need Help?</h2>
            <p style={{color: '#777', marginBottom: '25px'}}>Choose how you'd like to reach us.</p>
            
            {/* Contact Options (Matching Lovable Image with theme colors) */}
            <a 
                href="mailto:friend@nuschool.com" 
                className="menu-button menu-button-email"
                aria-label="Email us"
            >
                <span style={{ fontSize: '1.2em' }}>✉️</span> Email Us
            </a>
            <a 
                href="https://wa.me/917676885989" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="menu-button menu-button-whatsapp"
                aria-label="WhatsApp us"
            >
                <span style={{ fontSize: '1.2em' }}>💬</span> WhatsApp Us
            </a>
            
            {/* Share Button */}
            <button 
                onClick={handleShare}
                className="menu-button menu-button-share"
                aria-label="Share this page"
            >
                <span style={{ fontSize: '1.2em' }}>🔗</span> Share
            </button>
            
            {/* Admin Login */}
            <button 
                onClick={() => { setView('admin'); onClose(); }} 
                className="menu-button menu-button-admin"
                aria-label="Admin login"
            >
                <span style={{ fontSize: '1.2em' }}>🔑</span> Admin Login
            </button>

            {/* Theme Switcher - Repositioned and styled differently */}
            <div className="theme-section">
                <h3>Change Theme ({currentTheme})</h3>
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
        </div>
    );
};


// --- Component 2: Home Category Content ---
const HomeContent = ({ clientName }) => {
    return (
        <div className="home-card">
            <h1>Hi, {clientName}! ✋</h1>
            <p style={{ fontSize: '1.1em', color: '#555', marginBottom: '20px' }}>Welcome to NU School, your learning adventure starts now! 🚀</p>
            
            <h2>How to Get Started:</h2>
            <ol>
                <li>Use the dropdown above to choose a subject you'd like to explore</li>
                <li>Complete activities and challenges to learn new things</li>
                <li>Have fun and celebrate your achievements! 🌟</li>
            </ol>
            
            <button 
                onClick={() => triggerSuccessFeedback('fireworks')}
                className="primary-button" 
                style={{ width: 'auto', padding: '15px 30px', marginTop: '25px' }}
                aria-label="Test success feedback animation"
            >
                Test Success Feedback 🎉
            </button>
            <p style={{ color: '#777', fontSize: '0.9em', marginTop: '10px' }}>*The button above is just for testing the animations!*</p>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  
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
            let { data, error } = await supabase
                .from('categories')
                .select('id, title, lovable_link')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching categories:', error);
                setError('Could not load categories. Check Supabase RLS policies and Vercel Environment Variables.');
            } else {
                // Prepend the required Home category
                const homeCategory = { id: 0, title: "Home", lovable_link: "home" };
                const allCategories = [homeCategory, ...data];
                
                setCategories(allCategories);
                
                // If a non-home link was previously selected, default back to home
                if (selectedLink !== 'home' && selectedLink === '') {
                    setSelectedLink('home');
                }
            }
        }
        fetchCategories();
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

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

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
      return <MenuOverlay setView={setView} onClose={() => setIsMenuOpen(false)} />;
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
                  {/* Search Input */}
                  <div className="search-container">
                      <input
                          type="text"
                          placeholder="Search subjects..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input"
                          aria-label="Search categories"
                      />
                      <span className="search-icon" aria-hidden="true">🔍</span>
                  </div>
                  
                  {/* Dropdown - Shows filtered results if search is active */}
                  <select 
                      onChange={handleCategoryChange} 
                      value={selectedLink} 
                      className="category-select"
                      aria-label="Select a category"
                  >
                      {(searchQuery.trim() ? filteredCategories : categories).map((cat) => (
                          <option key={cat.id} value={cat.lovable_link}> 
                              {cat.title}
                          </option>
                      ))}
                  </select>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}
              
              {/* --- Lovable Category Section (Dynamically Renders Home or iFrame) --- */}
              <div className="lovable-section">
                  {selectedLink === 'home' ? (
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
