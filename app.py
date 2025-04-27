from flask import Flask, request, jsonify, render_template
from Functions import create_bag, add_event, add_event_update, get_bag_status

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/create_bag", methods=["POST"])
def create_bag_route():
    # Récupérer les données JSON envoyées par le client
    data = request.json

    # Appeler la fonction create_bag avec les données envoyées
    response, status_code = create_bag(data)

    # Renvoyer la réponse JSON avec le code de statut HTTP approprié
    return jsonify(response), status_code


@app.route("/add_event", methods=["POST"])
def add_event_route():
    # Récupérer les données JSON envoyées par le client
    data = request.json

    # Appeler la fonction add_event de functions.py
    message, status_code = add_event(data)

    # Renvoyer la réponse JSON appropriée
    return jsonify(message), status_code


# Route pour ajouter une mise à jour d'événement à un bagage
@app.route("/add_event_update", methods=["POST"])
def handle_add_event():
    data = request.json
    response, status_code = add_event_update(data)
    return jsonify(response), status_code


# Route pour obtenir l'état d'un bagage
@app.route("/get_bag_status", methods=["GET"])
def get_bag_status_route():
    return get_bag_status()


if __name__ == "__main__":
    app.run(debug=True)
