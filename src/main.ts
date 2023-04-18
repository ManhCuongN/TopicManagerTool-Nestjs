import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// import cookieSession from 'cookie-session';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  
  
  await app.listen(3000);
}
bootstrap();
