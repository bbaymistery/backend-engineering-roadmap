# 📝 NestJS CRUD APIs (In-Memory) — Task Module Canlı Kod Nümunəsi və Təlimat

Salam! Əziz tələbəm, NestJS öyrənmə yolunda ən vacib addımlardan birinə — **CRUD API-lərin yazılmasına** gəlib çatdıq! 🎓

Bu sənəddə bir backend tərtibatçısının hər gün yazdığı **CRUD (Create, Read, Update, Delete)** əməliyyatlarını **In-Memory (Massivdə saxlanılan)** verilənlər strukturunda canlı TypeScript kodları ilə addım-addım öyrənəcəksən.

---

## ❓ 1. Əsas Anlayışlar Nədir?

### 🅰️ CRUD Nədir?
**CRUD** — Məlumat bazası ilə işləyən bütün proqramların 4 təməl əməliyyatının qısaltmasıdır:
* **C - Create (Yaratmaq):** Yeni məlumat əlavə etmək (`POST` sorğusu).
* **R - Read (Oxumaq / Gətirmək):** Məlumatları siyahılamaq və ya tək-tək oxumaq (`GET` sorğusu).
* **U - Update (Yeniləmək):** Mövcud məlumatı dəyişmək (`PUT` və ya `PATCH` sorğusu).
* **D - Delete (Silmək):** Məlumatı silmək (`DELETE` sorğusu).

---

### 🅱️ In-Memory (Yaddaşda) Nə Deməkdir?
Hələ ki, PostgreSQL və ya MongoDB kimi xarici verilənlər bazası qoşmadığımız üçün məlumatları **Node.js-in operativ yaddaşında (RAM-da olan JS massivində)** saxlayırıq. 
* **Üstünlüyü:** Çox sürətlidir, DB qurmağa ehtiyac yoxdur, məntiqli öyrənmək üçün mükəmməldir.
* **Xüsusiyyəti:** Server `restart` olunanda massiv sıfırlanır (ilkin dataya qayıdır).

---

## 🏛️ 2. Arxitektura Axını (Request Flow)

Gəl şəkillərdə gördüyümüz 3 mərhələli zənciri xatırlayaq:

```
[ Gələn HTTP Request ] 
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 1. Controller (task.controller.ts)                    │
│    - URL-i qarşılayır (/tasks)                         │
│    - Parametr və Body-ni oxuyur (@Body, @Param)        │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 2. Service (task.service.ts)                           │
│    - Biznes məntiqini icra edir                       │
│    - Tapılmayanda xəta atır (NotFoundException)       │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 3. InMemory Model & Store (task.model.ts & tasks[])    │
│    - Məlumatların strukturunu (Interface/Enum) saxlayır│
│    - Massiv (Array) üzərində push, filter, find edir   │
└────────────────────────────────────────────────────────┘
```

---

## 📁 3. Qovluq və Fayl Strukturu

Biz bu modul üçün 5 əsas fayl hazırladıq:

```text
19_CRUD/
├── task.model.ts          # Task-ın İnterfeysi və Enum-ı (Model)
├── create-task.dto.ts     # DTO (Data Transfer Object)
├── task.service.ts        # Biznes Məntiqi və In-Memory Massiv (Service)
├── task.controller.ts     # REST API Endpoint-ləri (Controller)
├── task.module.ts         # Modul Qeydiyyatı (Module)
└── README.md              # Bu Tədris Sənədi
```

---

## 💻 4. Kodların Addım-Addım Ətraflı İzahı

---

### 1️⃣ `task.model.ts` — Model və Enum Tərifi

Əvvəlcə tapşırığın hansı sahələrə (fields) sahib olacağını və statuslarını müəyyən edirik:

```typescript
// 📄 task.model.ts

// Task-ın ala biləcəyi sabit statuslar (Enum)
export enum TaskStatus {
  OPEN = 'OPEN',           // Gözləmədə
  IN_PROGRESS = 'IN_PROGRESS', // İcra olunur
  DONE = 'DONE',           // Tamamlandı
}

// Tapşırığın məlumat strukturu (Interface)
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
```

---

### 2️⃣ `create-task.dto.ts` — DTO (Data Transfer Object)

Müştəri (Frontend) yeni tapşırıq yaradarkən bize göndərəcəyi datanın formasını müəyyən edirik. DTO-da `id` və ya `status` olmur, çünki onları backend özü təyin edəcək!

