import { NestFactory } from '@nestjs/core';
import { PostModule } from './post.module';
import { POST_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getRmqOptions(POST_SERVICE));

  await app.listen(null);
  app.startAllMicroservices()
}
bootstrap();
