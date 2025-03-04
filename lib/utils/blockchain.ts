import { ethers } from "ethers"
import { useStore } from "@/lib/store"
import type { CreatePolicyResult, FileClaimResult, Policy, Claim } from "@/types"

// ABI for the MicroInsurance smart contract
const MICROINSURANCE_ABI = [
  // Events
  "event PolicyCreated(string policyId, address owner, uint256 coverageAmount, uint256 premiumAmount, uint256 policyDuration)",
  "event ClaimFiled(string claimId, string policyId, address owner, uint256 claimAmount, string description)",

  // Functions
  "function createPolicy(uint256 coverageAmount, uint256 policyDuration, uint256 premiumAmount) external payable returns (string memory)",
  "function fileClaim(string memory policyId, uint256 claimAmount, string memory description) external returns (string memory)",
  "function getPoliciesByOwner(address owner) external view returns (string[] memory)",
  "function getClaimsByOwner(address owner) external view returns (string[] memory)",
  "function getPolicyDetails(string memory policyId) external view returns (address, uint256, uint256, uint256, uint256, uint256, bool)",
  "function getClaimDetails(string memory claimId) external view returns (string memory, address, uint256, string memory, string memory, uint256)",
]

// Contract addresses
const SCROLL_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" // Replace with actual contract address
const VANAR_CONTRACT_ADDRESS = "0x0987654321098765432109876543210987654321" // Replace with actual contract address

// Provider and contract instances
let provider: ethers.BrowserProvider | null = null
let signer: ethers.Signer | null = null
let scrollContract: ethers.Contract | null = null
let vanarContract: ethers.Contract | null = null

/**
 * Connect to blockchain networks and initialize contracts
 */
export async function connectToBlockchain(): Promise<{ address: string }> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this application.")
  }

  try {
    // Initialize provider
    provider = new ethers.BrowserProvider(window.ethereum)

    // Request account access
    const accounts = await provider.send("eth_requestAccounts", [])

    if (accounts.length === 0) {
      throw new Error("No accounts found. Please unlock your MetaMask wallet.")
    }

    // Get signer
    signer = await provider.getSigner()
    const address = await signer.getAddress()

    // Initialize contracts
    scrollContract = new ethers.Contract(SCROLL_CONTRACT_ADDRESS, MICROINSURANCE_ABI, signer)
    vanarContract = new ethers.Contract(VANAR_CONTRACT_ADDRESS, MICROINSURANCE_ABI, signer)

    console.log("Connected to blockchain with address:", address)

    // Load user's policies and claims
    await loadUserData(address)

    return { address }
  } catch (error) {
    console.error("Error connecting to blockchain:", error)
    throw error
  }
}

/**
 * Load user's policies and claims from the blockchain
 */
async function loadUserData(address: string) {
  if (!scrollContract || !signer) {
    throw new Error("Blockchain connection not initialized")
  }

  try {
    // Get policies from Scroll
    const policyIds = await scrollContract.getPoliciesByOwner(address)
    const policies: Policy[] = []

    for (const policyId of policyIds) {
      const [owner, coverageAmount, premiumAmount, policyDuration, createdAt, expiryDate, isActive] =
        await scrollContract.getPolicyDetails(policyId)

      policies.push({
        id: policyId,
        owner,
        coverageAmount: Number.parseFloat(ethers.formatEther(coverageAmount)),
        premiumAmount: Number.parseFloat(ethers.formatEther(premiumAmount)),
        policyDuration: Number(policyDuration),
        createdAt: Number(createdAt) * 1000, // Convert to milliseconds
        expiryDate: Number(expiryDate) * 1000, // Convert to milliseconds
        isActive,
      })
    }

    // Get claims from Scroll
    const claimIds = await scrollContract.getClaimsByOwner(address)
    const claims: Claim[] = []

    for (const claimId of claimIds) {
      const [policyId, owner, claimAmount, description, status, createdAt] =
        await scrollContract.getClaimDetails(claimId)

      claims.push({
        id: claimId,
        policyId,
        owner,
        claimAmount: Number.parseFloat(ethers.formatEther(claimAmount)),
        description,
        status: status as "Pending" | "Approved" | "Rejected",
        createdAt: Number(createdAt) * 1000, // Convert to milliseconds
      })
    }

    // Update store with policies and claims
    const { setPolicies, setClaims } = useStore.getState()
    setPolicies(policies)
    setClaims(claims)

    console.log("Loaded user data:", { policies, claims })
  } catch (error) {
    console.error("Error loading user data:", error)
    throw error
  }
}

