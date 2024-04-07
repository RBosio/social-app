import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors();

  // Cookie parser
  app.use(cookieParser());

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Social App')
    .setVersion('1.0')
    .addCookieAuth('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start app
  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT);
}
bootstrap();
