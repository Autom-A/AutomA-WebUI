from flask import Flask

app = Flask(__name__)

@app.route("/")
def status():
    return "<h1>Server is Running</h1>"


app.run(host="127.0.01", port="9123", debug=True)