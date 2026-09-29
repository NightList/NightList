import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createApp } from './bootstrap';

async function main() {
  const app = await createApp();
  const port = app.get(ConfigService).get<number>('PORT', 3000);
  await app.listen(port);
  Logger.log(`API http://localhost:${port}  ·  Swagger http://localhost:${port}/docs`, 'Bootstrap');
}

void main();