```typescript
// 📄 create-task.dto.ts
import { TaskStatus } from './task.model';

export class CreateTaskDto {
  title: string;
  description: string;
}

export class UpdateTaskStatusDto {
  status: TaskStatus;
}
```

---

### 3️⃣ `task.service.ts` — Biznes Məntiqi və Massivlə İş

Bütün daxili CRUD funksiyalarımız buradadır. `tasks` massivini özündə saxlayır:

```typescript
// 📄 task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TaskService {
  // 🧠 In-Memory Massiv (Verilənlər bazamız)
  private tasks: Task[] = [
    {
      id: '1',
      title: 'NestJS Məşq Etmək',
      description: 'CRUD API məntiqini öyrənmək',
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  // 📖 READ ALL: Bütün tapşırıqları almaq
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // 📖 READ ONE: ID-yə görə tapmaq
  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    // Əgər ID tapılmasa, NestJS avtomatik 404 Not Found xətası qaytaracaq!
    if (!found) {
      throw new NotFoundException(`ID-si "${id}" olan tapşırıq tapılmadı!`);
    }

    return found;
  }

  // ➕ CREATE: Yeni tapşırıq əlavə etmək
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: Date.now().toString(), // Unikal ID generasiyası
      title,
      description,
      status: TaskStatus.OPEN,   // İlkin status həmişə OPEN olur
    };

    this.tasks.push(task);
    return task;
  }

  // ✏️ UPDATE: Statusu yeniləmək
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id); // Əvvəlcə varlığını yoxlayırıq
    task.status = status;
    return task;
  }

  // ❌ DELETE: Tapşırığı silmək
  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
```

---

### 4️⃣ `task.controller.ts` — HTTP Endpoint-ləri

Controller gələn HTTP sorğularını müvafiq `TaskService` metodlarına yönləndirir:

```typescript
// 📄 task.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';

@Controller('tasks') // 📍 Bütün endpoint-lər '/tasks' ilə başlayacaq
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // 1️⃣ GET http://localhost:3000/tasks
  @Get()
  getAllTasks(): Task[] {
    return this.taskService.getAllTasks();
  }

  // 2️⃣ GET http://localhost:3000/tasks/1
  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  // 3️⃣ POST http://localhost:3000/tasks
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  // 4️⃣ PATCH http://localhost:3000/tasks/1/status
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.taskService.updateTaskStatus(id, status);
  }

  // 5️⃣ DELETE http://localhost:3000/tasks/1
  @Delete(':id')
  deleteTask(@Param('id') id: string): void {
    return this.taskService.deleteTask(id);
  }
}
```

---

### 5️⃣ `task.module.ts` — Modulun Qeydiyyatı

```typescript
// 📄 task.module.ts
import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
```

---

## 🧪 5. Postman / Client İlə Test Etmək

Yazdığımız API-ləri Postman və ya Thunder Client ilə test edərkən:

| Əməliyyat | HTTP Metodu | URL | Request Body (JSON) | Uğurlu HTTP Cavab Kodu |
| :--- | :--- | :--- | :--- | :--- |
| **Bütün Task-ları almaq** | `GET` | `http://localhost:3000/tasks` | *(Boş)* | `200 OK` |
| **Tək Task almaq** | `GET` | `http://localhost:3000/tasks/1` | *(Boş)* | `200 OK` |
| **Yeni Task yaratmaq** | `POST` | `http://localhost:3000/tasks` | `{"title": "Dərs oxu", "description": "NestJS"}` | `201 Created` |
| **Status dəyişmək** | `PATCH` | `http://localhost:3000/tasks/1/status` | `{"status": "DONE"}` | `200 OK` |
| **Task silmək** | `DELETE` | `http://localhost:3000/tasks/1` | *(Boş)* | `200 OK` |

---

## 🎯 Yekun Özet (Xülasə)

1. **Controller:** Yalnız HTTP sorğularını qəbul edir (`@Body()`, `@Param()`) və servisi çağırır. Məntiq yazmır!
2. **Service:** Bütün biznes məntiqini və məlumatlar üzərində əməliyyatları (find, push, filter) yerinə yetirir.
3. **DTO:** Gələn məlumatın hansı strukturda olduğunu təyin edir.
4. **NotFoundException:** Məlumat tapılmadıqda müştəriyə standart `404 Not Found` JSON xətası qaytarır.
