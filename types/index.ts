// Policy type
export interface Policy {
  id: string
  owner: string
  coverageAmount: number
  premiumAmount: number
  policyDuration: number
  createdAt: number
  expiryDate: number
  isActive: boolean
}

// Claim type
export interface Claim {
  id: string
  policyId: string
  owner: string
  claimAmount: number
  description: string
  status: "Pending" | "Approved" | "Rejected"
  createdAt: number
}

// Transaction status type
export interface TransactionStatus {
  status: "pending" | "success" | "error"
  message: string
  txHash?: string
  policyId?: string
  claimId?: string
}

// Blockchain function return types
export interface CreatePolicyResult {
  txHash: string
  policyId: string
}

export interface FileClaimResult {
  txHash: string
  claimId: string
}

