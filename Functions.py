from flask import Flask, request, jsonify
from blockchain import (
    create_bag_on_chain,
    add_event_on_chain,
    get_bag_info_on_chain,
    create_bag_on_chain_mock,
    add_event_on_mock,
)
from datetime import datetime  # Pour ajouter un timestamp


def create_bag(data):
    # Extraction des données du bagage
    bag_id = data.get("bag_id")
    owner = data.get("owner")
    flight_number = data.get("flight_number")
    location = data.get("location")
    status = data.get("status")
    handler_signature = data.get("handler_signature")

    # Vérification des paramètres obligatoires
    if not all([bag_id, owner, flight_number, location, status, handler_signature]):
        return {"message": "Missing required parameters"}, 400

    # Ajouter le timestamp actuel
    timestamp = datetime.utcnow().isoformat()

    # Créer la valise sur la blockchain en ajoutant le timestamp
    # success = create_bag_on_chain(
    #    bag_id, owner, flight_number, location, status, handler_signature, timestamp
    # )
    success = create_bag_on_chain(
        bag_id, owner, flight_number, location, status, handler_signature, timestamp
    )

    if success:
        return {"message": "Bag created successfully"}, 201
    else:
        return {"message": "Failed to create bag"}, 400


def add_event(data):
    # Extraction des données de l'événement
    bag_id = data.get("bag_id")
    location = data.get("location")  # Localisation de l'événement
    status = data.get("status")  # Utilisation de status pour indiquer l'événement
    timestamp = data.get("timestamp")  # Moment où l'événement a eu lieu
    handler_signature = data.get(
        "handler_signature"
    )  # Signature numérique du manipulant

    # Vérification des paramètres obligatoires
    if not all([bag_id, location, status, timestamp, handler_signature]):
        return {"message": "Missing required parameters"}, 400

    # Ajouter l'événement sur la blockchain (ici, un mock)
    success = add_event_on_chain(bag_id, location, status, timestamp, handler_signature)

    if success:
        return {"message": "Event added successfully"}, 201
    else:
        return {"message": "Failed to add event"}, 400


def add_event_update(data):
    # Extraction des données nécessaires depuis l'argument data
    bag_id = data.get("bag_id")
    location = data.get("location")
    status = data.get("status")  # Le statut déterminera l'événement
    handler_signature = data.get("handler_signature")

    # Vérifier que tous les paramètres nécessaires sont présents
    if not all([bag_id, location, status, handler_signature]):
        return {"message": "Missing required parameters"}, 400

    # Ajouter un timestamp
    timestamp = datetime.utcnow().isoformat()

    # Dictionnaire des événements avec leurs statuts respectifs
    status_events = {
        "registered": "Bag registered",
        "in_transit": "Bag in transit",
        "arrived": "Bag arrived",
        "on_hold": "Bag on hold",
        "lost": "Bag lost",
        "claimed": "Bag claimed",
        "returned": "Bag returned",
    }

    # Vérifier si le statut est valide
    if status not in status_events:
        return {"message": f"Invalid status: {status}"}, 400

    # Ajouter l'événement sur la blockchain avec le statut et le timestamp
    event_message = status_events[status]

    # Simuler l'appel à une fonction pour ajouter l'événement sur la blockchain
    success = add_event_on_chain(
        bag_id, location, event_message, timestamp, handler_signature
    )

    if success:
        return {"message": f"{event_message} successfully recorded"}, 200
    else:
        return {"message": "Failed to add event"}, 400


def get_bag_status():
    # Récupérer le bag_id depuis les paramètres de la requête
    bag_id = request.args.get("bag_id")  # Récupère le bag_id de la requête GET

    # Vérifier que le bag_id est fourni
    if not bag_id:
        return jsonify({"message": "Missing bag_id parameter"}), 400

    # Récupérer les informations du bagage depuis la blockchain
    bag_info = get_bag_info_on_chain(bag_id)

    if not bag_info:
        return jsonify({"message": f"Bag with ID {bag_id} not found"}), 404

    # Si le bagage est trouvé, renvoyer les informations
    return (
        jsonify(
            {
                "bag_id": bag_info["bag_id"],
                "owner": bag_info["owner"],
                "flight_number": bag_info["flight_number"],
                "location": bag_info["location"],
                "status": bag_info["status"],
                "handler_signature": bag_info["handler_signature"],
                "timestamp": bag_info["timestamp"],
            }
        ),
        200,
    )
