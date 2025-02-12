import { Election } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  ElectionsRepository,
  CreateElection,
} from '@/database/contracts/contract-elections-repository'
import { randomUUID } from 'crypto'
import { InMemoryVotesRepository } from './in-memory-votes-repository'
import { InMemoryCandidatesRepository } from './in-memory-candidates-repository'

@Injectable()
export class InMemoryElectionsRepository implements ElectionsRepository {
  public items: Election[] = []
  private inMemoryVotesRepository: InMemoryVotesRepository
  private inMemoryCandidatesRepository: InMemoryCandidatesRepository

  constructor(
    inMemoryVotesRepository: InMemoryVotesRepository,
    inMemoryCandidatesRepository: InMemoryCandidatesRepository,
  ) {
    this.inMemoryVotesRepository = inMemoryVotesRepository
    this.inMemoryCandidatesRepository = inMemoryCandidatesRepository
  }

  async create(data: CreateElection): Promise<Election> {
    const election = {
      id: randomUUID(),
      ...data,
    }
    this.items.push(election)
    return election
  }

  async findById(id: string): Promise<Election | null> {
    const item = this.items.find((item) => item.id === id)
    return item ?? null
  }

  async findByDate(date: Date): Promise<Election | null> {
    const election = this.items.find(
      (election) => election.startDate <= date && election.endDate >= date,
    )
    return election ?? null
  }

  async findByPeriod(startDate: Date, endDate: Date): Promise<Election | null> {
    const election = this.items.find(
      (election) =>
        (election.startDate <= startDate && election.endDate >= endDate) ||
        (election.startDate <= startDate && election.endDate >= startDate),
    )
    return election ?? null
  }

  async getCandidatesWithVotes(electionId: string): Promise<
    {
      name: string
      number: number
      votesTotal: number
    }[]
  > {
    const voteCountMap = new Map<string, number>()

    this.inMemoryVotesRepository.items.forEach((vote) => {
      if (vote.electionId === electionId) {
        voteCountMap.set(
          vote.candidateId,
          (voteCountMap.get(vote.candidateId) || 0) + 1,
        )
      }
    })

    return this.inMemoryCandidatesRepository.items
      .map((candidate) => ({
        name: candidate.name,
        number: candidate.number,
        votesTotal: voteCountMap.get(candidate.id) || 0,
      }))
      .sort((a, b) => b.votesTotal - a.votesTotal)
  }
}
