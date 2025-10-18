# 📦 CodeCache Pro

**CodeCache Pro** is a smart tool that saves packages on your local network. It makes downloading npm and Python packages much faster for your team by storing them locally instead of downloading from the internet every time.

## 🌐 Live Demo

- **Website**: [https://Priyanshu-Bisht-me.github.io/codeCachePro/](https://Priyanshu-Bisht-me.github.io/codeCachePro/)
- **Source Code**: [https://github.com/Priyanshu-Bisht-me/codeCachePro](https://github.com/Priyanshu-Bisht-me/codeCachePro)

## What It Does ✨

-   **Works with npm and Python**: Saves packages from both npm (JavaScript) and PyPI (Python)
-   **Fast Downloads**: Built to handle many downloads at the same time without slowing down
-   **Smart Storage**: Uses a database to quickly find and store packages
-   **Safe Downloads**: Checks that all packages are complete and not corrupted before saving
-   **Auto Cleanup**: Removes old packages when storage gets full (keeps under 5 GB by default)
-   **Web Dashboard**: Easy-to-use website to see what's cached and how much bandwidth you've saved
-   **Live Stats**: Shows real-time info about downloads and savings
-   **Easy Commands**: Simple commands to control the server
-   **Windows Service**: Runs in the background on Windows like other system services
-   **Good Logging**: Keeps daily logs to help fix any problems
-   **Separate Tracking**: Shows separate stats for npm and Python packages

---

## 🚀 How to Install on Windows 10/11

Follow these simple steps to install CodeCache Pro on your Windows computer.

### What You Need First

1.  **Node.js**: Download and install Node.js version 18 or newer from [nodejs.org](https://nodejs.org/)
2.  **Admin Rights**: You need to run PowerShell as Administrator to install this

### Easy Installation Steps

1.  **Download the Project**
    Download or clone this project to a folder on your computer (like `C:\CodeCachePro`)

2.  **Run the Setup**
    - Right-click on PowerShell and choose "Run as Administrator"
    - Go to the scripts folder in the project
    - Run the setup script:

    ```powershell
    # Go to the scripts folder
    cd C:\Path\To\CodeCachePro\scripts
    
    # Run the setup
    .\install-service.ps1
    ```

    The setup will do everything for you:
    -   Download needed tools
    -   Install all required files
    -   Set up the command-line tool
    -   Create a Windows service called `CodeCachePro`
    -   Open the firewall for port 5050
    -   Start the service

    You'll see a success message when it's done! 🥳

---

## 🛠️ How to Use It

### Setting Up npm (JavaScript packages)

To make npm use your cache server, run this command on each computer:

```powershell
# Replace <server_ip> with your server's IP address
npm config set registry http://<server_ip>:5050/npm
```

### Setting Up pip (Python packages)

To make Python use your cache server, run this command:

**On any computer (Windows/Mac/Linux):**
```bash
# Tell pip to use your cache server
pip config set global.index-url http://192.168.137.47:5050/pypi

# Check if it worked
pip config list

# To go back to normal PyPI
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


## 🐍 Python Package Support

CodeCache Pro works with Python packages too, not just JavaScript ones.

### How Python Caching Works

1. **Finding Packages**: When pip looks for a package, the server helps it find the package on PyPI

2. **Downloading Packages**: When pip downloads a package file, the server:
   - First checks if we already have it saved
   - If yes, gives it to you right away (super fast!)
   - If no, downloads it from PyPI, checks it's not broken, then saves it for next time

3. **Safety Check**: All Python packages are checked to make sure they're not corrupted

4. **Safe Saving**: Downloads are saved safely so they don't get corrupted

### What Python Packages Work

- **Wheel files** (`.whl`): Pre-built packages that install quickly
- **Source files** (`.tar.gz`): Source code that gets built during install
- **All Python versions**: Works with Python 2, Python 3, and all versions
- **All computers**: Works on Windows, Mac, Linux, and other systems

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **CLI**: Node.js command-line interface
- **Deployment**: GitHub Actions + Multiple hosting options

### Testing Python Cache

You can test if Python caching works:

```bash
# Set up pip to use your cache
pip config set global.index-url http://192.168.137.47:5050/pypi

# Install a package (gets saved to cache)
pip install requests

# Install again (comes from cache - much faster!)
pip install --force-reinstall requests
```

### How Files Are Organized

- JavaScript packages go in `./cache/<package-name>/`
- Python packages go in `./cache/pypi/<package-name>/`
- The database keeps track of both types separately
- Stats show how much you've saved for each type

---

## 🚀 Easy Ways to Put It Online

### Option 1: Vercel (Best for the website part)
1. Copy this project to your GitHub
2. Connect it to [Vercel](https://vercel.com)
3. Set the main folder to `frontend`
4. It will update automatically when you make changes

### Option 2: Netlify
1. Copy this project to your GitHub
2. Connect it to [Netlify](https://netlify.com)
3. Set it to build from `frontend` folder using `npm run build`

### Option 3: Railway (For everything together)
1. Copy this project to your GitHub
2. Connect it to [Railway](https://railway.app)
3. It will put both the website and server online

### Option 4: GitHub Pages (Automatic)
- Already set up to work automatically
- Updates the website every time you make changes
- Visit it at: `https://Priyanshu-Bisht-me.github.io/codeCachePro/`

## 💻 Working on Your Computer

```bash
# Download the project
git clone https://github.com/Priyanshu-Bisht-me/codeCachePro.git
cd codeCachePro

# Set up the server part
cd backend
npm install

# Set up the website part
cd ../frontend
npm install

# Start the server (in one window)
cd ../backend
npm run dev

# Start the website (in another window)
cd ../frontend
npm run dev
```

## 📁 What's in the Project

```
codeCachePro/
├── frontend/          # Website (React app)
├── backend/           # Server (Node.js)
├── cli/              # Command-line tools
├── scripts/          # Windows setup scripts
└── .github/workflows/ # Auto-deployment setup
```

## 🔧 Management