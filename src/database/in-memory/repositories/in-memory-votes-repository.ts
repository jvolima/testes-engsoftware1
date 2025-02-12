import { Injectable } from '@nestjs/common'
import { Vote } from '@prisma/client'
import { randomUUID } from 'crypto'
import {
  CreateVote,
  VotesRepository,
} from '@/database/contracts/contract-votes-repository'

@Injectable()
export class InMemoryVotesRepository implements VotesRepository {
  public items: Vote[] = []

  async create(data: CreateVote): Promise<Vote> {
    const vote = {
      id: randomUUID(),
      ...data,
    }
    this.items.push(vote)
    return vote
  }

  async findById(id: string): Promise<Vote | null> {
    const item = this.items.find((item) => item.id === id)
    return item ?? null
  }

  async findByElectionAndVoter(
    electionId: string,
    voterId: string,
  ): Promise<Vote | null> {
    const item = this.items.find(
      (item) => item.electionId === electionId && item.voterId === voterId,
    )
    return item ?? null
  }
}
