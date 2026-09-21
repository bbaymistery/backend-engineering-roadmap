import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

/**
 * 🏛️ Topic 74: TypeORM Entity və Dekaratorlar
 * 
 * `@Entity('users')` - Bu klassın PostgreSQL-də `users` cədvəlinə qarşılıq gəldiyini bildirir.
 */
@Entity('users')
export class UserEntity {
  // 🔑 Primary Key: Avtomatik artan (Auto-Increment) Unikal ID
  @PrimaryGeneratedColumn()
  id: number;

  // 📝 Normal Mətn Sütunu (VARCHAR 100)
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  // 📧 Unikal Email (Dəfələrlə təkrar oluna bilməz)
  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  // 🔒 Şifrə (select: false - SELECT * edərkən şifrə avtomatik qayıtmır, təhlükəsizlikdir!)
  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  // 🎭 Enum Sütunu (Rollar)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // 🟢 Aktivlik Vəziyyəti
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // 📅 Avtomatik Yaradılma Tarixi (INSERT zamanı avtomatik dolur)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 🔄 Avtomatik Yenilənmə Tarixi (UPDATE zamanı avtomatik yenilənir)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // 🗑️ Soft Delete (Yumşaq Silmə - Məlumat bazadan silinmir, yalnız bu tarix dolur)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
