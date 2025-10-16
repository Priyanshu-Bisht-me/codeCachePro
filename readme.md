# 📦 CodeCache Pro

**CodeCache Pro** is a production-grade, LAN-wide package caching proxy designed for Windows environments. It significantly speeds up package restoration for CI/CD pipelines and developer machines by caching `npm` packages locally. It is built to be memory-efficient, concurrent, and robust.



## Features ✨

-   **High-Performance Proxy**: Built with Node.js and Express, using streams for memory-efficient handling of large packages.
-   **High Concurrency**: Tested to support 50+ simultaneous downloads.
-   **Persistent Metadata**: Uses SQLite for fast lookups and metadata storage.
-   **Atomic & Verified Caching**: Guarantees downloads are complete and checksum-verified before being cached.
-   **Automatic Cache Pruning**: Uses an LRU (Least Recently Used) strategy to keep cache size below a configurable limit (default 5 GB).
-   **Real-time Dashboard**: A React-based web UI to monitor statistics and view cached packages.
-   **Full-featured CLI**: A powerful command-line tool to manage the server.
-   **Windows Service**: Includes PowerShell scripts to easily install, run, and manage the server as a background Windows service.
-   **Robust Logging**: Daily rotating logs for easy diagnostics.
-   **Extensible**: Designed to be easily extended for other repositories like PyPI or Maven.

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