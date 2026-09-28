import { Injectable } from '@nestjs/common';
import type { PriceEstimate, PriceEstimateInput } from '@nightlist/types';
import { estimatePrice } from '@nightlist/utils';

@Injectable()
export class PricingService {
  estimate(input: PriceEstimateInput): PriceEstimate {
    return estimatePrice(input);
  }
}
