import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ErrorHandler } from './error-handler'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalFilters(new ErrorHandler())
  await app.listen(3333)
}

bootstrap()
