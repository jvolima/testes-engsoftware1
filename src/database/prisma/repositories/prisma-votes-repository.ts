import { Vote } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  VotesRepository,
  CreateVote,
} from '@/database/contracts/contract-votes-repository'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaVotesRepository implements VotesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateVote): Promise<Vote> {
    return this.prismaService.vote.create({
      data,
    })
  }

  async findById(id: string): Promise<Vote | null> {
    return this.prismaService.vote.findUnique({
      where: {
        id,
      },
    })
  }

  async findByElectionAndVoter(
    electionId: string,
    voterId: string,
  ): Promise<Vote | null> {
    return this.prismaService.vote.findFirst({
      where: {
        electionId,
        voterId,
      },
    })
  }
}
