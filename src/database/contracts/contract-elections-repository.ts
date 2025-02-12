import { Election } from '@prisma/client'

export type CreateElection = {
  startDate: Date
  endDate: Date
}

export abstract class ElectionsRepository {
  abstract create: (data: CreateElection) => Promise<Election>
  abstract findById: (id: string) => Promise<Election | null>
  abstract findByDate: (date: Date) => Promise<Election | null>
  abstract findByPeriod: (
    startDate: Date,
    endDate: Date,
  ) => Promise<Election | null>

  abstract getCandidatesWithVotes: (electionId: string) => Promise<
    {
      name: string
      number: number
      votesTotal: number
    }[]
  >
}
