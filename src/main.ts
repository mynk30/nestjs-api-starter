import { NestFactory } from '@nestjs/core';


import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { clientConfig } from './config/client.config';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {

  const isProd = process.env.NODE_ENV === 'production';

  const logger = isProd
    ? true
    : {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: false,
        },
      },
    };

  const port = process.env.PORT || 3000;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: logger,
      disableRequestLogging: true,
    }),
    // {
    //   logger: ['error', 'warn'],
    // },
  );

  await app.register(fastifyCookie as any);

  app.getHttpAdapter().getInstance().addHook("onRequest", async (request, reply) => {
    (request as any).startTime = Date.now();
  });

  app.enableCors({
    origin: clientConfig.cors.origins,
    credentials: true,
  });

  // Register Global Logic
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());



  await app.listen(port);


}

bootstrap();