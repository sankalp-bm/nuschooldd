import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { applyTheme } from './utils';

// Hardcoded Admin Credentials (Using username instead of email for consistency)
const ADMIN_USERNAME = 'sankalp';
const ADMIN_PASSWORD = 'SankRaj8719';

function Admin({ setView, theme }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dataError, setDataError] = useState(null);

    // Apply theme on load (to ensure consistency if navigation is slow)
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // --- Login Logic ---
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');

        // Use trim() to clean up whitespace
        if (loginUser.trim() === ADMIN_USERNAME && loginPass === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            // After successful login, immediately fetch categories for the management view
            fetchCategories(); 
        } else {
            setLoginError('Invalid Username or Password.');
        }
    };

    // --- Fetch Categories for list view ---
    const fetchCategories = async () => {
        setLoading(true);
        // Exclude the fixed "Home" category from the management list
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .neq('id', 0) // Assuming Home will be ID 0 or we exclude based on title/link later
            .order('id', { ascending: true });

        setLoading(false);

        if (error) {
            setDataError('Error fetching categories: Check RLS policy.');
        } else {
            setCategories(data);
        }
    };

    // Auto-fetch list when component mounts (after login)
    useEffect(() => {
        if (isAuthenticated) {
            fetchCategories();
        }
    }, [isAuthenticated]);

    // --- Handle Adding a New Category (INSERT) ---
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setMessage('');
        setDataError(null);
        if (!title.trim() || !link.trim()) return setDataError('Title and Link cannot be empty.');
        
        setLoading(true);
        // Note: Supabase ID will auto-increment, we don't need to pass it.
        const { error: insertError } = await supabase
            .from('categories')
            .insert([{ title: title.trim(), lovable_link: link.trim() }]);
        setLoading(false);

        if (insertError) {
            setDataError('Error adding category: INSERT policy may be missing.');
        } else {
            setMessage(`Category "${title}" added successfully!`);
            setTitle('');
            setLink('');
            fetchCategories();
        }
    };

    // --- Handle Deleting a Category (DELETE) ---
    const handleDeleteCategory = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        setLoading(true);
        const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);
        setLoading(false);

        if (deleteError) {
            setDataError('Error deleting category: DELETE policy may be missing.');
        } else {
            setMessage(`Category "${title}" deleted successfully!`);
            fetchCategories();
        }
    };

    // --- Render Login Screen ---
    if (!isAuthenticated) {
        return (
            <div className="card-container admin-login-container">
                <button onClick={() => setView('main')} className="back-button">← Back to Home</button>
                <div style={{ marginTop: '20px' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        margin: '0 auto 15px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--color-primary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <span style={{ fontSize: '2em' }}>🔒</span>
                    </div>
                    <h2 style={{ marginBottom: '8px', fontWeight: '600' }}>Admin Panel</h2>
                    <p style={{ color: '#777', marginBottom: '25px' }}>Sign in to manage content</p>
                </div>
                <form onSubmit={handleLogin}>
                    <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: '500', color: 'var(--color-text-dark)' }}>
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        className="form-input"
                        required
                    />
                    <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', marginTop: '15px', fontWeight: '500', color: 'var(--color-text-dark)' }}>
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="form-input"
                        required
                    />
                    <button type="submit" className="primary-button">Log In</button>
                </form>
                {loginError && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>{loginError}</p>}
            </div>
        );
    }

    // --- Render Admin Management Panel ---
    return (
        <div className="card-container">
            <button onClick={() => setView('main')} className="back-button">← Back to Main App</button>
            <h1 style={{ marginBottom: '20px' }}>Admin Management</h1>

            {dataError && <p style={{ color: 'red', fontWeight: 'bold' }}>{dataError}</p>}
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

            <h2>Add New Category</h2>
            <form onSubmit={handleAddCategory} style={{ display: 'grid', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Category Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                    required
                />
                <input
                    type="url"
                    placeholder="Lovable App Link (starts with https://)"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="form-input"
                    required
                />
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Category'}
                </button>
            </form>
            
            <hr style={{ margin: '30px 0' }} />

            <h2>Current Categories (Excluding Home)</h2>
            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {categories.map((cat) => (
                        <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0', alignItems: 'center' }}>
                            <span>**{cat.title}** (ID: {cat.id})</span>
                            <button 
                                onClick={() => handleDeleteCategory(cat.id, cat.title)} 
                                style={{ backgroundColor: '#DC3545', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '5px' }}
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Admin;
