import { Injectable } from '@nestjs/common'
import { Vote } from '@prisma/client'
import { CandidatesRepository } from '@/database/contracts/contract-candidates-repository'
import { VotersRepository } from '@/database/contracts/contract-voters-repository'
import { VotesRepository } from '@/database/contracts/contract-votes-repository'
import { ElectionsRepository } from '@/database/contracts/contract-elections-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NoActiveElectionsError } from './errors/no-active-elections-error'
import { VoterAlreadyVotedInThisElectionError } from './errors/voter-already-voted-in-this-election-error'

type VoteUseCaseRequest = {
  voterElectoralTitle: string
  candidateNumber: number
}

type VoteUseCaseResponse = {
  vote: Vote
}

@Injectable()
export class VoteUseCase {
  constructor(
    private candidatesRepository: CandidatesRepository,
    private votersRepository: VotersRepository,
    private electionsRepository: ElectionsRepository,
    private votesRepository: VotesRepository,
  ) {}

  async execute({
    voterElectoralTitle,
    candidateNumber,
  }: VoteUseCaseRequest): Promise<VoteUseCaseResponse> {
    const voter =
      await this.votersRepository.findByElectoralTitle(voterElectoralTitle)
    if (voter === null) {
      throw new ResourceNotFoundError(
        'Eleitor',
        'titulo eleitoral',
        voterElectoralTitle,
      )
    }

    const candidate =
      await this.candidatesRepository.findByNumber(candidateNumber)
    if (candidate === null) {
      throw new ResourceNotFoundError(
        'Candidato',
        'número',
        String(candidateNumber),
      )
    }

    const now = new Date()
    const election = await this.electionsRepository.findByDate(now)
    if (election === null) {
      throw new NoActiveElectionsError()
    }

    const voteExists = await this.votesRepository.findByElectionAndVoter(
      election.id,
      voter.id,
    )
    if (voteExists !== null) {
      throw new VoterAlreadyVotedInThisElectionError()
    }

    const createdVote = await this.votesRepository.create({
      candidateId: candidate.id,
      voterId: voter.id,
      electionId: election.id,
    })

    return {
      vote: createdVote,
    }
  }
}
