// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaggageTracker {
    
    struct Baggage {
        string location;
        string stage;
        bool completed;
    }

    mapping(uint256 => Baggage) private baggages;

    //address payable public owner;
    //uint256 public constant viewFee = 15 ether; // Customer must pay 15 DOT (or native token)

    //constructor() {
    //    owner = payable(msg.sender);
    //}

    // Store initial baggage info

    function storeBaggage(
        uint256 baggageId,
        string memory location,
        string memory stage
    ) public {
        baggages[baggageId] = Baggage(location, stage, false);
    }

    // Update baggage location and stage
    function updateLocation(
        uint256 baggageId,
        string memory newLocation,
        string memory newStage

    ) public {
        require(bytes(baggages[baggageId].location).length != 0, "Invalid Baggage ID");
        baggages[baggageId].location = newLocation;
        baggages[baggageId].stage = newStage;
    }

    function getBaggage(uint256 baggageId) public view returns (string memory location, string memory stage) {
        require(bytes(baggages[baggageId].location).length != 0, "Invalid Baggage ID");
        //require(msg.value >= viewFee, "Insufficient payment");
        Baggage memory baggage = baggages[baggageId];
        return (baggage.location, baggage.stage);
    }

    function completeBaggage(uint256 baggageId) public {
        require(bytes(baggages[baggageId].location).length != 0, "Invalid Baggage ID");
        baggages[baggageId].completed = true;
    }
}
