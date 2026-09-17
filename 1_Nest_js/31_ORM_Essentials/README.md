# 🗄️ NestJS: ORM Essentials & Database Integrations (#31)

Salam! **`31_ORM_Essentials`** dərsinə xoş gəldin!

Əgər müəllimin *"Prisma, TypeORM, Mongoose, Drizzle"* sözlərindən başın qarışıbsa, heç narahat olma. Bu sənəddə **ORM nədir**, **Prisma nədir**, niyə istifadə edirik, TypeORM ilə Prisma-nın fərqi nədir və hansını ne vaxt seçməliyik sorularına ən sadə və aydın cavabları tapacaqsan.

---

## ❓ 1. ORM Nədir və Niyə Lazımdır? (Ən Sadə Həyati İzah)

### 💡 Həyati Analogiya (Tərcüməçi):
- **NestJS / TypeScript:** Sən **Azərbaycanca** danışırsan.
- **Database (PostgreSQL / MySQL):** Verilənlər bazası isə **Çincə** (SQL dilində) danışır.

Əgər ortada tərcüməçi olmasa, sən bazadan məlumat almaq üçün məcbursan dırnaq içində uzun Çincə SQL cümlələri yazasan:
```sql
SELECT * FROM users WHERE age > 18 AND status = 'active';
```
Əgər bu cümlədə bircə hərfi səhv yazsan (məsələn, `SELEKT`), proqram işləyən zaman partlayaq!

**ORM (Object-Relational Mapping)** — Sənin yanında oturan **Peşəkar Tərcüməçidir**.
Sən öz doğma dilində (TypeScript metodları ilə) yazırsan:
```typescript
this.usersRepository.find({ where: { age: 18 } }); // TypeORM
// və ya
this.prisma.user.findMany({ where: { age: 18 } }); // Prisma
```
Tərcüməçi (ORM) bunu arxa planda avtomatik Çincəyə (SQL-ə) çevirir və bazaya göndərir. Yəni sən SQL xətası etmədən və dırnaq içində mürəkkəb kodlar yazmadan baza ilə rahat danışırsan!

---

## 🏎️ 2. Prisma Nədir? TypeORM vs Prisma Müqayisəsi

**Prisma da sadəcə bir ORM-dir!** Eynilə TypeORM kimi, Prisma-nın da işi NestJS ilə Database arasında tərcüməçilik etməkdir.

### 🚘 Maşın Analogiyası:
- **TypeORM** — 2010-cu ilin etibarlı, mexaniki sürətlər qutusu olan **Mercedes** maşınıdır.
- **Prisma** — 2024-cü ilin avtomat sürətlər qutusu olan, müasir **Tesla** maşınıdır.

Hər ikisinin məqsədi eynidir: **Səni A nöqtəsindən B nöqtəsinə aparmaq (Baza ilə əlaqə qurmaq).** Amma **Prisma (Tesla)** daha müasirdir, sürmək daha rahatdır və proqramçıya kod yazanda az səhv etməyə imkan verir.

### ❓ İkisini Eyni Layihədə İstifadə Edirik?
**XEYR! ❌** Bir layihəyə başlayanda sən **seçim edirsən**: Ya **TypeORM** seçirsən, ya da **Prisma** seçirsən. Eyni anda həm TypeORM, həm Prisma işlədilmir (çünki iki maşını eyni anda sürə bilməzsən).

---

## 📊 3. Müəllimin Qeyd Etdiyi ORM-lərin Müqayisə Cədvəli

| ORM / Library | Qablaşdırma Paketləri | Cədvəlləri Necə Yaradırıq? | Type-Safety (Kod Köməyi) | Nə vaxt istifadə edilir? |
| :--- | :--- | :--- | :--- | :--- |
| **Prisma** | `@prisma/client` (Custom Provider) | Tək bir `schema.prisma` faylında bütün cədvəlləri yazırıq. | **MÜKƏMMƏLDİR!** (Nöqtə `.` qoyan kimi avtomatik bütün sahələri göstərir). | **Yeni başlayan 80% müasir layihələrdə və startaplarda!** (Həmçinin `npx prisma studio` vizual paneli var). |
| **TypeORM** | `@nestjs/typeorm` | Hər cədvəl üçün ayrı TypeScript klası və `@Entity()`, `@Column()` yazırıq. | Yaxşıdır, amma mürəkkəb sorğularda `any` ola bilir. | Köhnə layihələrdə və ya şirkət standart olaraq TypeORM işlədirsə. |
| **Mongoose** | `@nestjs/mongoose` | Schema / Model tərifləri ilə. | Yaxşıdır. | NoSQL bazası olan **MongoDB** üçün. |
| **Drizzle ORM** | Custom Provider | TS Schema tərifləri ilə. | Mükəmməldir. | Ultran-sürətli, lightweight SQL query builder lazım olduqda. |
| **Sequelize** | `@nestjs/sequelize` | Model klasları ilə. | Orta. | Ən köhnə Node.js layihələrində. |

---

## 💡 4. Nümunə Kod Müqayisəsi (Eyni İşi Görən İki ORM)

İkisi də eyni işi görür (Bütün istifadəçiləri bazadan gətirir):

### TypeORM ilə:
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  getUsers() {
    return this.usersRepo.find(); // SQL: SELECT * FROM users;
  }
}
```

### Prisma ilə:
```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany(); // SQL: SELECT * FROM users;
  }
}
```

---

## 🔑 5. NestJS-də Verilənlər Bazası Əsas Konsepti (Database as Provider)

NestJS-də Database qoşulması və cədvəllərlə işləyən metodlar (Repositories və ya PrismaClient) sadəcə bir **Provider**-dir.
Yəni onlar NestJS-in **Dependency Injection (DI)** sisteminə daxil edilir və Service-lərin `constructor`-ında daxil olunur (Inject edilir).

---

## 💻 6. İki Əsas ORM-in Quraşdırılması və İnteqrasiya Addımları

### A) TypeORM İnteqrasiyası (Repository Pattern)

#### Step 1: Quraşdırma
```bash
npm install @nestjs/typeorm typeorm pg
```

#### Step 2: Entity (Cədvəl Modelinin) Yaradılması (`user.entity.ts`)
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
```

#### Step 3: Modula Qoşulma (`app.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      entities: [User],
      synchronize: true, // ⚠️ Prodakşında heç vaxt true etməyin!
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AppModule {}
```

---

### B) Prisma ORM İnteqrasiyası (Custom Provider Pattern)

#### Step 1: Quraşdırma
```bash
npm install prisma @prisma/client
npx prisma init
```

#### Step 2: Prisma Servisinin Bükülməsi (`prisma.service.ts`)
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Modul başlayanda DB-yə qoşulur
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Modul bitəndə bağlantını kəsir
  }
}
```

#### Step 3: Prisma Modulunun Yaradılması (`prisma.module.ts`)
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 🎯 7. Qızıl Xülasə

1. **ORM nədir?** SQL sorğularını TypeScript metodlarına çevirən tərcüməçidir.
2. **Prisma nədir?** Ən müasir, developerlər tərəfindən çox sevilən ORM tərcüməçisidir.
3. **Niyə Prisma?** Çünki kod yazmaq daha asandır, səhv etmək şansı azdır və `npx prisma studio` kimi vizual idarə paneli var.
4. **Hansı lazımdır?** Müasir layihələrdə 10 nəfərdən 8-i **Prisma** seçir!
