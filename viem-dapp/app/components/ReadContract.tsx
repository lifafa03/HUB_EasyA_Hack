'use client';

import React, { useState, useEffect } from 'react';
import { publicClient } from '../utils/viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';


interface ReadContractProps {
  BaggageID: string;
  newLocation: string;
  newStage: string;
}

const ReadContract: React.FC<ReadContractProps> = ({ BaggageID, newLocation, newStage }) => {
  const [baggageDetails, setBaggageDetails] = useState<{ location: string; stage: string }>({
    location: "",
    stage: "",
  });
  const [status, setStatus] = useState<{ type: string | null; message: string }>({
    type: null,
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBaggageDetails = async () => {
      if (BaggageID) {
        try {
          const result = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getBaggage",
            args: [BaggageID],
          }) as [string, string];

          setBaggageDetails({ location: result[0], stage: result[1] });
        } catch (err) {
          setStatus({ type: "error", message: "Failed to fetch baggage details" });
        }
      }
    };

    fetchBaggageDetails();
  }, [BaggageID]);

 return (
  <div className="border border-pink-500 rounded-lg p-4 shadow-md bg-white text-pink-500 max-w-sm mx-auto">
  <h2 className="text-lg font-bold text-center mb-4">Baggage Data</h2>

  <div className="text-center">
    {/* Conditional rendering based on the loading state */}
    {loading ? (
      <div className="flex justify-center my-4">
        <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : error ? (
      <p className="text-red-500 text-center">{error}</p>
    ) : (
      <div>
        <p className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
          <strong>Location:</strong> {baggageDetails?.location || newLocation}
        </p>
        <p className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
          <strong>Location Status:</strong> {baggageDetails?.stage || newStage}
        </p>
        <p className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
          <strong>Baggage ID:</strong> {BaggageID}
        </p>
      </div>
    )}
  </div>
</div>
);
};

export default ReadContract;