import { ApiError } from './api-error'

export class VoterAlreadyVotedInThisElectionError extends ApiError {
  constructor() {
    super({
      statusCode: 400,
      message: 'O eleitor já votou nesta eleição.',
    })
  }
}
