import { Vote } from '@prisma/client'

export type CreateVote = {
  voterId: string
  candidateId: string
  electionId: string
}

export abstract class VotesRepository {
  abstract create: (data: CreateVote) => Promise<Vote>
  abstract findById: (id: string) => Promise<Vote | null>
  abstract findByElectionAndVoter: (
    electionId: string,
    voterId: string,
  ) => Promise<Vote | null>
}
