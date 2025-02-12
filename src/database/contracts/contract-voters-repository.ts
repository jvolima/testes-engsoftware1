import { Voter } from '@prisma/client'

export type CreateVoter = {
  electoralTitle: string
  name: string
}

export abstract class VotersRepository {
  abstract create: (data: CreateVoter) => Promise<Voter>
  abstract findById: (id: string) => Promise<Voter | null>
  abstract findByElectoralTitle: (
    electoralTitle: string,
  ) => Promise<Voter | null>
}
