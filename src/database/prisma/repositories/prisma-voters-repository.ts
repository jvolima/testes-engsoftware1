import { Voter } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  VotersRepository,
  CreateVoter,
} from '@/database/contracts/contract-voters-repository'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaVotersRepository implements VotersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateVoter): Promise<Voter> {
    return this.prismaService.voter.create({
      data,
    })
  }

  async findById(id: string): Promise<Voter | null> {
    return this.prismaService.voter.findUnique({
      where: {
        id,
      },
    })
  }

  async findByElectoralTitle(electoralTitle: string): Promise<Voter | null> {
    return this.prismaService.voter.findUnique({
      where: {
        electoralTitle,
      },
    })
  }
}
