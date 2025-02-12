import { PoliticalParty } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  PoliticalPartiesRepository,
  CreatePoliticalParty,
} from '@/database/contracts/contract-political-parties-repository'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPoliticalPartiesRepository
  implements PoliticalPartiesRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(data: CreatePoliticalParty): Promise<PoliticalParty> {
    return this.prismaService.politicalParty.create({
      data,
    })
  }

  async findById(id: string): Promise<PoliticalParty | null> {
    return this.prismaService.politicalParty.findUnique({
      where: {
        id,
      },
    })
  }
}
