import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CandidatesRepository } from './contracts/contract-candidates-repository'
import { PrismaCandidatesRepository } from './prisma/repositories/prisma-candidates-repository'
import { PoliticalPartiesRepository } from './contracts/contract-political-parties-repository'
import { PrismaPoliticalPartiesRepository } from './prisma/repositories/prisma-political-parties-repository'
import { VotersRepository } from './contracts/contract-voters-repository'
import { PrismaVotersRepository } from './prisma/repositories/prisma-voters-repository'
import { VotesRepository } from './contracts/contract-votes-repository'
import { PrismaVotesRepository } from './prisma/repositories/prisma-votes-repository'
import { ElectionsRepository } from './contracts/contract-elections-repository'
import { PrismaElectionsRepository } from './prisma/repositories/prisma-elections-repository'

@Module({
  providers: [
    PrismaService,
    { provide: CandidatesRepository, useClass: PrismaCandidatesRepository },
    {
      provide: PoliticalPartiesRepository,
      useClass: PrismaPoliticalPartiesRepository,
    },
    { provide: VotersRepository, useClass: PrismaVotersRepository },
    { provide: VotesRepository, useClass: PrismaVotesRepository },
    { provide: ElectionsRepository, useClass: PrismaElectionsRepository },
  ],
  exports: [
    PrismaService,
    CandidatesRepository,
    PoliticalPartiesRepository,
    VotersRepository,
    VotesRepository,
    ElectionsRepository,
  ],
})
export class DatabaseModule {}
