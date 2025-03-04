import { create } from "zustand"
import type { Policy, Claim, TransactionStatus } from "@/types"

interface StoreState {
  // Wallet connection
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
  walletAddress: string
  setWalletAddress: (address: string) => void

  // Policies
  policies: Policy[]
  setPolicies: (policies: Policy[]) => void
  addPolicy: (policy: Policy) => void

  // Claims
  claims: Claim[]
  setClaims: (claims: Claim[]) => void
  addClaim: (claim: Claim) => void

  // Transaction status
  transactionStatus: TransactionStatus | null
  setTransactionStatus: (status: TransactionStatus | null) => void
}

export const useStore = create<StoreState>((set) => ({
  // Wallet connection
  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected }),
  walletAddress: "",
  setWalletAddress: (address) => set({ walletAddress: address }),

  // Policies
  policies: [],
  setPolicies: (policies) => set({ policies }),
  addPolicy: (policy) =>
    set((state) => ({
      policies: [...state.policies, policy],
    })),

  // Claims
  claims: [],
  setClaims: (claims) => set({ claims }),
  addClaim: (claim) =>
    set((state) => ({
      claims: [...state.claims, claim],
    })),

  // Transaction status
  transactionStatus: null,
  setTransactionStatus: (status) => set({ transactionStatus: status }),
}))

