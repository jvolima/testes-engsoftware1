import { Candidate } from '@prisma/client'

export type CreateCandidate = {
  number: number
  name: string
  politicalPartyId: string
}

export abstract class CandidatesRepository {
  abstract create: (data: CreateCandidate) => Promise<Candidate>
  abstract findById: (id: string) => Promise<Candidate | null>
  abstract findByNumber: (number: number) => Promise<Candidate | null>
}
