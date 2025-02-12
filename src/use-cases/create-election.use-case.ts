import { Injectable } from '@nestjs/common'
import { Election } from '@prisma/client'
import { ElectionsRepository } from '@/database/contracts/contract-elections-repository'
import { ElectionAlreadyExistsInThisPeriodError } from './errors/election-already-exists-in-this-period-error'

type CreateElectionUseCaseRequest = {
  startDate: Date
  endDate: Date
}

type CreateElectionUseCaseResponse = {
  election: Election
}

@Injectable()
export class CreateElectionUseCase {
  constructor(private electionsRepository: ElectionsRepository) {}

  async execute({
    startDate,
    endDate,
  }: CreateElectionUseCaseRequest): Promise<CreateElectionUseCaseResponse> {
    const election = await this.electionsRepository.findByPeriod(
      startDate,
      endDate,
    )
    if (election !== null) {
      throw new ElectionAlreadyExistsInThisPeriodError()
    }

    const createdElection = await this.electionsRepository.create({
      startDate,
      endDate,
    })

    return {
      election: createdElection,
    }
  }
}
