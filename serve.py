#!/usr/bin/env python3
"""Winziger statischer Server fuer die Marketing-Website.
Port: Kommandozeilen-Argument, sonst Umgebungsvariable PORT, sonst 8743."""
import os, sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))


class NoStore(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    else:
        port = int(os.environ.get("PORT", 8743))
    handler = partial(NoStore, directory=ROOT)
    with ThreadingHTTPServer(("0.0.0.0", port), handler) as httpd:
        print(f"Lucky Shutdown Website: http://localhost:{port}")
        httpd.serve_forever()
