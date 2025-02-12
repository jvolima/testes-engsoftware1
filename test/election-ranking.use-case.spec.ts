import dayjs from 'dayjs'
import { InMemoryElectionsRepository } from '@/database/in-memory/repositories/in-memory-elections-repository'
import { ElectionRankingUseCase } from '@/use-cases/election-ranking.use-case'
import { InMemoryCandidatesRepository } from '@/database/in-memory/repositories/in-memory-candidates-repository'
import { InMemoryVotersRepository } from '@/database/in-memory/repositories/in-memory-voters-repository'
import { InMemoryVotesRepository } from '@/database/in-memory/repositories/in-memory-votes-repository'
import { Factory } from './factory'
import { NoActiveElectionsError } from '@/use-cases/errors/no-active-elections-error'

let inMemoryCandidatesRepository: InMemoryCandidatesRepository
let inMemoryVotersRepository: InMemoryVotersRepository
let inMemoryElectionsRepository: InMemoryElectionsRepository
let inMemoryVotesRepository: InMemoryVotesRepository
let sut: ElectionRankingUseCase

describe('Election ranking', () => {
  beforeEach(() => {
    inMemoryVotersRepository = new InMemoryVotersRepository()
    inMemoryVotesRepository = new InMemoryVotesRepository()
    inMemoryCandidatesRepository = new InMemoryCandidatesRepository()
    inMemoryElectionsRepository = new InMemoryElectionsRepository(
      inMemoryVotesRepository,
      inMemoryCandidatesRepository,
    )
    sut = new ElectionRankingUseCase(inMemoryElectionsRepository)
  })

  it('should be able to get election ranking', async () => {
    await Promise.all(
      Factory.createMultipleCandidates().map((candidate) =>
        inMemoryCandidatesRepository.create(candidate),
      ),
    )
    await Promise.all(
      Factory.createMultipleVoters().map((voter) =>
        inMemoryVotersRepository.create(voter),
      ),
    )
    await inMemoryElectionsRepository.create(Factory.createElection())
    await inMemoryVotesRepository.create({
      candidateId: inMemoryCandidatesRepository.items[1].id,
      voterId: inMemoryVotersRepository.items[0].id,
      electionId: inMemoryElectionsRepository.items[0].id,
    })
    await inMemoryVotesRepository.create({
      candidateId: inMemoryCandidatesRepository.items[1].id,
      voterId: inMemoryVotersRepository.items[1].id,
      electionId: inMemoryElectionsRepository.items[0].id,
    })
    await inMemoryVotesRepository.create({
      candidateId: inMemoryCandidatesRepository.items[2].id,
      voterId: inMemoryVotersRepository.items[2].id,
      electionId: inMemoryElectionsRepository.items[0].id,
    })

    const now = dayjs()
    const tomorrow = now.add(1, 'day')
    const startDate = now.toDate()
    const endDate = tomorrow.toDate()
    await inMemoryElectionsRepository.create({
      startDate,
      endDate,
    })

    const ranking = await sut.execute({ startDate, endDate })

    expect(ranking).toEqual([
      {
        name: 'Jane Smith',
        number: 66666,
        votesTotal: 2,
      },
      {
        name: 'Alice Johnson',
        number: 77777,
        votesTotal: 1,
      },
      {
        name: 'John Doe',
        number: 55555,
        votesTotal: 0,
      },
    ])
  })

  it('should not be able to get election ranking if election does not exists', async () => {
    const now = dayjs()
    const tomorrow = now.add(1, 'day')
    await inMemoryElectionsRepository.create({
      startDate: now.toDate(),
      endDate: tomorrow.toDate(),
    })

    await expect(
      async () =>
        await sut.execute({
          startDate: now.add(2, 'day').toDate(),
          endDate: tomorrow.add(2, 'day').toDate(),
        }),
    ).rejects.toThrowError(new NoActiveElectionsError())
  })
})
