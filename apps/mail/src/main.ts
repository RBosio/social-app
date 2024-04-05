import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';
import { MAIL_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(MailModule);

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions(MAIL_SERVICE));

  await app.listen(null);
  app.startAllMicroservices()
}
bootstrap();
