"use client";

import React from 'react';

interface ReadContractProps {
  BaggageID: string;
  newLocation: string;
  newStage: string;
}

const ReadContract: React.FC<ReadContractProps> = ({ BaggageID, newLocation, newStage }) => {
  
  return (
    <div className="border border-pink-500 rounded-lg p-4 shadow-md bg-white text-pink-500 max-w-sm mx-auto">
      <h2 className="text-lg font-bold text-center mb-4">Baggage Data</h2>

      <div className="flex flex-col space-y-2 text-center">
        <p className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
          <strong>Location:</strong> {newLocation || "No data"}
        </p>
        <p className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
          <strong>Status:</strong> {newStage || "No data"}
        </p>
        <p className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
          <strong>Baggage ID:</strong> {BaggageID || "No data"}
        </p>
      </div>
    </div>
  );
};

export default ReadContract;
