# SysVision

SysVision is a local computer performance dashboard for a Computer Engineering portfolio. It combines real CPU, RAM, disk, and uptime readings from a small Python service with clearly labeled simulated sensor values for GPU temperature, CPU temperature, and fan speed.

## Requirements

- Python 3.10 or newer
- VS Code (recommended)
- A modern browser

## Run in VS Code (Windows PowerShell)

1. Extract the `SysVision.zip` folder.
2. Open the extracted `SysVision` folder in VS Code.
3. Open Terminal > New Terminal.
4. Create a virtual environment:

   ```powershell
   py -m venv .venv
   ```

5. Activate it:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

   If PowerShell blocks activation, run this once in the current terminal and try activation again:

   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\.venv\Scripts\Activate.ps1
   ```

6. Install dependencies:

   ```powershell
   python -m pip install -r requirements.txt
   ```

7. Start the local service:

   ```powershell
   python app.py
   ```

8. Open this address in your browser:

   http://127.0.0.1:5000

Keep the terminal running while using the dashboard. Press `Ctrl+C` to stop the service.

## What is real and what is simulated?

- Live readings: CPU utilization, RAM usage, disk usage, system uptime, operating system and machine name.
- Simulated readings: CPU/GPU temperature, fan speed, and GPU load. They are explicitly marked as simulated because generic browser/Python APIs cannot reliably read every hardware sensor on every computer.
- The initial project is local-only and binds to `127.0.0.1`. It is not an internet-hosted monitoring service.

## Project structure

```text
SysVision/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── app.js
```

## Troubleshooting

- If `py` is not recognized, install Python from python.org and enable **Add Python to PATH**, then reopen VS Code.
- If port 5000 is busy, change `port=5000` near the bottom of `app.py` to another port and open that same port in the browser.
- If live stats show an error, confirm the terminal is still running and reload the page.
