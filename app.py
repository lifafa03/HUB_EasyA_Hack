from flask import Flask, request, jsonify, render_template
from Functions import create_bag, add_event, add_event_update, get_bag_status

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/create_bag", methods=["POST"])
def create_bag_route():
    # Retrieve the JSON data sent by the client
    data = request.json

    # Call the create_bag function with the sent data
    response, status_code = create_bag(data)

    # Return the JSON response with the appropriate HTTP status code
    return jsonify(response), status_code


@app.route("/add_event", methods=["POST"])
def add_event_route():
    # Retrieve the JSON data sent by the client
    data = request.json

    # Call the add_event function from functions.py
    message, status_code = add_event(data)

    # Return the appropriate JSON response
    return jsonify(message), status_code


# Route to add an event update to a bag
@app.route("/add_event_update", methods=["POST"])
def handle_add_event():
    data = request.json
    response, status_code = add_event_update(data)
    return jsonify(response), status_code


# Route to get the status of a bag
@app.route("/get_bag_status", methods=["GET"])
def get_bag_status_route():
    return get_bag_status()


if __name__ == "__main__":
    app.run(debug=True)
