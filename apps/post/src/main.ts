import { NestFactory } from '@nestjs/core';
import { COMMENT_SERVICE, POST_SERVICE, RmqService } from '@app/common';
import { BaseModule } from './base.module';

async function bootstrap() {
  const app = await NestFactory.create(BaseModule);

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions(POST_SERVICE));
  app.connectMicroservice(rmqService.getRmqOptions(COMMENT_SERVICE));

  await app.listen(null);
  app.startAllMicroservices();
}
bootstrap();
