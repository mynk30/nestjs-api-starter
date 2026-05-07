import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor';


async function bootstrap() {

  const isProd = process.env.NODE_ENV === 'production';

  const logger = isProd
    ? true // JSON logs ✅
    : {
      transport: {
        target: 'pino-pretty',
      },
    };

  const port = process.env.PORT || 3000;

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(
    {
      logger: logger,
      disableRequestLogging: true
    }
  ));

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port);
}
bootstrap();
