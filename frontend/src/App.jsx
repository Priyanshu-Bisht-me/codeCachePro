// /frontend/src/App.jsx
// Purpose: The main React component that structures the dashboard layout.

import React, { useState, useEffect, useCallback } from 'react';
import StatsPanel from './StatsPanel.jsx';
import PackageList from './PackageList.jsx';

// Use backend port from config during build, fallback for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [stats, setStats] = useState(null);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, packagesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/stats`),
        fetch(`${API_BASE_URL}/packages`)
      ]);

      if (!statsRes.ok || !packagesRes.ok) {
        throw new Error('Network response was not ok');
      }

      const statsData = await statsRes.json();
      const packagesData = await packagesRes.json();

      setStats(statsData);
      setPackages(packagesData);
      setError(null);
    } catch (e) {
      // Show demo data when API is not available (like on GitHub Pages)
      console.log('API not available, showing demo data');
      setStats({
        totalPackages: 156,
        totalSize: '2.3 GB',
        cacheHits: 1247,
        cacheMisses: 89,
        hitRate: '93.3%',
        bandwidthSaved: '45.2 GB',
        timeSaved: '2h 34m',
        npmPackages: 98,
        pypiPackages: 58,
        lastUpdated: new Date().toISOString()
      });
      setPackages([
        { name: 'react', version: '18.2.0', size: '87.2 MB', downloads: 45, registry: 'npm', lastAccessed: '2 minutes ago' },
        { name: 'lodash', version: '4.17.21', size: '1.4 MB', downloads: 23, registry: 'npm', lastAccessed: '5 minutes ago' },
        { name: 'requests', version: '2.31.0', size: '512 KB', downloads: 18, registry: 'pypi', lastAccessed: '8 minutes ago' },
        { name: 'express', version: '4.18.2', size: '2.1 MB', downloads: 12, registry: 'npm', lastAccessed: '12 minutes ago' },
        { name: 'numpy', version: '1.24.3', size: '15.8 MB', downloads: 9, registry: 'pypi', lastAccessed: '15 minutes ago' }
      ]);
      setError('🌐 Demo Mode: Showing sample data (Backend not connected)');
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear the entire cache? This cannot be undone.')) {
        try {
            const res = await fetch(`${API_BASE_URL}/clear-cache`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to clear cache');
            alert('Cache cleared successfully!');
            fetchData(); // Refresh data immediately
        } catch (e) {
            setError(e.message);
        }
    }
  };
  
  const handleExportStats = () => {
    if (!stats) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(stats, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `codecache-stats-${new Date().toISOString()}.json`;
    link.click();
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4 md:mb-0">
            📦 CodeCache Pro Dashboard
          </h1>
          <div className="flex space-x-2">
            <button onClick={handleExportStats} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Export Stats</button>
            <button onClick={handleClearCache} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Clear Cache</button>
          </div>
        </header>

        {loading && <p className="text-center text-xl">Loading dashboard...</p>}
        {error && (
          <div className={`${error.includes('Demo Mode') ? 'bg-blue-800 border-blue-600' : 'bg-red-800 border-red-600'} border text-white px-4 py-3 rounded relative mb-4`} role="alert">
            {error}
          </div>
        )}
        
        {!loading && !error && (
            <>
                <StatsPanel stats={stats} />
                <PackageList packages={packages} />
            </>
        )}
      </div>
    </div>
  );
}

export default App;