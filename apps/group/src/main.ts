import { NestFactory } from '@nestjs/core';
import { GroupModule } from './group.module';
import { GROUP_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(GroupModule);

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions(GROUP_SERVICE));

  await app.listen(null);
  app.startAllMicroservices();
}
bootstrap();
