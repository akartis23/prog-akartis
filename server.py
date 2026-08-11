#!/usr/bin/env python3
"""
Serveur local simple pour le PROG.AKARTIS
Usage: python server.py
Puis ouvre http://localhost:5000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 5000
DIRECTORY = Path(__file__).parent.resolve()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        # Évite le cache pendant le développement
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")


def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 50)
        print("PROG.AKARTIS — http://localhost:5000")
        print("=" * 50)
        print(f"  → Ouvre ton navigateur sur : {url}")
        print(f"  → Dossier servi : {DIRECTORY}")
        print("  → Ctrl+C pour arrêter")
        print("=" * 50)
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServeur arrêté.")


if __name__ == "__main__":
    main()
