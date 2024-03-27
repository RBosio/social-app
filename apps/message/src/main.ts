import { NestFactory } from '@nestjs/core';
import { MessageModule } from './message.module';
import { MESSAGE_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(MessageModule);

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions(MESSAGE_SERVICE));

  await app.listen(null);
  app.startAllMicroservices();
}
bootstrap();
