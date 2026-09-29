import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';

/** สร้างแอป (ใช้ทั้ง local server และ Vercel Function) */
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api'); // public path บน Vercel: /api/*

  app.enableCors({
    origin: config.get<string>('CORS_ORIGINS', '').split(',').filter(Boolean),
    credentials: true,
  });

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('NightList API').setVersion('0.1.0').addBearerAuth().build(),
  );
  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(doc));

  await app.init();
  return app;
}
