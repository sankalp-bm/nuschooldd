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

    return (
        <div className="card-container menu-overlay">
            <button onClick={onClose} className="back-button">← Back</button>
            <h2>Need Help?</h2>
            <p style={{color: '#777', marginBottom: '25px'}}>Choose how you'd like to reach us.</p>
            
            {/* Contact Options (Matching Lovable Image with theme colors) */}
            <a href="mailto:friend@nuschool.com" className="menu-button menu-button-email">
                <span style={{ fontSize: '1.2em' }}>✉️</span> Email Us
            </a>
            <a href="https://wa.me/917676885989" target="_blank" rel="noopener noreferrer" className="menu-button menu-button-whatsapp">
                <span style={{ fontSize: '1.2em' }}>💬</span> WhatsApp Us
            </a>
            
            {/* Admin Login */}
            <button 
                onClick={() => { setView('admin'); onClose(); }} 
                className="menu-button menu-button-admin"
            >
                <span style={{ fontSize: '1.2em' }}>🔑</span> Admin Login
            </button>

            {/* Theme Switcher - Repositioned and styled differently */}
            <div className="theme-section">
                <h3>Change Theme ({currentTheme})</h3>
                <div className="theme-options">
                    {themes.map(themeKey => (
                        <div 
                            key={themeKey}
                            className={`theme-swatch ${themeKey === currentTheme ? 'active' : ''}`}
                            style={{ 
                                backgroundColor: THEMES[themeKey]['--color-primary'],
                            }}
                            onClick={() => handleThemeChange(themeKey)}
                            title={themeKey}
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
              <button onClick={handleNameSubmit} className="primary-button">Start Learning!</button>
          </div>
      );
  }
  
  // Show Main Dashboard
  return (
      // Main App Container uses CSS classes for responsiveness
      <div className="app-container">
          
          <header className="responsive-header">
              <div className="header-logo">
                  <img src={nuLogo} alt="NU School Logo" />
                  <h2 style={{ margin: 0, fontSize: '1.2em', color: 'var(--color-primary)', fontWeight: '600' }}>NU School</h2>
              </div>
              
              {/* Menu Icon */}
              <button 
                  onClick={() => setIsMenuOpen(true)} 
                  className="menu-icon"
                  style={{ color: 'var(--color-secondary)' }}
              >
                  ☰
              </button>
          </header>

          <div className="main-content">
              
              <div className="category-select-container">
                  <select onChange={handleCategoryChange} value={selectedLink} className="category-select">
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
                  {selectedLink === 'home' ? (
                      <HomeContent clientName={clientName} />
                  ) : (
                      <iframe
                          title="Lovable Category Section"
                          className="lovable-iframe"
                          src={selectedLink} 
                          // Key required for iframe to re-render when src changes
                          key={selectedLink} 
                      />
                  )}
              </div>
          </div>
      </div>
  );
}

export default App;
