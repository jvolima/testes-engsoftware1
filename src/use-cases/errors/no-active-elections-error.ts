import { ApiError } from './api-error'

export class NoActiveElectionsError extends ApiError {
  constructor() {
    super({
      statusCode: 400,
      message: 'Não há eleições ativas.',
    })
  }
}
