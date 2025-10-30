import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import './App.css'; 

function App() {
  const [view, setView] = useState('prompt');
  const [categories, setCategories] = useState([]);
  const [selectedLink, setSelectedLink] = useState('');
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState(null);

  // --- Fetch Data and Check Local Storage ---
  useEffect(() => {
    // Check for saved name on initial load
    const storedName = localStorage.getItem('clientName');
    if (storedName && view === 'prompt') {
        setClientName(storedName);
        setView('main'); // Auto-navigate if name is found
    }

    if (view === 'main') {
        async function fetchCategories() {
            let { data, error } = await supabase
                .from('categories')
                .select('id, title, lovable_link') // Ensure 'id' is selected for dropdown key
                .order('id', { ascending: true }); // Order for consistent display

            if (error) {
                console.error('Error fetching categories:', error);
                setError('Could not load categories. Check Supabase RLS policies.');
            } else {
                setCategories(data);
                if (data.length > 0) {
                    setSelectedLink(data[0].lovable_link);
                }
            }
        }
        fetchCategories();
    }
  }, [view]);

  const handleNameSubmit = () => {
    if (clientName.trim() !== '') {
      localStorage.setItem('clientName', clientName);
      setView('main');
    }
  };

  const handleCategoryChange = (event) => {
    const link = event.target.value;
    setSelectedLink(link);
  };
  
  // --- FINAL RENDER LOGIC (Router) ---

  // Show Admin Panel
  if (view === 'admin') {
      return <Admin setView={setView} />;
  }

  // Show Name Prompt (Initial screen)
  if (view === 'prompt') {
      return (
          <div className="name-prompt-container" style={{ padding: '20px' }}>
              <h1>Welcome to nuschool.com!</h1>
              <p>Please enter your name to start playing:</p>
              <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your Name"
              />
              <button onClick={handleNameSubmit}>Start</button>
          </div>
      );
  }
  
  // Show Main Dashboard
  return (
      <div className="app-container" style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              <h2>Hello, {clientName}!</h2>
              {/* Button to change view state to 'admin' */}
              <button 
                  onClick={() => setView('admin')} 
                  style={{ fontSize: '0.8em', padding: '5px 10px', cursor: 'pointer' }}
              >
                  Go to Admin
              </button>
          </header>

          <main style={{ paddingTop: '20px' }}>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              
              <p>Select a category:</p>
              <select onChange={handleCategoryChange} value={selectedLink} style={{ padding: '10px', fontSize: '1em', minWidth: '300px' }}>
                  {categories.map((cat) => (
                      // KEY CHANGE: Use cat.id for the key
                      <option key={cat.id} value={cat.lovable_link}> 
                          {cat.title}
                      </option>
                  ))}
              </select>

              <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
                  **Instructions: Static text explaining what he need to do.**
              </p>

              {/* Display a message if no categories loaded */}
              {categories.length === 0 && !error && <p>No categories found. Go to Admin to add them.</p>}

              {/* --- The Lovable Content iFrame --- */}
              {selectedLink && (
                  <iframe
                      title="Lovable Content"
                      src={selectedLink} 
                      width="100%"
                      height="600px"
                      style={{ border: '1px solid #ccc', borderRadius: '8px', marginTop: '15px' }}
                      frameBorder="0"
                  />
              )}
          </main>
      </div>
  );
}

export default App;