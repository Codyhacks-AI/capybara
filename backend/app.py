from flask import Flask, request
from recommend import get_suggestions

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/recommendations")
def get_recommendations():
    args = request.args
    new_code = args.get('new_code')
    return get_suggestions(new_code)
