import { NestFactory } from '@nestjs/core';
import { GroupModule } from './group.module';

async function bootstrap() {
  const app = await NestFactory.create(GroupModule);
  await app.listen(3000);
}
bootstrap();