/**
 * Create a new insurance policy
 */
export async function callCreatePolicy(
  coverageAmount: number,
  policyDuration: number,
  premiumAmount: number,
): Promise<CreatePolicyResult> {
  if (!scrollContract || !signer) {
    throw new Error("Blockchain connection not initialized")
  }

  try {
    // Convert amounts to wei
    const coverageAmountWei = ethers.parseEther(coverageAmount.toString())
    const premiumAmountWei = ethers.parseEther(premiumAmount.toString())

    // Call contract function with premium as value
    const tx = await scrollContract.createPolicy(coverageAmountWei, policyDuration, premiumAmountWei, {
      value: premiumAmountWei,
    })

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    // Get policy ID from event logs
    const event = receipt.logs
      .filter((log: any) => log.fragment?.name === "PolicyCreated")
      .map((log: any) => scrollContract?.interface.parseLog(log))[0]

    const policyId = event.args[0]

    // Reload user data
    const address = await signer.getAddress()
    await loadUserData(address)

    return {
      txHash: receipt.hash,
      policyId,
    }
  } catch (error) {
    console.error("Error creating policy:", error)
    throw error
  }
}

/**
 * File a claim for an existing policy
 */
export async function callFileClaim(
  policyId: string,
  claimAmount: number,
  description: string,
): Promise<FileClaimResult> {
  if (!scrollContract || !signer) {
    throw new Error("Blockchain connection not initialized")
  }

  try {
    // Convert amount to wei
    const claimAmountWei = ethers.parseEther(claimAmount.toString())

    // Call contract function
    const tx = await scrollContract.fileClaim(policyId, claimAmountWei, description)

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    // Get claim ID from event logs
    const event = receipt.logs
      .filter((log: any) => log.fragment?.name === "ClaimFiled")
      .map((log: any) => scrollContract?.interface.parseLog(log))[0]

    const claimId = event.args[0]

    // Reload user data
    const address = await signer.getAddress()
    await loadUserData(address)

    return {
      txHash: receipt.hash,
      claimId,
    }
  } catch (error) {
    console.error("Error filing claim:", error)
    throw error
  }
}

/**
 * Listen for blockchain events and update UI in real time
 */
export function listenForEvents(): () => void {
  if (!scrollContract) {
    console.error("Blockchain connection not initialized")
    return () => {}
  }

  try {
    // Get store functions
    const { addPolicy, addClaim } = useStore.getState()

    // Listen for PolicyCreated events
    const policyCreatedListener = scrollContract.on(
      "PolicyCreated",
      async (policyId, owner, coverageAmount, premiumAmount, policyDuration, event) => {
        console.log("Policy created:", { policyId, owner })

        // Check if the event is for the current user
        const currentAddress = await signer?.getAddress()
        if (owner.toLowerCase() === currentAddress?.toLowerCase()) {
          // Get full policy details
          const [_, __, ___, ____, createdAt, expiryDate, isActive] = await scrollContract?.getPolicyDetails(policyId)

          // Add policy to store
          addPolicy({
            id: policyId,
            owner,
            coverageAmount: Number.parseFloat(ethers.formatEther(coverageAmount)),
            premiumAmount: Number.parseFloat(ethers.formatEther(premiumAmount)),
            policyDuration: Number(policyDuration),
            createdAt: Number(createdAt) * 1000,
            expiryDate: Number(expiryDate) * 1000,
            isActive,
          })
        }
      },
    )

    // Listen for ClaimFiled events
    const claimFiledListener = scrollContract.on(
      "ClaimFiled",
      async (claimId, policyId, owner, claimAmount, description, event) => {
        console.log("Claim filed:", { claimId, policyId, owner })

        // Check if the event is for the current user
        const currentAddress = await signer?.getAddress()
        if (owner.toLowerCase() === currentAddress?.toLowerCase()) {
          // Get full claim details
          const [_, __, ___, ____, status, createdAt] = await scrollContract?.getClaimDetails(claimId)

          // Add claim to store
          addClaim({
            id: claimId,
            policyId,
            owner,
            claimAmount: Number.parseFloat(ethers.formatEther(claimAmount)),
            description,
            status: status as "Pending" | "Approved" | "Rejected",
            createdAt: Number(createdAt) * 1000,
          })
        }
      },
    )

    // Return cleanup function
    return () => {
      scrollContract?.off("PolicyCreated", policyCreatedListener)
      scrollContract?.off("ClaimFiled", claimFiledListener)
    }
  } catch (error) {
    console.error("Error setting up event listeners:", error)
    return () => {}
  }
}

