import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CoLab API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('/api/v1');
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: [
      'http://192.168.100.177:3000',
      process.env.CLIENT_URL,
      'http://localhost:3000',
    ],
  });
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`App started at ${PORT}`);
  
}
bootstrap();
