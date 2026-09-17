import { Injectable, OnModuleInit, OnModuleDestroy, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Entity, PrimaryGeneratedColumn, Column, Repository } from 'typeorm';

// ==========================================
// 1. TYPEORM NÜMUNƏSİ (Entity & Repository)
// ==========================================

// Entity - Verilənlər bazasındakı cədvəlin modeli
@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal')
  price: number;
}

// Service - Repository-nin Inject edilməsi
@Injectable()
export class TypeOrmProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) { }

  async getAllProducts() {
    // SQL: SELECT * FROM product_entity;
    return await this.productRepo.find();
  }

  async createProduct(title: string, price: number) {
    const product = this.productRepo.create({ title, price });
    // SQL: INSERT INTO product_entity ...
    return await this.productRepo.save(product);
  }
}

// ==========================================
// 2. PRISMA ORM NÜMUNƏSİ (Custom Service Wrapper)
// ==========================================

// PrismaService - PrismaClient-i Injectable formaya salırıq
@Injectable()
export class MockPrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log('🔌 Prisma DB-yə uğurla qoşuldu');
  }

  async onModuleDestroy() {
    console.log('🔌 Prisma DB bağlantısı kəsildi');
  }

  // Simulyasiya edilən prisma obyektləri
  product = {
    findMany: async () => [{ id: 1, title: 'Prisma Laptop', price: 2000 }],
    create: async (args: { data: { title: string; price: number } }) => ({
      id: Math.floor(Math.random() * 1000),
      ...args.data,
    }),
  };
}

@Injectable()
export class PrismaProductService {
  constructor(private readonly prisma: MockPrismaService) { }

  async getAllProducts() {
    return await this.prisma.product.findMany();
  }

  async createProduct(title: string, price: number) {
    return await this.prisma.product.create({
      data: { title, price },
    });
  }
}
