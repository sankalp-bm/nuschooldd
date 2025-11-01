import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ showBack = false }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    if (!showBack) return null;

    return (
        <footer className="app-footer" role="contentinfo">
            <button 
                onClick={handleBack}
                className="footer-back-button"
                aria-label="Back to home"
            >
                ← Back to Home
            </button>
        </footer>
    );
};

export default Footer;

