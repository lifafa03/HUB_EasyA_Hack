// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AirTrace {
    struct Baggage {
        string flightId;
        string currentStatus;
        string[] statusHistory;
        address owner;
    }

    mapping(uint256 => Baggage) public baggages;
    uint256 public nextBaggageId;
    
    address public feeReceiver; // Owner/you to collect view fees
    uint256 public viewFee;      // Fee amount in wei

    event BaggageRegistered(uint256 baggageId, address indexed owner, string flightId);
    event StatusUpdated(uint256 baggageId, string newStatus);
    event ClaimRaised(uint256 baggageId);

    constructor() {
        feeReceiver = msg.sender;
        viewFee = 150000; // 0.00015 ETH (approx ~$0.15 depending on chain gas prices)
    }

    function registerBaggage(string memory flightId, string memory initialStatus) public returns (uint256) {
        Baggage storage newBaggage = baggages[nextBaggageId];
        newBaggage.flightId = flightId;
        newBaggage.currentStatus = initialStatus;
        newBaggage.statusHistory.push(initialStatus);
        newBaggage.owner = msg.sender;

        emit BaggageRegistered(nextBaggageId, msg.sender, flightId);

        nextBaggageId++;
        return nextBaggageId - 1;
    }

    // Optional: Owner can update fee
    function updateViewFee(uint256 newFee) public {
        require(msg.sender == feeReceiver, "Only feeReceiver can update fee");
        viewFee = newFee;
    }
    
    function viewLocation(uint256 baggageId) public pure returns (string memory) {
    return "Paris";
    }

    function storedLocation() public pure returns (string memory) {
    return viewLocation(0); // call viewLocation with a dummy baggageId
    }
}