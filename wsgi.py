"""Production entry point for gunicorn / hosting platforms (Render, Railway).

The Flask app and the invoice_cleaner package live under app/, so put that on
the path and re-export the app. Run with:  gunicorn wsgi:app
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))

from server import app  # noqa: E402  (import after sys.path is set)

__all__ = ["app"]
