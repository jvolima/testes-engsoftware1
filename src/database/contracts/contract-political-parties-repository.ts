import { PoliticalParty } from '@prisma/client'

export type CreatePoliticalParty = {
  name: string
}

export abstract class PoliticalPartiesRepository {
  abstract create: (data: CreatePoliticalParty) => Promise<PoliticalParty>
  abstract findById: (id: string) => Promise<PoliticalParty | null>
}
