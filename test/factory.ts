import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

export class Factory {
  static createCandidate() {
    return {
      number: 55555,
      name: 'John Doe',
      politicalPartyId: randomUUID(),
    }
  }

  static createMultipleCandidates() {
    return [
      {
        number: 55555,
        name: 'John Doe',
        politicalPartyId: randomUUID(),
      },
      {
        number: 66666,
        name: 'Jane Smith',
        politicalPartyId: randomUUID(),
      },
      {
        number: 77777,
        name: 'Alice Johnson',
        politicalPartyId: randomUUID(),
      },
    ]
  }

  static createVoter() {
    return {
      electoralTitle: '123456',
      name: 'Alice Doe',
    }
  }

  static createMultipleVoters() {
    return [
      {
        electoralTitle: '123456',
        name: 'Alice Doe',
      },
      {
        electoralTitle: '654321',
        name: 'Michael Jackson',
      },
      {
        electoralTitle: '567890',
        name: 'Lebron James',
      },
    ]
  }

  static createElection() {
    const now = dayjs()
    const tomorrow = now.add(1, 'day')
    return {
      startDate: now.toDate(),
      endDate: tomorrow.toDate(),
    }
  }
}
