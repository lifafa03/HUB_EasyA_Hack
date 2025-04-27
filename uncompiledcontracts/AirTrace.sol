// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaggageTracker {
    
    // Define a structure to hold baggage information
    struct Baggage {
        string airportCode;
        string location;
        string stage;
        bool completed;
    }

    // Mapping from baggage ID to its info
    mapping(uint256 => Baggage) private baggages;

    // Function to store baggage info
    function storeBaggage(uint256 baggageId, string memory airportCode, string memory location) public {
        baggages[baggageId] = Baggage(airportCode, location);
    }

    function updateLocation(uint256 baggageId, string memory newLocation) public {
    //If ID dosen't exist
    require(bytes(baggages[baggageId].airportCode).length != 0, "Error: Baggage ID does not have a valid airport code");
    require(bytes(baggages[baggageId].location).length != 0, "Error: Baggage ID does not have a valid location");
    baggages[baggageId].location = newLocation;
    }

    // Function to view baggage info
    function getBaggage(uint256 baggageId) public view returns (string memory location) {
        require(bytes(baggages[baggageId].airportCode).length != 0, "Error: Baggage ID does not have a valid airport code");
        require(bytes(baggages[baggageId].location).length != 0, "Error: Baggage ID does not have a valid location");
        Baggage memory baggage = baggages[baggageId];
        return (baggage.location);
    }
}
