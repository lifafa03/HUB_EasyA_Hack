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
        viewFee = 150000000000000; // 0.00015 ETH (approx ~$0.15 depending on chain gas prices)
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

    function updateStatus(uint256 baggageId, string memory newStatus) public {
        require(msg.sender == baggages[baggageId].owner, "Only owner can update status");

        baggages[baggageId].currentStatus = newStatus;
        baggages[baggageId].statusHistory.push(newStatus);

        emit StatusUpdated(baggageId, newStatus);
    }

    function getStatus(uint256 baggageId) public payable returns (string memory) {
        require(msg.value >= viewFee, "Insufficient fee to view status");

        (bool sent, ) = feeReceiver.call{value: msg.value}("");
        require(sent, "Failed to transfer fee");

        return baggages[baggageId].currentStatus;
    }

    function getStatusHistory(uint256 baggageId) public view returns (string[] memory) {
        return baggages[baggageId].statusHistory;
    }

    function raiseClaim(uint256 baggageId) public {
        require(msg.sender == baggages[baggageId].owner, "Only owner can raise claim");
        baggages[baggageId].currentStatus = "Claim Raised";
        baggages[baggageId].statusHistory.push("Claim Raised");

        emit ClaimRaised(baggageId);
    }

    // Optional: Owner can update fee
    function updateViewFee(uint256 newFee) public {
        require(msg.sender == feeReceiver, "Only feeReceiver can update fee");
        viewFee = newFee;
    }
}