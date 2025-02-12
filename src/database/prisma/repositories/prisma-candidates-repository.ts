import { Candidate } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  CandidatesRepository,
  CreateCandidate,
} from '@/database/contracts/contract-candidates-repository'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCandidatesRepository implements CandidatesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateCandidate): Promise<Candidate> {
    return this.prismaService.candidate.create({
      data,
    })
  }

  async findById(id: string): Promise<Candidate | null> {
    return this.prismaService.candidate.findUnique({
      where: {
        id,
      },
    })
  }

  async findByNumber(number: number): Promise<Candidate | null> {
    return this.prismaService.candidate.findUnique({
      where: {
        number,
      },
    })
  }
}
