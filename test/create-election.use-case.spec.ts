import dayjs from 'dayjs'
import { InMemoryElectionsRepository } from '@/database/in-memory/repositories/in-memory-elections-repository'
import { CreateElectionUseCase } from '@/use-cases/create-election.use-case'
import { ElectionAlreadyExistsInThisPeriodError } from '@/use-cases/errors/election-already-exists-in-this-period-error'
import { InMemoryCandidatesRepository } from '@/database/in-memory/repositories/in-memory-candidates-repository'
import { InMemoryVotesRepository } from '@/database/in-memory/repositories/in-memory-votes-repository'

let inMemoryElectionsRepository: InMemoryElectionsRepository
let sut: CreateElectionUseCase

describe('Create election', () => {
  beforeEach(() => {
    const inMemoryVotesRepository = new InMemoryVotesRepository()
    const inMemoryCandidatesRepository = new InMemoryCandidatesRepository()
    inMemoryElectionsRepository = new InMemoryElectionsRepository(
      inMemoryVotesRepository,
      inMemoryCandidatesRepository,
    )
    sut = new CreateElectionUseCase(inMemoryElectionsRepository)
  })

  it('should be able to create a election', async () => {
    const now = dayjs()
    const tomorrow = now.add(1, 'day')
    const { election } = await sut.execute({
      startDate: now.toDate(),
      endDate: tomorrow.toDate(),
    })

    expect(inMemoryElectionsRepository.items[0].id).toBe(election.id)
  })

  it('should not be able to create two elections in same period', async () => {
    const now = dayjs()
    const tomorrow = now.add(1, 'day')
    await inMemoryElectionsRepository.create({
      startDate: now.toDate(),
      endDate: tomorrow.toDate(),
    })

    await expect(
      async () =>
        await sut.execute({
          startDate: now.add(2, 'hour').toDate(),
          endDate: tomorrow.add(2, 'hour').toDate(),
        }),
    ).rejects.toThrowError(new ElectionAlreadyExistsInThisPeriodError())
  })
})
