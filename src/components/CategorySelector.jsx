import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CategorySelector = ({ categories, selectedCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const selectorRef = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleCategorySelect = (category) => {
        if (category.lovable_link === 'home') {
            navigate('/');
        } else {
            // Convert category title to URL-friendly slug
            const slug = category.title.toLowerCase().replace(/\s+/g, '-');
            navigate(`/category/${slug}`);
        }
        setIsOpen(false);
        setSearchQuery('');
    };

    // Get selected category title
    const getSelectedCategoryTitle = () => {
        if (selectedCategory === 'home' || !selectedCategory) {
            return 'Home';
        }
        
        // Try to find by lovable_link first
        const byLink = categories.find(c => c.lovable_link === selectedCategory);
        if (byLink) return byLink.title;
        
        // Try to find by slug
        const bySlug = categories.find(c => 
            c.title.toLowerCase().replace(/\s+/g, '-') === selectedCategory
        );
        if (bySlug) return bySlug.title;
        
        return 'Home';
    };

    const selectedCategoryTitle = getSelectedCategoryTitle();

    return (
        <div className="category-selector-wrapper" ref={selectorRef}>
            <div 
                className={`category-selector-block ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="selector-label">{selectedCategoryTitle}</span>
                <span className={`selector-arrow ${isOpen ? 'up' : 'down'}`}>▼</span>
            </div>

            {isOpen && (
                <div className="category-selector-dropdown">
                    <div className="category-search-container">
                        <input
                            type="text"
                            placeholder="Type a category"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="category-search-input"
                            autoFocus
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    
                    <div className="category-prompt">Please select:</div>
                    
                    <div className="category-list-container">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`category-item ${selectedCategoryTitle === cat.title ? 'selected' : ''}`}
                                    onClick={() => handleCategorySelect(cat)}
                                >
                                    {cat.title}
                                </div>
                            ))
                        ) : (
                            <div className="category-no-results">No categories found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;

