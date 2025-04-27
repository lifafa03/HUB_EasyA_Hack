from substrateinterface import SubstrateInterface, Keypair
from config import NODE_URL, PRIVATE_KEY


def create_bag_on_chain(
    bag_id, owner, flight_number, location, status, handler_signature, timestamp
):
    # Connexion à la blockchain Polkadot
    substrate = SubstrateInterface(url=NODE_URL)

    # Créer un Keypair à partir de la clé privée
    keypair = Keypair.create_from_mnemonic(PRIVATE_KEY)

    # Créer un événement pour ce bagage en utilisant un smart contract
    try:
        # Smart contract - Créer un bagage en ajoutant l'ID, le propriétaire, le vol, l'emplacement, le statut, la signature et le timestamp
        call = substrate.compose_call(
            call_module="AirTrace",
            call_function="createBag",
            call_params={
                "bag_id": bag_id,
                "owner": owner,
                "flight_number": flight_number,  # Nouveau paramètre
                "location": location,
                "status": status,  # Nouveau paramètre
                "handler_signature": handler_signature,  # Nouveau paramètre
                "timestamp": timestamp,  # Nouveau paramètre
            },
        )

        # Créer une extrinsèque pour envoyer la transaction
        extrinsic = substrate.extrinsic(call)

        # Signer la transaction avec la clé privée
        extrinsic.sign(keypair)

        # Soumettre l'extrinsèque (transaction)
        result = substrate.submit_extrinsic(extrinsic)
        if result:
            print(f"Le bagage {bag_id} a été créé avec succès sur la blockchain.")
            return True
        else:
            print(f"Échec de la création du bagage {bag_id}.")
            return False
    except Exception as e:
        print(f"Erreur lors de la création du bagage : {e}")
        return False


def add_event_on_chain(bag_id, location, status, timestamp, handler_signature):
    # Connexion à la blockchain Polkadot
    substrate = SubstrateInterface(url=NODE_URL)

    # Créer un Keypair à partir de la clé privée
    keypair = Keypair.create_from_mnemonic(PRIVATE_KEY)

    # Créer un événement pour ce bagage en utilisant un smart contract
    try:
        # Smart contract - Ajouter un événement lié au bagage
        call = substrate.compose_call(
            call_module="AirTrace",
            call_function="addEvent",
            call_params={
                "bag_id": bag_id,
                "location": location,  # Localisation de l'événement
                "status": status,  # Le statut de l'événement (qui remplace l'ancien "event_type")
                "timestamp": timestamp,  # Moment de l'événement
                "handler_signature": handler_signature,  # Signature numérique du manipulant
            },
        )

        # Créer une extrinsèque pour envoyer la transaction
        extrinsic = substrate.extrinsic(call)

        # Signer la transaction avec la clé privée
        extrinsic.sign(keypair)

        # Soumettre l'extrinsèque (transaction)
        result = substrate.submit_extrinsic(extrinsic)
        if result:
            print(f"L'événement pour le bagage {bag_id} a été ajouté avec succès.")
            return True
        else:
            print(f"Échec de l'ajout de l'événement pour le bagage {bag_id}.")
            return False
    except Exception as e:
        print(f"Erreur lors de l'ajout de l'événement : {e}")
        return False


# Connexion à la blockchain
def get_bag_info_on_chain(bag_id):
    # Connexion à la blockchain Polkadot en utilisant le NODE_URL depuis config.py
    substrate = SubstrateInterface(
        url=NODE_URL,  # Utiliser la valeur de NODE_URL du fichier config
        ss58_format=42,  # Format pour Polkadot (peut varier pour d'autres réseaux)
    )

    # Recherche de l'événement ou de l'état lié au bagage (ici c'est une exemple fictif)
    # En réalité, il s'agit de rechercher dans un registre, un stockage ou un événement de la blockchain.
    result = substrate.query(
        module="BagModule",  # Module où les données de bagage sont enregistrées
        storage_function="BagStorage",  # Fonction de stockage spécifique des informations de bagage
        params=[bag_id],  # Paramètre : ID du bagage
    )

    # Si la recherche retourne des résultats
    if result:
        # Formater les données extraites
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
        return None  # Si aucune information n'est trouvée pour cet ID de bagage


# Fonction mockée pour simuler la création d'un bagage sur la blockchain
def create_bag_on_chain_mock(
    bag_id, owner, flight_number, location, status, handler_signature, timestamp
):
    print(f"Simulated Bag creation with ID {bag_id} and Owner {owner}")
    # Simuler un succès
    return True


def add_event_on_mock(bag_id, location, status, timestamp, handler_signature):
    # Ici, nous simulons un succès. Dans une version réelle, cette fonction interagirait avec la blockchain.
    print(f"Adding event for bag {bag_id} to the blockchain...")
    return True  # Simule un succès, renvoie True
