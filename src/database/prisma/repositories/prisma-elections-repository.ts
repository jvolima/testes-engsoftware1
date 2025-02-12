import { Election } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  ElectionsRepository,
  CreateElection,
} from '@/database/contracts/contract-elections-repository'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaElectionsRepository implements ElectionsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateElection): Promise<Election> {
    return this.prismaService.election.create({
      data,
    })
  }

  async findById(id: string): Promise<Election | null> {
    return this.prismaService.election.findUnique({
      where: {
        id,
      },
    })
  }

  async findByDate(date: Date): Promise<Election | null> {
    return this.prismaService.election.findFirst({
      where: {
        AND: [
          {
            startDate: {
              lte: date,
            },
          },
          {
            endDate: {
              gte: date,
            },
          },
        ],
      },
    })
  }

  async findByPeriod(startDate: Date, endDate: Date): Promise<Election | null> {
    return this.prismaService.election.findFirst({
      where: {
        OR: [
          {
            startDate: {
              lte: startDate,
            },
            endDate: {
              gte: endDate,
            },
          },
          {
            startDate: {
              lte: startDate,
            },
            endDate: {
              gte: startDate,
            },
          },
        ],
      },
    })
  }

  async getCandidatesWithVotes(electionId: string): Promise<
    {
      name: string
      number: number
      votesTotal: number
    }[]
  > {
    return this.prismaService.candidate
      .findMany({
        where: {
          votes: {
            some: {
              electionId,
            },
          },
        },
        select: {
          name: true,
          number: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      })
      .then((candidates) =>
        candidates.map((candidate) => ({
          name: candidate.name,
          number: candidate.number,
          votesTotal: candidate._count.votes,
        })),
      )
  }
}
