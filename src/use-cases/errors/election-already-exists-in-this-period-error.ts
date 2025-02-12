import { ApiError } from './api-error'

export class ElectionAlreadyExistsInThisPeriodError extends ApiError {
  constructor() {
    super({
      statusCode: 400,
      message: 'Já existe uma eleição nesse período.',
    })
  }
}
