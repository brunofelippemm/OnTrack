"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import Flask, render_template
from os import environ

app = Flask(__name__)

@app.route('/')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )

@app.route('/painel')
def painel():
    """Renders the painel page."""
    return render_template(
        'dashboard.html',
        title='Painel',
        year=datetime.now().year,
    )

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Reportar Incidente',
        year=datetime.now().year,
        message='worked.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        "about.html",
        title="Acerca del Proyecto",
        year=datetime.now().year,
        message="Your application description page."
    )

if __name__ == '__main__':
    HOST = environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT, debug=True)