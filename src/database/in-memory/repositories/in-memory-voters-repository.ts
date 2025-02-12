import { Voter } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  VotersRepository,
  CreateVoter,
} from '@/database/contracts/contract-voters-repository'
import { randomUUID } from 'crypto'

@Injectable()
export class InMemoryVotersRepository implements VotersRepository {
  public items: Voter[] = []

  async create(data: CreateVoter): Promise<Voter> {
    const voter = {
      id: randomUUID(),
      ...data,
    }
    this.items.push(voter)
    return voter
  }

  async findById(id: string): Promise<Voter | null> {
    const item = this.items.find((item) => item.id === id)
    return item ?? null
  }

  async findByElectoralTitle(electoralTitle: string): Promise<Voter | null> {
    const voter = this.items.find(
      (voter) => voter.electoralTitle === electoralTitle,
    )
    return voter ?? null
  }
}
