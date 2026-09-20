import { Controller, Get, Inject } from '@nestjs/common';
import {
  SingletonService,
  RequestScopedService,
  TransientService,
} from './injection-scopes.service';
import {
  CONFIG_OPTIONS,
  PAYMENT_SERVICE_TOKEN,
} from './custom-providers.module';
import { PaymentService } from './payment-strategy.service';

@Controller('providers-demo')
export class ScopesDemoController {
  constructor(
    // 1️⃣ Standard Class Injection:
    private readonly singletonService: SingletonService,

    // 2️⃣ Injection Scopes:
    private readonly requestScopedService: RequestScopedService,
    private readonly transientService1: TransientService,
    private readonly transientService2: TransientService,

    // 3️⃣ Custom Tokens (@Inject ilə):
    @Inject(CONFIG_OPTIONS)
    private readonly configOptions: { apiUrl: string; timeout: number },

    @Inject(PAYMENT_SERVICE_TOKEN)
    private readonly paymentService: PaymentService,

    @Inject('DATABASE_CONNECTION')
    private readonly dbConn: { status: string; connectedAt: string },
  ) {}

  /**
   * 🔍 Custom Providers və Scopes Nümayişi
   */
  @Get('test-scopes')
  testScopes() {
    return {
      // Singleton: Hər sorğuda eyni ID qalacaq
      singletonId: this.singletonService.getInstanceId(),

      // Request-Scoped: Hər yeni HTTP sorğusunda bu ID DƏYİŞƏCƏK
      requestScopedId: this.requestScopedService.getInstanceId(),
      requestCreatedAt: this.requestScopedService.getCreatedAt(),

      // Transient: Hətta eyni sorğu daxilində transientService1 və transientService2 FƏRQLİ ID-yə malikdir!
      transientId1: this.transientService1.getInstanceId(),
      transientId2: this.transientService2.getInstanceId(),

      // Custom Value Provider:
      config: this.configOptions,

      // Custom Class Provider (useClass Polymorphism):
      paymentResult: this.paymentService.processPayment(150),

      // Custom Factory Provider:
      dbStatus: this.dbConn,
    };
  }
}
