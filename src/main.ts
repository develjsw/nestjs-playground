import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..'), {
    prefix: '/public/',
  });

  await app.listen(9999);
  console.log(`🚀 Server running on http://localhost:9999`);
  console.log(
    `📄 Translation test page: http://localhost:9999/public/translation-client-example.html`,
  );
}
void bootstrap();
