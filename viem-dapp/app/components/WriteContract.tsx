"use client";

import React, { useState, useEffect } from "react";
import { publicClient, getWalletClient } from "../utils/viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contract";
import ReadContract from './ReadContract';  // Import ReadContract component
//import { stringToBytes } from "viem";

interface WriteContractProps {
  account: string | null;
}

const WriteContract: React.FC<WriteContractProps> = ({ account }) => {
  const [formType, setFormType] = useState<string>("update"); // Track form type (update or create)
  const [newLocation, setNewLocation] = useState<string>("");
  const [newStage, setNewStage] = useState<string>("");
  const [BaggageID, setNewBaggageID] = useState<string>("");
  const [status, setStatus] = useState<{
    type: string | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [IsSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitting2, setIsSubmitting2] = useState<boolean>(false);
  const [isSubmitting3, setIsSubmitting3] = useState<boolean>(false);
  //const [account, setAccount] = useState<string | null>(null); // Simulate account state
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true);

  // Check if the account is on the correct network
  useEffect(() => {
    console.log(JSON.stringify(CONTRACT_ABI, null, 2));  // Pretty print the ABI
    const checkNetwork = async () => {
      if (!account) return;

      try {
        const chainId = await publicClient.getChainId();
        const walletClient = await getWalletClient();
        if (!walletClient) return;

        const walletChainId = await walletClient.getChainId();
        setIsCorrectNetwork(chainId === walletChainId);
      } catch (err) {
        console.error("Error checking network:", err);
        setIsCorrectNetwork(false);
      }
    };

    checkNetwork();
  }, [account]);

    // ----------- Individual Functions for Each Form -----------

    const updateLocationHandler = async () => {
      if (!account) return setStatus({ type: "error", message: "Connect your wallet" });
      if (!newLocation || !newStage || !BaggageID) return setStatus({ type: "error", message: "Fill all fields" });
      try {
        setIsSubmitting(true);
        const walletClient = await getWalletClient();
        const { result } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "updateLocation",
          args: [BaggageID, newLocation, newStage],
          account: walletClient?.account,
        });
        const hashresult = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "updateLocation",
          args: [BaggageID, newLocation, newStage],
          account: walletClient?.account,
        });
        //const hash = await walletClient.writeContract(result);
        //await publicClient.waitForTransactionReceipt({ hash });
        setStatus({ type: "success", message: "Location updated!" });
      } catch (err: any) {
        setStatus({ type: "error", message: err.message || "Update failed" });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const createBaggageHandler = async () => {
      if (!account) return setStatus({ type: "error", message: "Connect your wallet" });
      if (!BaggageID || !newLocation) return setStatus({ type: "error", message: "Fill all fields" });
      console.log(JSON.stringify(CONTRACT_ABI, null, 2));  // Pretty print the ABI
      try {
        //console.log(JSON.stringify(CONTRACT_ABI, null, 2));  // Pretty print the ABI
        //console.log(CONTRACT_ABI.length);
        setIsSubmitting(true);
        const walletClient = await getWalletClient();
        const result  = await publicClient.simulateContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "storeBaggage",
          args: [BaggageID,newLocation,"check-in"],
          account: walletClient.account,
        });
        const resulthash  = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "storeBaggage",
          args: [BaggageID, newLocation, "check-in"],
        });
        //const hash = await walletClient.writeContract(resulthash);
        //await publicClient.waitForTransactionReceipt({ hash });
        //setStatus({ type: "success", message: "Baggage created!" });
      } catch (err: any) {
        setStatus({ type: "error", message: err.message || "Creation failed" });
      } finally {
        setIsSubmitting(false);
      }
    };
  
  const viewBaggageHandler = async () => {
  if (!account) return setStatus({ type: "error", message: "Connect your wallet" });
  if (!BaggageID) return setStatus({ type: "error", message: "Enter Baggage ID" });
    console.log(BaggageID);
  try {
    setIsSubmitting(true);

    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getBaggage",
      args: [BigInt(BaggageID)],
    }) as [string, string];

    setNewLocation(result[0]);
    setNewStage(result[1]);

    //console.log("Location:", location, "Stage:", stage);

    //setStatus({ type: "success", message: `Location: ${location}, Stage: ${stage}` });

  } catch (err: any) {
    console.error(err);
    setStatus({ type: "error", message: err.message || "Failed to view location" });
  } finally {
    setIsSubmitting(false);
  }
};


  
    // ----------- Main Handle Submit Controller -----------
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isCorrectNetwork) {
        return setStatus({ type: "error", message: "Wrong network" });
      }
      if (formType === "update") {
        await updateLocationHandler();
      } else if (formType === "create") {
        await createBaggageHandler();
      } else if (formType === "view") {
        //setNewBaggageID() 
        await viewBaggageHandler();
      }
    };


  return (
      
    <div className="border border-pink-500 rounded-lg p-4 shadow-md bg-white text-pink-500 max-w-sm mx-auto space-y-4">
      
      {/* Dropdown or radio buttons to toggle between forms */}
      <div className="mb-4">
      <select
        value={formType}
        onChange={(e) => setFormType(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="update">Update Location</option>
        <option value="create">Create New Baggage ID</option>
        <option value="view">View Location</option>
      </select>
      </div>


      {/* Show status messages */}
      {status.message && (
        <div
          className={`p-2 rounded-md break-words h-fit text-sm ${
            status.type === "error"
              ? "bg-red-100 text-red-500"
              : status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status.message}
        </div>
      )}
      
      {/*<h2 className="text-lg font-bold">Change Location</h2>
      <h4 className="text-lg font-bold">Enter Baggage ID and New Location</h4>*/}

      {!isCorrectNetwork && account && (
        <div className="p-2 rounded-md bg-yellow-100 text-yellow-700 text-sm">
          ⚠️ You are not connected to the correct network. Please switch
          networks in your wallet.
        </div>
      )}

      {status.message && (
        <div
          className={`p-2 rounded-md break-words h-fit text-sm ${
            status.type === "error"
              ? "bg-red-100 text-red-500"
              : status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status.message}
        </div>
      )}

            {/* Conditional rendering based on formType */}
            {formType === "update" && (
        <>
          <h4 className="text-lg font-bold">Update Location</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Baggage ID"
              value={BaggageID}
              onChange={(e) => setNewBaggageID(e.target.value)}
              disabled={IsSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              placeholder="Location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={IsSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              disabled={IsSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="check-in">Check-in</option>
              <option value="on-plane">On Plane</option>
              <option value="transfer">Transfer</option>
              <option value="arrival">Arrival</option>
            </select>
            <button
              type="submit"
              disabled={IsSubmitting || !account || !isCorrectNetwork}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-300"
            >
              {IsSubmitting ? "Updating..." : "Update Location"}
            </button>
          </form>
        </>
      )}

      {formType === "create" && (
        <>
          <h4 className="text-lg font-bold">Create New Baggage ID</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="New Baggage ID"
              value={BaggageID}
              onChange={(e) => setNewBaggageID(e.target.value)}
              disabled={IsSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              placeholder="Airport Code"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={IsSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              disabled={IsSubmitting || !account || !isCorrectNetwork}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-300"
            >
              {IsSubmitting ? "Creating..." : "Create Baggage"}
            </button>
          </form>
        </>
      )}

      {formType === "view" && (
        <>
          <h4 className="text-lg font-bold">View Baggage Location</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Baggage ID"
              value={BaggageID}
              onChange={(e) => setNewBaggageID(e.target.value)}
              disabled={IsSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              disabled={IsSubmitting || !account || !isCorrectNetwork}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-300"
            >
              {IsSubmitting ? "Loading..." : "View Location"}
            </button>
          </form>
        </>
      )}

      {!account && (
        <p className="text-sm text-gray-500">
          Connect your wallet to update the stored number.
        </p>
      )}
     <ReadContract 
  BaggageID={BaggageID}
  newLocation={newLocation}
  newStage={newStage}
/>
     
    </div>
  );
};

export default WriteContract;