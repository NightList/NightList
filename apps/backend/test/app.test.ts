import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';

describe('NightList API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app?.close();
  });

  it('GET /health', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /pricing/estimate validates and calculates', async () => {
    const res = await request(app.getHttpServer())
      .post('/pricing/estimate')
      .send({
        items: [{ name: 'set', quantity: 2, unitPrice: 1000 }],
        fees: { serviceChargeRate: 10, vatRate: 7, otherFees: 0 },
        pax: 4,
      })
      .expect(201);
    expect(res.body.estimatedTotal).toBe(2354);
  });

  it('POST /pricing/estimate rejects invalid body', async () => {
    await request(app.getHttpServer()).post('/pricing/estimate').send({ pax: 0 }).expect(400);
  });

  it('POST /jobs/* requires the job secret', async () => {
    await request(app.getHttpServer()).post('/jobs/booking-timeouts').expect(401);
    await request(app.getHttpServer())
      .post('/jobs/booking-timeouts')
      .set('x-job-secret', 'test-job-secret')
      .expect(200);
  });
});
