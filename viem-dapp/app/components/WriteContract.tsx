"use client";

import React, { useState, useEffect } from "react";
import { publicClient, getWalletClient } from "../utils/viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contract";

interface WriteContractProps {
  account: string | null;
}

const WriteContract: React.FC<WriteContractProps> = ({ account }) => {
  const [formType, setFormType] = useState<string>("update"); // Track form type (update or create)
  const [newLocation, setNewLocation] = useState<string>("");
  const [BaggageID, setNewBaggageID] = useState<string>("");
  const [status, setStatus] = useState<{
    type: string | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  //const [account, setAccount] = useState<string | null>(null); // Simulate account state
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true);

  // Check if the account is on the correct network
  useEffect(() => {
    const checkNetwork = async () => {
      if (!account) return;

      try {
        // Get the chainId from the public client
        const chainId = await publicClient.getChainId();

        // Get the user's current chainId from their wallet
        const walletClient = await getWalletClient();
        if (!walletClient) return;

        const walletChainId = await walletClient.getChainId();

        // Check if they match
        setIsCorrectNetwork(chainId === walletChainId);
      } catch (err) {
        console.error("Error checking network:", err);
        setIsCorrectNetwork(false);
      }
    };

    checkNetwork();
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!account) {
      setStatus({ type: "error", message: "Please connect your wallet first" });
      return;
    }

    if (!isCorrectNetwork) {
      setStatus({
        type: "error",
        message: "Please switch to the correct network in your wallet",
      });
      return;
    }

    if (!newLocation) {
      setStatus({ type: "error", message: "Please enter a valid number" });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "info", message: "Initiating transaction..." });

      // Get wallet client for transaction signing
      const walletClient = await getWalletClient();

      if (!walletClient) {
        setStatus({ type: "error", message: "Wallet client not available" });
        return;
      }

      // Check if account matches
      if (
        walletClient.account?.address.toLowerCase() !== account.toLowerCase()
      ) {
        setStatus({
          type: "error",
          message:
            "Connected wallet account doesn't match the selected account",
        });
        return;
      }

      // Prepare transaction and wait for user confirmation in wallet
      setStatus({
        type: "info",
        message: "Please confirm the transaction in your wallet...",
      });

      // Simulate the contract call first
      console.log('newLocation', newLocation);
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getBaggage",
        args: [BaggageID, newLocation],
        account: walletClient.account,
      });

      // Send the transaction with wallet client
      const hash = await walletClient.writeContract(request);

      // Wait for transaction to be mined
      setStatus({
        type: "info",
        message: "Transaction submitted. Waiting for confirmation...",
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      setStatus({
        type: "success",
        message: `Transaction confirmed! Transaction hash: ${receipt.transactionHash}`,
      });

      setNewLocation("");
    } catch (err: any) {
      console.error("Error updating number:", err);

      // Handle specific errors
      if (err.code === 4001) {
        // User rejected transaction
        setStatus({ type: "error", message: "Transaction rejected by user." });
      } else if (err.message?.includes("Account not found")) {
        // Account not found on the network
        setStatus({
          type: "error",
          message:
            "Account not found on current network. Please check your wallet is connected to the correct network.",
        });
      } else if (err.message?.includes("JSON is not a valid request object")) {
        // JSON error - specific to your current issue
        setStatus({
          type: "error",
          message:
            "Invalid request format. Please try again or contact support.",
        });
      } else {
        // Other errors
        setStatus({
          type: "error",
          message: `Error: ${err.message || "Failed to send transaction"}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-pink-500 rounded-lg p-4 shadow-md bg-white text-pink-500 max-w-sm mx-auto space-y-4">
      
      {/* Dropdown or radio buttons to toggle between forms */}
      <div className="space-x-4 mb-4">
        <label>
          <input
            type="radio"
            name="formType"
            value="update"
            checked={formType === "update"}
            onChange={() => setFormType("update")}
            className="mr-2"
          />
          Update Location
        </label>
        <label>
          <input
            type="radio"
            name="formType"
            value="create"
            checked={formType === "create"}
            onChange={() => setFormType("create")}
            className="mr-2"
          />
          Create New Baggage ID
        </label>
        <label>
          <input
            type="radio"
            name="formType"
            value="view"
            checked={formType === "view"}
            onChange={() => setFormType("view")}
            className="mr-2"
          />
          View Location
        </label>
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
      
      <h2 className="text-lg font-bold">Change Location</h2>
      <h4 className="text-lg font-bold">Enter Baggage ID and New Location</h4>

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
              value={""}
              onChange={(e) => setNewBaggageID(e.target.value)}
              disabled={isSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              placeholder="New Location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={isSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              disabled={isSubmitting || !account || !isCorrectNetwork}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-300"
            >
              {isSubmitting ? "Updating..." : "Update Location"}
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
              value={""}
              onChange={(e) => setNewBaggageID(e.target.value)}
              disabled={isSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              placeholder="Airport Code"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={isSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              disabled={isSubmitting || !account || !isCorrectNetwork}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-300"
            >
              {isSubmitting ? "Creating..." : "Create Baggage"}
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
              value={""}
              onChange={(e) => setNewBaggageID(e.target.value)}
              disabled={isSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              disabled={isSubmitting || !account || !isCorrectNetwork}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-300"
            >
              {isSubmitting ? "Loading..." : "View Location"}
            </button>
          </form>
        </>
      )}

      {!account && (
        <p className="text-sm text-gray-500">
          Connect your wallet to update the stored number.
        </p>
      )}
    </div>
  );
};

export default WriteContract;