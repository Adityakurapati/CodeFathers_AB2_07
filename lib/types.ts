export interface BloodRequest {
  id: string
  fullName: string
  bloodType: string
  contactNumber: string
  hospitalName: string
  reason: string
  urgencyLevel: string
  status: string
  createdAt: string
  location: {
    lat: number
    lng: number
  }
  distance?: number
  address?: string
}

export interface Campaign {
  id: string
  title: string
  organizer: string
  location: string
  date: string
  time: string
  description: string
  image: string
  bloodTypesNeeded: string[]
  distance?: number
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
  registeredDonors?: number
  targetDonors?: number
}

export interface DonorQualification {
  id: string
  requestId: string
  donorId: string
  status: "pending" | "qualified" | "disqualified"
  responses: {
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

export interface QualificationQuestion {
  id: string
  question: string
  type: "select" | "text" | "boolean"
  options?: string[]
  disqualifyingAnswers?: string[]
  required: boolean
}

