from substrateinterface import SubstrateInterface, Keypair
from config import NODE_URL, PRIVATE_KEY


def create_bag_on_chain(
    bag_id, owner, flight_number, location, status, handler_signature, timestamp
):
    # Connect to the Polkadot blockchain
    substrate = SubstrateInterface(url=NODE_URL)

    # Create a Keypair from the private key
    keypair = Keypair.create_from_mnemonic(PRIVATE_KEY)

    # Create an event for this bag using a smart contract
    try:
        # Smart contract - Create a bag by adding the ID, owner, flight, location, status, signature, and timestamp
        call = substrate.compose_call(
            call_module="AirTrace",
            call_function="createBag",
            call_params={
                "bag_id": bag_id,
                "owner": owner,
                "flight_number": flight_number,  # New parameter
                "location": location,
                "status": status,  # New parameter
                "handler_signature": handler_signature,  # New parameter
                "timestamp": timestamp,  # New parameter
            },
        )

        # Create an extrinsic to send the transaction
        extrinsic = substrate.extrinsic(call)

        # Sign the transaction with the private key
        extrinsic.sign(keypair)

        # Submit the extrinsic (transaction)
        result = substrate.submit_extrinsic(extrinsic)
        if result:
            print(f"Bag {bag_id} was successfully created on the blockchain.")
            return True
        else:
            print(f"Failed to create bag {bag_id}.")
            return False
    except Exception as e:
        print(f"Error while creating the bag: {e}")
        return False


def add_event_on_chain(bag_id, location, status, timestamp, handler_signature):
    # Connect to the Polkadot blockchain
    substrate = SubstrateInterface(url=NODE_URL)

    # Create a Keypair from the private key
    keypair = Keypair.create_from_mnemonic(PRIVATE_KEY)

    # Create an event for this bag using a smart contract
    try:
        # Smart contract - Add an event related to the bag
        call = substrate.compose_call(
            call_module="AirTrace",
            call_function="addEvent",
            call_params={
                "bag_id": bag_id,
                "location": location,  # Event location
                "status": status,  # Event status (replaces the old "event_type")
                "timestamp": timestamp,  # Event timestamp
                "handler_signature": handler_signature,  # Digital signature of the handler
            },
        )

        # Create an extrinsic to send the transaction
        extrinsic = substrate.extrinsic(call)

        # Sign the transaction with the private key
        extrinsic.sign(keypair)

        # Submit the extrinsic (transaction)
        result = substrate.submit_extrinsic(extrinsic)
        if result:
            print(f"The event for bag {bag_id} was successfully added.")
            return True
        else:
            print(f"Failed to add the event for bag {bag_id}.")
            return False
    except Exception as e:
        print(f"Error while adding the event: {e}")
        return False


# Connect to the blockchain
def get_bag_info_on_chain(bag_id):
    # Connect to the Polkadot blockchain using NODE_URL from config.py
    substrate = SubstrateInterface(
        url=NODE_URL,  # Use the NODE_URL value from the config file
        ss58_format=42,  # Format for Polkadot (may vary for other networks)
    )

    # Search for the event or state related to the bag (this is a fictional example)
    # In reality, it involves searching a registry, storage, or blockchain event.
    result = substrate.query(
        module="BagModule",  # Module where bag data is registered
        storage_function="BagStorage",  # Specific storage function for bag information
        params=[bag_id],  # Parameter: bag ID
    )

    # If the query returns results
    if result:
        # Format the extracted data
        bag_info = {
            "bag_id": result["bag_id"],
            "owner": result["owner"],
            "flight_number": result["flight_number"],
            "location": result["location"],
            "status": result["status"],
            "handler_signature": result["handler_signature"],
            "timestamp": result["timestamp"],
        }

        return bag_info
    else:
        return None  # If no information is found for this bag ID


# Mocked function to simulate creating a bag on the blockchain
def create_bag_on_chain_mock(
    bag_id, owner, flight_number, location, status, handler_signature, timestamp
):
    print(f"Simulated Bag creation with ID {bag_id} and Owner {owner}")
    # Simulate success
    return True


def add_event_on_mock(bag_id, location, status, timestamp, handler_signature):
    # Here, we simulate a success. In a real version, this function would interact with the blockchain.
    print(f"Adding event for bag {bag_id} to the blockchain...")
    return True  # Simulate success, return True
