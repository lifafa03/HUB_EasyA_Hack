from flask import Flask, request, jsonify
from blockchain import (
    create_bag_on_chain,
    add_event_on_chain,
    get_bag_info_on_chain,
    create_bag_on_chain_mock,
    add_event_on_mock,
)
from datetime import datetime  # To add a timestamp


def create_bag(data):
    # Extract bag data
    bag_id = data.get("bag_id")
    owner = data.get("owner")
    flight_number = data.get("flight_number")
    location = data.get("location")
    status = data.get("status")
    handler_signature = data.get("handler_signature")

    # Check required parameters
    if not all([bag_id, owner, flight_number, location, status, handler_signature]):
        return {"message": "Missing required parameters"}, 400

    # Add the current timestamp
    timestamp = datetime.utcnow().isoformat()

    # Create the bag on the blockchain by adding the timestamp
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
    # Extract event data
    bag_id = data.get("bag_id")
    location = data.get("location")  # Event location
    status = data.get("status")  # Use status to indicate the event
    timestamp = data.get("timestamp")  # Time when the event occurred
    handler_signature = data.get(
        "handler_signature"
    )  # Digital signature of the handler

    # Check required parameters
    if not all([bag_id, location, status, timestamp, handler_signature]):
        return {"message": "Missing required parameters"}, 400

    # Add the event on the blockchain (here, a mock)
    success = add_event_on_chain(bag_id, location, status, timestamp, handler_signature)

    if success:
        return {"message": "Event added successfully"}, 201
    else:
        return {"message": "Failed to add event"}, 400


def add_event_update(data):
    # Extract necessary data from the argument data
    bag_id = data.get("bag_id")
    location = data.get("location")
    status = data.get("status")  # Status will determine the event
    handler_signature = data.get("handler_signature")

    # Check that all necessary parameters are present
    if not all([bag_id, location, status, handler_signature]):
        return {"message": "Missing required parameters"}, 400

    # Add a timestamp
    timestamp = datetime.utcnow().isoformat()

    # Dictionary of events with their respective statuses
    status_events = {
        "registered": "Bag registered",
        "in_transit": "Bag in transit",
        "arrived": "Bag arrived",
        "on_hold": "Bag on hold",
        "lost": "Bag lost",
        "claimed": "Bag claimed",
        "returned": "Bag returned",
    }

    # Check if the status is valid
    if status not in status_events:
        return {"message": f"Invalid status: {status}"}, 400

    # Add the event on the blockchain with status and timestamp
    event_message = status_events[status]

    # Simulate the call to a function to add the event on the blockchain
    success = add_event_on_chain(
        bag_id, location, event_message, timestamp, handler_signature
    )

    if success:
        return {"message": f"{event_message} successfully recorded"}, 200
    else:
        return {"message": "Failed to add event"}, 400


def get_bag_status():
    # Retrieve the bag_id from the request parameters
    bag_id = request.args.get("bag_id")  # Get bag_id from the GET request

    # Check that the bag_id is provided
    if not bag_id:
        return jsonify({"message": "Missing bag_id parameter"}), 400

    # Retrieve bag information from the blockchain
    bag_info = get_bag_info_on_chain(bag_id)

    if not bag_info:
        return jsonify({"message": f"Bag with ID {bag_id} not found"}), 404

    # If the bag is found, return the information
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
