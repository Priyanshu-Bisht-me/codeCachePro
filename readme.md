# 📦 CodeCache Pro

**CodeCache Pro** is a production-grade, LAN-wide package caching proxy designed for Windows environments. It significantly speeds up package restoration for CI/CD pipelines and developer machines by caching `npm` and `PyPI` packages locally.

## 🌐 Live Demo

- **Frontend Demo**: [https://YOUR_USERNAME.github.io/codecache-pro/](https://YOUR_USERNAME.github.io/codecache-pro/)
- **Source Code**: [https://github.com/YOUR_USERNAME/codecache-pro](https://github.com/YOUR_USERNAME/codecache-pro)

## Features ✨

-   **Multi-Registry Support**: Full support for both npm (Node.js) and PyPI (Python) package registries
-   **High-Performance Proxy**: Built with Node.js and Express, using streams for memory-efficient handling
-   **High Concurrency**: Tested to support 50+ simultaneous downloads across both registries
-   **Persistent Metadata**: Uses SQLite for fast lookups and metadata storage with registry separation
-   **Atomic & Verified Caching**: Guarantees downloads are complete and checksum-verified before being cached
-   **Automatic Cache Pruning**: Uses LRU strategy to keep cache size below configurable limit (default 5 GB)
-   **Real-time Dashboard**: React-based web UI to monitor statistics and view cached packages
-   **Console Statistics**: Real-time command-line statistics showing bandwidth and time saved
-   **Full-featured CLI**: Powerful command-line tool to manage the server
-   **Windows Service**: PowerShell scripts to install, run, and manage as a background Windows service
-   **Robust Logging**: Daily rotating logs for easy diagnostics
-   **Registry Analytics**: Separate tracking and analytics for npm and PyPI usage patterns

---

## 🚀 Installation on Windows 10/11

These steps will guide you through installing CodeCache Pro as a Windows service.

### Prerequisites

1.  **Node.js**: Version 18+ must be installed and available in your system's `PATH`. You can get it from [nodejs.org](https://nodejs.org/).
2.  **Administrator Privileges**: You must run the installation script from a PowerShell terminal with Administrator rights.

### Installation Steps

1.  **Download/Clone the Project**
    Clone or download this repository to a permanent location on your server (e.g., `C:\CodeCachePro`).

2.  **Run the Installer**
    Open **PowerShell as an Administrator**, navigate to the project's `scripts` directory, and run the installer:

    ```powershell
    # Navigate to the scripts directory within the project
    cd C:\Path\To\CodeCachePro\scripts
    
    # Run the installation script
    .\install-service.ps1
    ```

    The script will automatically:
    -   Download `NSSM` (a service manager) if it's not present.
    -   Install all Node.js dependencies for the backend and CLI.
    -   Link the `codecache` CLI tool globally.
    -   Create and configure a Windows service named `CodeCachePro`.
    -   Add a Windows Firewall rule to allow traffic on the configured port (default: `5050`).
    -   Start the service.

    You should see a success message when it's done! 🥳

---

## 🛠️ Usage

### Configuring Clients (npm)

To use the cache, configure your `npm` clients (developer machines, CI runners) to point to the CodeCache Pro server. Run this command on each client machine:

```powershell
# Replace <server_ip> with the IP address of the machine running CodeCache Pro
npm config set registry http://<server_ip>:5050/npm
```

### Configuring Clients (pip)

To use the PyPI cache, configure your `pip` clients (developer machines, CI runners) to point to the CodeCache Pro server:

**Windows/macOS/Linux:**
```bash
# Configure pip to use the cache server
pip config set global.index-url http://192.168.137.47:5050/pypi

# Verify the configuration
pip config list

# To revert to the default PyPI registry
pip config unset global.index-url
```

**Alternative method using pip.conf/pip.ini:**

Create or edit the pip configuration file:
- **Linux/macOS**: `~/.pip/pip.conf`
- **Windows**: `%APPDATA%\pip\pip.ini`

Add the following content:
```ini
[global]
index-url = http://192.168.137.47:5050/pypi
```

**For CI/CD environments:**
```bash
# Use environment variable
export PIP_INDEX_URL=http://192.168.137.47:5050/pypi

# Or use command line flag
pip install --index-url http://192.168.137.47:5050/pypi package_name
```
---


## 🐍 PyPI Support

CodeCache Pro now includes full support for Python Package Index (PyPI) caching alongside npm packages.

### How PyPI Caching Works

1. **Package Index Requests**: When pip requests a package index (e.g., `/pypi/requests/`), the server proxies the request to the official PyPI simple index.

2. **Package Downloads**: When pip downloads a package file (`.whl` or `.tar.gz`), the server:
   - Checks the local cache first
   - If cached, serves immediately (cache HIT)
   - If not cached, downloads from PyPI, verifies SHA256 checksum, and caches locally (cache MISS)

3. **Checksum Verification**: All PyPI packages are verified using SHA256 checksums extracted from the PyPI index URLs.

4. **Atomic Caching**: Downloads are written to temporary files and atomically renamed only after successful verification.

### Supported Package Types

- **Wheel files** (`.whl`): Binary distribution format
- **Source distributions** (`.tar.gz`): Source code archives
- **All Python versions**: py2, py3, cp38, cp39, cp310, etc.
- **All architectures**: any, win32, win_amd64, linux_x86_64, etc.

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **CLI**: Node.js command-line interface
- **Deployment**: GitHub Actions + Multiple hosting options

### Testing PyPI Cache

Use the included test script to verify PyPI functionality:

```bash
cd backend
node test-pypi-cache.js
```

Or test with real pip commands:

```bash
# Configure pip to use the cache
pip config set global.index-url http://192.168.137.47:5050/pypi

# Install a package (will be cached)
pip install requests

# Install again (will be served from cache)
pip install --force-reinstall requests
```

### Registry Separation

- npm packages are stored in `./cache/<package-name>/`
- PyPI packages are stored in `./cache/pypi/<package-name>/`
- Database tracks packages separately by registry type
- Statistics show breakdown by registry (npm vs PyPI)

---

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended for React)
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Deploy automatically on every push

### Option 2: Netlify
1. Fork this repository  
2. Connect to [Netlify](https://netlify.com)
3. Build settings: `frontend` directory, `npm run build`, publish `frontend/dist`

### Option 3: Railway (Full-Stack)
1. Fork this repository
2. Connect to [Railway](https://railway.app)
3. Deploys both frontend and backend together

### Option 4: GitHub Pages (Automatic)
- Enabled via GitHub Actions workflow
- Automatically deploys frontend on every push to main branch
- Access at: `https://YOUR_USERNAME.github.io/codecache-pro/`

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/codecache-pro.git
cd codecache-pro

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install

# Start backend (in one terminal)
cd ../backend
npm run dev

# Start frontend (in another terminal)
cd ../frontend
npm run dev
```

## 📁 Project Structure

```
codecache-pro/
├── frontend/          # React app with Vite + Tailwind CSS
├── backend/           # Node.js Express server
├── cli/              # Command-line interface
├── scripts/          # Windows service installation scripts
└── .github/workflows/ # GitHub Actions for auto-deployment
```

## 🔧 Management