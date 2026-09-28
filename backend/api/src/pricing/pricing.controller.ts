import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PricingService } from '@nightlist/services';
import { PriceEstimateInput } from '@nightlist/types';
import { createZodDto } from 'nestjs-zod';

class PriceEstimateDto extends createZodDto(PriceEstimateInput) {}

/** POST /pricing/estimate — ตัวประเมินราคา (สาธารณะ ไม่ต้องล็อกอิน) */
@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricing: PricingService) {}

  @Post('estimate')
  estimate(@Body() body: PriceEstimateDto) {
    return this.pricing.estimate(body);
  }
}
