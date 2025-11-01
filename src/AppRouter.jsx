import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import { THEMES, applyTheme } from './utils';
import nuLogo from './assets/nu-logo.svg';
import CategorySelector from './components/CategorySelector';
import Footer from './components/Footer';
import './App.css';

// --- Component 1: Menu Overlay ---
const MenuOverlay = ({ onClose, clientName, setClientName }) => {
    const navigate = useNavigate();
    const themes = Object.keys(THEMES);
    const currentTheme = localStorage.getItem('theme') || 'bronze-black';
    const [nameInput, setNameInput] = useState(clientName);
    const [themeLabel, setThemeLabel] = useState(currentTheme);
    const [showSaved, setShowSaved] = useState(false);

    const handleThemeChange = (themeKey) => {
        applyTheme(themeKey);
        setThemeLabel(themeKey);
    };

    const handleBackClick = () => {
        if (nameInput.trim() !== '') {
            localStorage.setItem('clientName', nameInput.trim());
            setClientName(nameInput.trim());
            // Show saved notification
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        }
        onClose();
    };

    const handleNameChange = (e) => {
        setNameInput(e.target.value);
        // Auto-save immediately
        if (e.target.value.trim() !== '') {
            localStorage.setItem('clientName', e.target.value.trim());
            setClientName(e.target.value.trim());
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        }
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
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                navigator.clipboard.writeText(shareData.url).then(() => {
                    alert('Link copied to clipboard!');
                });
            }
        }
    };

    const handleAdminClick = (e) => {
        e.preventDefault();
        navigate('/admin');
        onClose();
    };

    return (
        <>
            <div className="menu-overlay-backdrop" onClick={onClose}></div>
            <div className="card-container menu-overlay" role="dialog" aria-modal="true">
                <button 
                    onClick={onClose} 
                    className="close-button-menu"
                    aria-label="Close menu"
                >
                    ×
                </button>

                {/* Name Change Input at Top */}
                <div className="name-change-section">
                    <label htmlFor="name-input" style={{display: 'block', marginBottom: '8px', fontWeight: '500', textAlign: 'left', color: 'var(--color-text-dark)'}}>
                        My Name:
                    </label>
                    <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            id="name-input"
                            type="text"
                            value={nameInput}
                            onChange={handleNameChange}
                            className="form-input"
                            placeholder="Enter your name"
                            style={{flex: 1}}
                        />
                        {showSaved && (
                            <span className="saved-notification" aria-label="Saved">
                                ✓
                            </span>
                        )}
                    </div>
                </div>

                {/* Contact Options - Updated Text */}
                <button 
                    onClick={handleShare}
                    className="menu-button menu-button-share"
                    aria-label="Invite friends"
                >
                    <span style={{ fontSize: '1.2em' }}>🔗</span> Invite Friends
                </button>
                
                <a 
                    href="https://wa.me/917676885989" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="menu-button menu-button-whatsapp"
                    aria-label="Message to NU"
                >
                    <span style={{ fontSize: '1.2em' }}>💬</span> Message to NU
                </a>
                
                <a 
                    href="mailto:friend@nuschool.org" 
                    className="menu-button menu-button-email"
                    aria-label="Email to NU"
                >
                    <span style={{ fontSize: '1.2em' }}>✉️</span> Email to NU
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
                        onClick={handleAdminClick}
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
        </>
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

// --- Main Layout Component ---
const MainLayout = ({ children, showFooter = true }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [clientName, setClientName] = useState(localStorage.getItem('clientName') || '');
    const [themeKey] = useState(localStorage.getItem('theme') || 'bronze-black');
    const location = useLocation();

    useEffect(() => {
        applyTheme(themeKey);
    }, [themeKey]);

    const isLandingPage = location.pathname === '/';

    return (
        <>
            <div className="app-container">
                <header className="responsive-header" role="banner">
                    <div className="header-logo">
                        <img src={nuLogo} alt="NU School Logo" loading="lazy" />
                        <h2 className="header-title">NU School</h2>
                    </div>
                    
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

                {children}

                {showFooter && !isLandingPage && <Footer showBack={true} />}
            </div>

            {isMenuOpen && (
                <MenuOverlay 
                    onClose={() => setIsMenuOpen(false)} 
                    clientName={clientName} 
                    setClientName={setClientName} 
                />
            )}
        </>
    );
};

// --- Main Dashboard Component ---
const MainDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { categorySlug } = useParams();
    const location = useLocation();
    const clientName = localStorage.getItem('clientName') || '';

    useEffect(() => {
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
                const homeCategory = { id: 0, title: "Home", lovable_link: "home" };
                const allCategories = [homeCategory, ...data];
                setCategories(allCategories);
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, []);

    // Determine selected category based on URL
    const getSelectedCategory = () => {
        if (!categorySlug || categorySlug === 'home') return 'home';
        
        // Find category by slug
        const category = categories.find(cat => {
            const slug = cat.title.toLowerCase().replace(/\s+/g, '-');
            return slug === categorySlug;
        });
        
        if (category) return category.lovable_link;
        
        // Fallback: try to find by lovable_link if it's a URL slug
        const byLink = categories.find(cat => {
            if (cat.lovable_link.includes('http')) {
                const urlSlug = cat.lovable_link.split('/').pop() || '';
                return urlSlug === categorySlug;
            }
            return false;
        });
        
        return byLink ? byLink.lovable_link : 'home';
    };

    const selectedCategory = getSelectedCategory();
    const selectedCategoryData = categories.find(c => {
        if (selectedCategory === 'home') return c.lovable_link === 'home';
        return c.lovable_link === selectedCategory || c.title.toLowerCase().replace(/\s+/g, '-') === categorySlug;
    });

    return (
        <MainLayout showFooter={categorySlug !== undefined}>
            <div className="main-content">
                <div className="category-select-container">
                    <CategorySelector 
                        categories={categories} 
                        selectedCategory={selectedCategory}
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <div className="lovable-section">
                    {isLoading ? (
                        <div className="loading-placeholder">
                            <span>l</span><span> </span><span>o</span><span> </span><span>a</span><span> </span><span>d</span><span> </span><span>i</span><span> </span><span>n</span><span> </span><span>g</span>
                        </div>
                    ) : selectedCategory === 'home' ? (
                        <HomeContent clientName={clientName} />
                    ) : selectedCategoryData ? (
                        <iframe
                            title={selectedCategoryData.title}
                            className="lovable-iframe"
                            src={selectedCategoryData.lovable_link} 
                            key={selectedCategoryData.lovable_link}
                            loading="lazy"
                            aria-label={`Content for ${selectedCategoryData.title}`}
                        />
                    ) : (
                        <div className="home-card">
                            <h1>Category Not Found</h1>
                            <button onClick={() => navigate('/')} className="primary-button">
                                Go to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

// --- Name Prompt Component ---
const NamePrompt = () => {
    const navigate = useNavigate();
    const [clientName, setClientName] = useState('');

    const handleNameSubmit = () => {
        if (clientName.trim() !== '') {
            localStorage.setItem('clientName', clientName.trim());
            navigate('/');
        }
    };

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
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
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
};

// --- Admin Route Component ---
const AdminRoute = () => {
    const [themeKey] = useState(localStorage.getItem('theme') || 'bronze-black');
    
    return (
        <MainLayout showFooter={true}>
            <Admin theme={themeKey} />
        </MainLayout>
    );
};

// --- Main App Router ---
function AppRouter() {
    const location = useLocation();
    const clientName = localStorage.getItem('clientName');

    // Redirect to prompt if no name exists
    useEffect(() => {
        if (!clientName && location.pathname !== '/prompt' && !location.pathname.startsWith('/admin')) {
            window.location.href = '/prompt';
        }
    }, [clientName, location.pathname]);

    return (
        <Routes>
            <Route path="/prompt" element={<NamePrompt />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="/category/:categorySlug" element={<MainDashboard />} />
            <Route path="/" element={<MainDashboard />} />
        </Routes>
    );
}

// --- App Component with Router ---
function App() {
    const clientName = localStorage.getItem('clientName');

    // Redirect if no name
    useEffect(() => {
        if (!clientName && window.location.pathname !== '/prompt') {
            window.location.href = '/prompt';
        }
    }, []);

    return (
        <Router>
            <AppRouter />
        </Router>
    );
}

export default App;

