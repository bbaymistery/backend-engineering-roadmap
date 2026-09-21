import { Injectable } from '@nestjs/common';

export interface PaymentService {
  processPayment(amount: number): string;
}

@Injectable()
export class StripePaymentService implements PaymentService {
  processPayment(amount: number): string {
    return `[Stripe Production] ${amount} AZN ödəniş icra olundu.`;
  }
}

@Injectable()
export class MockPaymentService implements PaymentService {
  processPayment(amount: number): string {
    return `[Mock Test Environment] ${amount} AZN simulyasiya olundu.`;
  }
}
