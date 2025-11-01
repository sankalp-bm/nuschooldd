// --- 1. THEME MANAGEMENT ---

// Define the 5 theme palettes based on your requirements
export const THEMES = {
    'bronze-black': {
        '--color-primary': '#B8860B', // Dark Golden/Bronze
        '--color-secondary': '#4A4E69', // Muted Black/Charcoal
        '--color-background': '#F4F4F9',
        '--color-text-light': 'white',
        '--color-text-dark': '#333333',
    },
    'sky-blue': {
        '--color-primary': '#4DB6AC', // Teal/Aqua
        '--color-secondary': '#00838F',
        '--color-background': '#E0F7FA',
        '--color-text-light': 'white',
        '--color-text-dark': '#333333',
    },
    'berry-pink': {
        '--color-primary': '#FF80AB', // Bright Pink
        '--color-secondary': '#C51162', // Deep Berry
        '--color-background': '#FCE4EC',
        '--color-text-light': 'white',
        '--color-text-dark': '#333333',
    },
    'forest-green': {
        '--color-primary': '#8BC34A', // Lime Green
        '--color-secondary': '#558B2F', // Dark Green
        '--color-background': '#F1F8E9',
        '--color-text-light': 'white',
        '--color-text-dark': '#333333',
    },
    'deep-red': {
        '--color-primary': '#800000', // Deep Red
        '--color-secondary': '#4A0000', // Darker Red
        '--color-background': '#FFF5F5',
        '--color-text-light': 'white',
        '--color-text-dark': '#333333',
    },
    'cadet-blue': {
        '--color-primary': '#5F9EA0', // Cadet Blue
        '--color-secondary': '#3D6B6D', // Darker Blue
        '--color-background': '#F0F8FF',
        '--color-text-light': 'white',
        '--color-text-dark': '#333333',
    },
    'pure-black': {
        '--color-primary': '#000000', // Pure Black
        '--color-secondary': '#333333', // Dark Gray
        '--color-background': '#F5F5F5',
        '--color-text-light': 'white',
        '--color-text-dark': '#333333',
    },
};

/**
 * Applies the selected theme by updating CSS variables on the document root.
 * @param {string} themeKey - The key of the theme to apply (e.g., 'bronze-black').
 */
export const applyTheme = (themeKey) => {
    const theme = THEMES[themeKey] || THEMES['bronze-black'];
    const root = document.documentElement;

    for (const [property, value] of Object.entries(theme)) {
        root.style.setProperty(property, value);
    }
    localStorage.setItem('theme', themeKey);
};


// --- 2. FIREWORKS FEEDBACK (Uses simple CSS animation/DOM manipulation) ---

/**
 * Triggers a simple success animation for positive feedback.
 * @param {string} type - The type of feedback (e.g., 'fireworks' or 'star').
 */
export const triggerSuccessFeedback = (type) => {
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'success-feedback ' + type;
    
    // Position randomly on the screen for a fun effect
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.8; 
    
    feedbackEl.style.left = `${x}px`;
    feedbackEl.style.top = `${y}px`;

    // Add content (clapping hands emoji, star, or rocket emoji)
    if (type === 'fireworks') {
        feedbackEl.innerHTML = '🎉';
        feedbackEl.style.fontSize = '40px';
    } else {
        feedbackEl.innerHTML = '🌟';
        feedbackEl.style.fontSize = '30px';
    }

    document.body.appendChild(feedbackEl);

    // Remove the element after the animation finishes
    setTimeout(() => {
        feedbackEl.remove();
    }, 1500); 
};
