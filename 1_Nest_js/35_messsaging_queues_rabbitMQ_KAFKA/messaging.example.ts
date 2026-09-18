import { Injectable, Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

// ==========================================
// 1. MIKROSERVIS CONSUMER (RabbitMQ / Kafka / Redis)
// ==========================================

@Controller()
export class MicroserviceConsumerController {
  // Fire & Forget: Hadisə baş verəndə işə düşür (Cavab qaytarmır)
  @EventPattern('user_registered')
  handleUserRegistered(@Payload() data: { userId: number; email: string }) {
    console.log(`📧 [RabbitMQ Event] Xoş gəldiniz email-i göndərildi: ${data.email}`);
  }

  // Request - Response: Sorğu gələndə emal edib cavab qaytarır
  @MessagePattern('calculate_tax')
  handleCalculateTax(@Payload() data: { amount: number }) {
    console.log(`🧮 [RabbitMQ Message] Vergi hesablanır: ${data.amount}`);
    return { tax: data.amount * 0.18 };
  }
}

// ==========================================
// 2. INTERNAL EVENT EMITTER (Tək Proyekt İçi Hadisələr)
// ==========================================

export class OrderCreatedEvent {
  constructor(public readonly orderId: number, public readonly amount: number) { }
}

@Injectable()
export class OrderService {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  async createOrder(amount: number) {
    const orderId = Math.floor(Math.random() * 1000);

    // Tək proyekt daxilində hadisəni (event) alovlandırırıq
    this.eventEmitter.emit('order.created', new OrderCreatedEvent(orderId, amount));

    return { success: true, orderId };
  }
}

@Injectable()
export class NotificationListenerService {
  // Proyekt daxilindəki hadisəni eşidir
  @OnEvent('order.created')
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    console.log(`🔔 [Internal Event] Sifariş #${event.orderId} yaradıldı (${event.amount} AZN)`);
  }
}
