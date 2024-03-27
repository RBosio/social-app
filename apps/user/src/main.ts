import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { RmqService, USER_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions(USER_SERVICE));

  await app.listen(null);
  app.startAllMicroservices();
}
bootstrap();
