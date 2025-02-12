import dayjs from 'dayjs'
import { InMemoryElectionsRepository } from '@/database/in-memory/repositories/in-memory-elections-repository'
import { VoteUseCase } from '@/use-cases/vote.use-case'
import { InMemoryCandidatesRepository } from '@/database/in-memory/repositories/in-memory-candidates-repository'
import { InMemoryVotersRepository } from '@/database/in-memory/repositories/in-memory-voters-repository'
import { InMemoryVotesRepository } from '@/database/in-memory/repositories/in-memory-votes-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { NoActiveElectionsError } from '@/use-cases/errors/no-active-elections-error'
import { Factory } from './factory'
import { VoterAlreadyVotedInThisElectionError } from '@/use-cases/errors/voter-already-voted-in-this-election-error'

let inMemoryCandidatesRepository: InMemoryCandidatesRepository
let inMemoryVotersRepository: InMemoryVotersRepository
let inMemoryElectionsRepository: InMemoryElectionsRepository
let inMemoryVotesRepository: InMemoryVotesRepository
let sut: VoteUseCase

describe('Voter vote', () => {
  beforeEach(() => {
    inMemoryVotersRepository = new InMemoryVotersRepository()
    inMemoryVotesRepository = new InMemoryVotesRepository()
    inMemoryCandidatesRepository = new InMemoryCandidatesRepository()
    inMemoryElectionsRepository = new InMemoryElectionsRepository(
      inMemoryVotesRepository,
      inMemoryCandidatesRepository,
    )
    sut = new VoteUseCase(
      inMemoryCandidatesRepository,
      inMemoryVotersRepository,
      inMemoryElectionsRepository,
      inMemoryVotesRepository,
    )
  })

  it('should be able to vote', async () => {
    await inMemoryCandidatesRepository.create(Factory.createCandidate())
    await inMemoryVotersRepository.create(Factory.createVoter())
    await inMemoryElectionsRepository.create(Factory.createElection())

    const { vote } = await sut.execute({
      candidateNumber: 55555,
      voterElectoralTitle: '123456',
    })

    expect(inMemoryVotesRepository.items[0].id).toBe(vote.id)
  })

  it('should not be able to vote if voter already voted in this election', async () => {
    await inMemoryCandidatesRepository.create(Factory.createCandidate())
    await inMemoryVotersRepository.create(Factory.createVoter())
    await inMemoryElectionsRepository.create(Factory.createElection())
    await inMemoryVotesRepository.create({
      candidateId: inMemoryCandidatesRepository.items[0].id,
      voterId: inMemoryVotersRepository.items[0].id,
      electionId: inMemoryElectionsRepository.items[0].id,
    })

    await expect(
      async () =>
        await sut.execute({
          candidateNumber: 55555,
          voterElectoralTitle: '123456',
        }),
    ).rejects.toThrowError(new VoterAlreadyVotedInThisElectionError())
  })

  it('should not be able to vote if electoral title does not exists', async () => {
    await inMemoryCandidatesRepository.create(Factory.createCandidate())
    await inMemoryVotersRepository.create(Factory.createVoter())
    await inMemoryElectionsRepository.create(Factory.createElection())

    await expect(
      async () =>
        await sut.execute({
          candidateNumber: 55555,
          voterElectoralTitle: '654321',
        }),
    ).rejects.toThrowError(
      new ResourceNotFoundError('Eleitor', 'titulo eleitoral', '654321'),
    )
  })

  it('should not be able to vote if candidate number does not exists', async () => {
    await inMemoryCandidatesRepository.create(Factory.createCandidate())
    await inMemoryVotersRepository.create(Factory.createVoter())
    await inMemoryElectionsRepository.create(Factory.createElection())

    await expect(
      async () =>
        await sut.execute({
          candidateNumber: 11111,
          voterElectoralTitle: '123456',
        }),
    ).rejects.toThrowError(
      new ResourceNotFoundError('Candidato', 'número', '11111'),
    )
  })

  it('should not be able to vote if election does not exists', async () => {
    await inMemoryCandidatesRepository.create(Factory.createCandidate())
    await inMemoryVotersRepository.create(Factory.createVoter())
    const now = dayjs()
    const nowPlusTen = now.add(10, 'day')
    const nowPlusTwenty = now.add(20, 'day')
    await inMemoryElectionsRepository.create({
      startDate: nowPlusTen.toDate(),
      endDate: nowPlusTwenty.toDate(),
    })

    await expect(
      async () =>
        await sut.execute({
          candidateNumber: 55555,
          voterElectoralTitle: '123456',
        }),
    ).rejects.toThrowError(new NoActiveElectionsError())
  })
})
