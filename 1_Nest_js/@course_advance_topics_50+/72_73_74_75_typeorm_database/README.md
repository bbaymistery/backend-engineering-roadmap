# 🐘 ⚡ 🗄️ NestJS + TypeORM & PostgreSQL Master Guide (#72, #73, #74, #75)

Salam! **`72_73_74_75_typeorm_database`** dərslərinə xoş gəldin!

Bu böyük bölmədə NestJS tətbiqlərinin verilənlər bazası (PostgreSQL) ilə inteqrasiyasının **bütün 4 mərhələsini** sıfırdan və istehsalat səviyyəsində öyrənirik:
1. **Topic 72:** Docker ilə PostgreSQL Verilənlər Bazasının Quraşdırılması.
2. **Topic 73:** NestJS + TypeORM Dinamik Qoşulma (`TypeOrmModule.forRootAsync`).
3. **Topic 74:** Entity Anlayışı və TypeORM Dekaratorları (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`).
4. **Topic 75:** Repository Pattern Və CRUD Əməliyyatları (`@InjectRepository`, `create`, `save`, `find`, `softDelete`).

---

## 📖 Bu Layihəni Və Kodları Hansı Sırayla Oxumalısan? (Step-by-Step Code Guide)

Kod bloqlarını daha yaxşı başa düşmək üçün faylları daxilindəki şərhlər (comments) ilə birlikdə aşağıdakı sıra ilə oxumağın tövsiyə olunur:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KODLARI OXUMA SIRASI                            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. [docker-compose.yml]      ──> Docker PostgreSQL konteyner ayarları  │
│ 2. [database.config.ts]      ──> NestJS TypeORM Async konfiqurasiyası  │
│ 3. [entities/user.entity.ts] ──> DB Cədvəl strukturu və dekaratorlar   │
│ 4. [users.module.ts]         ──> TypeOrmModule.forFeature([UserEntity])│
│ 5. [users.service.ts]        ──> Repository CRUD metodu və SQL şərhləri│
│ 6. [users.controller.ts]     ──> REST API Endpoint-ləri               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🐳 TOPIC 72: PostgreSQL + Docker Container Setup

Verilənlər bazasını kompyuterə birbaşa yox, **Docker Konteyner** daxilində quraşdırmaq ən müasir və peşəkar yoldur.

### 🛠️ `docker-compose.yml` Faylının Məntiqi:
```yaml
version: '3.8'
services:
  postgres-db:
    image: postgres:15-alpine
    container_name: nestjs_postgres_db
    ports:
      - '5432:5432' # Host : Container
    environment:
      POSTGRES_USER: nest_user
      POSTGRES_PASSWORD: nest_password
      POSTGRES_DB: nest_database
    volumes:
      - postgres_data:/var/lib/postgresql/data # Məlumatların itməməsi üçün
```

### 🚀 Docker-i İşə Salmaq Üçün Əmr:
```bash
docker-compose up -d
```

---

## ⚡ TOPIC 73: TypeORM Async Configuration (`TypeOrmModule.forRootAsync`)

NestJS-də verilənlər bazası konfiqurasiyasını `.env` faylından dinamik oxumaq üçün `forRootAsync` istifadə olunur.

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production', // ⚠️ Prod-da false olmalıdır!
  }),
  inject: [ConfigService],
})
```

---

## 🏛️ TOPIC 74: Entity Anlayışı & TypeORM Dekaratorları

**Entity** — TypeScript Klassının PostgreSQL-dəki fiziki cədvələ (Table) uyğunlaşdırılmasıdır.

### 🔑 Əsas Dekaratorlar:
* **`@Entity('users')`**: PostgreSQL-də `users` cədvəlini təmsil edir.
* **`@PrimaryGeneratedColumn()`**: Avtomatik artan unikal ID (Auto-increment PK).
* **`@Column({ unique: true })`**: Sütun parametrləri (Məs: unikal email).
* **`@Column({ select: false })`**: Təhlükəsizlik! `SELECT *` edərkən şifrənin avtomatik qayıtmasının qarşısını alır.
* **`@CreateDateColumn()`** & **`@UpdateDateColumn()`**: Yaradılma və yenilənmə tarixlərini avtomatik idarə edir.
* **`@DeleteDateColumn()`**: **Soft Delete** (Yumşaq silmə) üçün istifadə olunur.

---

## 📦 TOPIC 75: Repository Pattern & CRUD Əməliyyatları

TypeORM-da verilənlər bazasına SQL yazmaq üçün **Repository Pattern** istifadə edilir.

### 🛠️ 1. Modulda Registrasiya (`users.module.ts`):
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // 👈 Entity-ni təqdim edirik
})
export class UsersModule {}
```

### 🛠️ 2. Servisdə İnject Etmək (`users.service.ts`):
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
}
```

### 🛠️ 3. Əsas Repository Metodları:

| Metod                                        | Nə İş Görür?                | SQL Qarşılığı                              |
| :------------------------------------------- | :-------------------------- | :----------------------------------------- |
| `this.repo.create(dto)`                      | RAM-da Obyekt yaradır.      | SQL yazmır (Sadece JS instansiyasıdır).    |
| `await this.repo.save(entity)`               | Bazaya yazır/yeniləyir.     | `INSERT INTO users...` / `UPDATE users...` |
| `await this.repo.find()`                     | Bütün siyahını alır.        | `SELECT * FROM users`                      |
| `await this.repo.findOne({ where: { id } })` | Tək sətir tapır.            | `SELECT * FROM users WHERE id = :id`       |
| `await this.repo.update(id, dto)`            | Sətiri yeniləyir.           | `UPDATE users SET ... WHERE id = :id`      |
| `await this.repo.softDelete(id)`             | Yumşaq silir (`deletedAt`). | `UPDATE users SET deletedAt = NOW()`       |
| `await this.repo.delete(id)`                 | Bazadan tam silir.          | `DELETE FROM users WHERE id = :id`         |
