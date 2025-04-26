// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BaggageTracker {
    enum BaggageStatus { 
        CheckedIn, 
        Loaded, 
        InTransit, 
        Arrived, 
        Claimed, 
        Lost 
    }

    struct Baggage {
        address owner;
        string description;   // optional metadata: brand, size, color, etc
        BaggageStatus status;
        uint256 lastUpdated;
    }

    uint256 private nextBaggageId;
    mapping(uint256 => Baggage) public baggageRecords;

    event BaggageRegistered(uint256 indexed baggageId, address indexed owner, string description);
    event BaggageStatusUpdated(uint256 indexed baggageId, BaggageStatus status);

    // Modifier to restrict access to baggage owner
    modifier onlyOwner(uint256 baggageId) {
        require(msg.sender == baggageRecords[baggageId].owner, "Not baggage owner");
        _;
    }

    // Register new baggage
    function registerBaggage(string calldata description) external returns (uint256) {
        uint256 baggageId = nextBaggageId++;

        baggageRecords[baggageId] = Baggage({
            owner: msg.sender,
            description: description,
            status: BaggageStatus.CheckedIn,
            lastUpdated: block.timestamp
        });

        emit BaggageRegistered(baggageId, msg.sender, description);
        return baggageId;
    }

    // Update baggage status (could be called by authorized service or oracle later)
    function updateBaggageStatus(uint256 baggageId, BaggageStatus newStatus) external onlyOwner(baggageId) {
        baggageRecords[baggageId].status = newStatus;
        baggageRecords[baggageId].lastUpdated = block.timestamp;

        emit BaggageStatusUpdated(baggageId, newStatus);
    }

    // View baggage info (only owner)
    function getBaggageInfo(uint256 baggageId) external view onlyOwner(baggageId) returns (
        string memory description,
        BaggageStatus status,
        uint256 lastUpdated
    ) {
        Baggage memory bag = baggageRecords[baggageId];
        return (bag.description, bag.status, bag.lastUpdated);
    }
}
