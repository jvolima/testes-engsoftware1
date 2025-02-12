import { Candidate } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  CandidatesRepository,
  CreateCandidate,
} from '@/database/contracts/contract-candidates-repository'
import { randomUUID } from 'crypto'

@Injectable()
export class InMemoryCandidatesRepository implements CandidatesRepository {
  public items: Candidate[] = []

  async create(data: CreateCandidate): Promise<Candidate> {
    const candidate = {
      id: randomUUID(),
      ...data,
    }
    this.items.push(candidate)
    return candidate
  }

  async findById(id: string): Promise<Candidate | null> {
    const item = this.items.find((item) => item.id === id)
    return item ?? null
  }

  async findByNumber(number: number): Promise<Candidate | null> {
    const candidate = this.items.find(
      (candidate) => candidate.number === number,
    )
    return candidate ?? null
  }
}
