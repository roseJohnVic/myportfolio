import React, { useEffect, useState } from 'react';
import { getFooter } from '../api/axios';

export default function Footer() {
  const [footer, setFooter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  

  useEffect(() => {
    async function fetchFooter() {
      setLoading(true);
      try {
        const data = await getFooter();
        if (data) {
          setFooter(data.copyright || ""); 
        } else {
          setError("Footer section not found.");
        }
      } catch (err) {
        setError("Failed to load footer section.");
      } finally {
        setLoading(false);
      }
    }
    fetchFooter();
  }, []);

  return (
    <footer>
      <div className="container">
        {loading ? (
          <p>Loading footer...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p>{footer || '© 2025 Roselin. All rights reserved.'}</p>
        )}
      </div>
    </footer>
  );
}
