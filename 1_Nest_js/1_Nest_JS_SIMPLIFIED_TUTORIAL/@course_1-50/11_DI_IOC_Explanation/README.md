# 📘 11 - Dependency Injection (DI) Resolution Process & Modullararası Əlaqə

Bu sənəddə NestJS-in daxili **DI Konteyneri (IoC)**, modullararası servislərin paylaşılması (`exports` & `imports`) və sorğuların **3 addımlı Həll olunma Prosesi (DI Resolution Flow)** ətraflı izah edilir.

---

## 🏗️ 1. Modullararası Əlaqə və Injection Mexanizmi

Şəkillərdə göstərilən arxitektura 2 əsas moduldur: **`UsersModule`** və **`OrdersModule`**.

```text
+---------------------------------------------------------------------------------+
|                           NestJS DI Container (IoC)                             |
|         Manages all providers, resolves dependencies, creates instances          |
+---------------------------------------------------------------------------------+
        │                                                     │
        │ registers                                           │ registers
        v                                                     v
+-----------------------------+               +-----------------------------------+
|         UsersModule         |               |           OrdersModule            |
|                             |               |                                   |
| @Module({                   |               | @Module({                         |
|   providers: [UsersService],|               |   imports: [UsersModule], ◄───────┼── imports UsersModule
|   controllers: [UsersCtrl], |               |   providers: [OrdersService],     |
|   exports: [UsersService] ──┼───────────────┼──►controllers: [OrdersCtrl],      |
| })                          | exports       | })                                |
+-----------------------------+ UsersService  +-----------------------------------+
```

### 🔑 3 Qızıl Şərt:
1. **UsersService Export edilməlidir**: `UsersModule` daxilində `exports: [UsersService]` qeyd olunur. Bununla NestJS-ə deyirik ki, `UsersService` başqa modullar üçün də əlçatandır.
2. **OrdersModule Import etməlidir**: `OrdersModule` daxilində `imports: [UsersModule]` qeyd olunur.
3. **Injected into OrdersService / OrdersController**: Artıq `OrdersService` və ya `OrdersController` daxilində konstruktora `private readonly usersService: UsersService` yazaraq həmin servisi istifadə edə bilərik.

---

## 🔄 2. DI Həll Olunma Prosesi (DI Resolution Flow - 3 Addım)

NestJS proqramı başlayanda (Booting) IoC Konteyner bütün asılılıqları dəqiqliklə 3 addımda həll edir:

---

### Addım 1: Modulların Qeydiyyatı (Module Registration)

NestJS ilk olaraq `AppModule`-dan başlayaraq layihədəki bütün modul ağacını (Tree) oxuyur:

```text
AppModule
  ├── imports: [UsersModule, OrdersModule]
  │
  ├──► UsersModule
  └──► OrdersModule
```

---

### Addım 2: Servislərin Qeydiyyata Alınması (Provider Registration)

NestJS hər bir modulun içindəki `providers` siyahısını oxuyur və onları daxili **DI Container** cədvəlinə (Registry) açar-dəyər (Token-Class) cütlüyü kimi yazır:

```text
DI Container Registry:
 ├── UsersService  (from UsersModule)
 └── OrdersService (from OrdersModule)
```

---

### Addım 3: Asılılıqların Dərinliyinə Görə Həlli (Dependency Resolution Tree)

NestJS obyektləri yaratmaq üçün aşağıdan-yuxarıya (Bottom-Up) zəncirvari zənciri təhlil edir:

```text
1. OrdersController-in işləməsi üçün ➡️ OrdersService lazımdır.
          │
          ▼
2. DI Container 'OrdersService'-i axtarır.
          │
          ▼
3. OrdersService-in işləməsi üçün ➡️ UsersService lazımdır.
          │
          ▼
4. DI Container 'UsersService'-i axtarır.
          │
          ▼
5. UsersService-in heç bir asılılığı yoxdur! (No dependencies)
          │
          ▼
6. 🏗️ İLK ÖNCƏ UsersService obyekti yaradılır (Instance).
          │
          ▼
7. 💉 UsersService hazır obyekti 'OrdersService'-ə inject olunur və OrdersService yaratılır.
          │
          ▼
8. 💉 Hazır OrdersService obyekti 'OrdersController'-ə inject olunur!
```

---

## 💻 Əyani Kod Strukturu (Bu qovluqdakı kodlar)

Siz bu qovluqda yaradılan kodları nəzərdən keçirə bilərsiniz:

- **`users/users.module.ts`**: `exports: [UsersService]`
- **`orders/orders.module.ts`**: `imports: [UsersModule]`
- **`orders/orders.service.ts`**: `constructor(private usersService: UsersService)`

NestJS-in gücü məhz bu zənciri sizin yerinizə avtomatik həll etməsindədir! 🚀
