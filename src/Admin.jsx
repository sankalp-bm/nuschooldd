import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Hardcoded Admin Credentials
const ADMIN_USERNAME = 'sankalp';
const ADMIN_PASSWORD = 'SankRaj8719';

function Admin({ setView }) {
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

    // --- Login Logic ---
    const handleLogin = (e) => {
        e.preventDefault();
        if (loginUser === ADMIN_USERNAME && loginPass === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Invalid username or password.');
        }
    };

    // --- Fetch Categories for list view ---
    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            setDataError('Error fetching categories for list: Check RLS policy.');
        } else {
            setCategories(data);
        }
    };

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
        const { error: insertError } = await supabase
            .from('categories')
            .insert([{ title: title.trim(), lovable_link: link.trim() }]);
        setLoading(false);

        if (insertError) {
            setDataError('Error adding category: INSERT policy may be missing.');
            console.error(insertError);
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
            <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
                <button onClick={() => setView('main')} style={{ marginBottom: '20px' }}>← Back to Main App</button>
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        required
                    />
                    <button type="submit">Log In</button>
                </form>
                {loginError && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>{loginError}</p>}
            </div>
        );
    }

    // --- Render Admin Management Panel ---
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <button onClick={() => setView('main')} style={{ marginBottom: '20px' }}>← Back to Main App</button>
            <h1>Admin Panel: Manage Categories</h1>

            {dataError && <p style={{ color: 'red', fontWeight: 'bold' }}>{dataError}</p>}
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

            <h2>Add New Category</h2>
            <form onSubmit={handleAddCategory} style={{ display: 'grid', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Category Title (e.g., Multiplication Games)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Lovable App Link (e.g., https://your-game.lovable.app)"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Category'}
                </button>
            </form>
            
            <hr style={{ margin: '30px 0' }} />

            <h2>Current Categories</h2>
            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {categories.map((cat) => (
                        <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                            <span>**{cat.title}**</span>
                            <button 
                                onClick={() => handleDeleteCategory(cat.id, cat.title)} 
                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
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