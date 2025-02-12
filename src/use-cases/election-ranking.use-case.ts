import { Injectable } from '@nestjs/common'
import { ElectionsRepository } from '@/database/contracts/contract-elections-repository'
import { NoActiveElectionsError } from './errors/no-active-elections-error'

type ElectionRankingUseCaseRequest = {
  startDate: Date
  endDate: Date
}

type ElectionRankingUseCaseResponse = Array<{
  name: string
  number: number
  votesTotal: number
}>

@Injectable()
export class ElectionRankingUseCase {
  constructor(private electionsRepository: ElectionsRepository) {}

  async execute({
    startDate,
    endDate,
  }: ElectionRankingUseCaseRequest): Promise<ElectionRankingUseCaseResponse> {
    const election = await this.electionsRepository.findByPeriod(
      startDate,
      endDate,
    )
    if (election === null) {
      throw new NoActiveElectionsError()
    }

    const candidatesWithVotes =
      await this.electionsRepository.getCandidatesWithVotes(election.id)

    const ranking = candidatesWithVotes
      .map((candidate) => ({
        name: candidate.name,
        number: candidate.number,
        votesTotal: candidate.votesTotal,
      }))
      .sort((a, b) => b.votesTotal - a.votesTotal)

    return ranking
  }
}
