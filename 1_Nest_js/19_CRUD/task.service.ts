// 📄 task.service.ts - Biznes Məntiqi və In-Memory Data Saxlanılması
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TaskService {
  // 🧠 In-Memory Yaddaş: Verilənlər bazası yerinə massivdən (Array) istifadə edirik
  private tasks: Task[] = [
    {
      id: '1',
      title: 'NestJS Məşq Etmək',
      description: 'CRUD API məntiqini öyrənmək',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: '2',
      title: 'Kitab Oxumaq',
      description: 'Clean Code kitabından 2 fəsil oxumaq',
      status: TaskStatus.OPEN,
    },
  ];

  // 1. GET /tasks - Bütün tapşırıqları gətirir
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // 2. GET /tasks/:id - ID-yə görə tək bir tapşırıq tapır
  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    // Əgər tapılmasa, 404 Exception (Xəta) qaytarırıq
    if (!found) {
      throw new NotFoundException(`ID-si "${id}" olan tapşırıq tapılmadı!`);
    }

    return found;
  }

  // 3. POST /tasks - Yeni tapşırıq yaradır
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: Date.now().toString(), // Sadə unikal ID generasiyası
      title,
      description,
      status: TaskStatus.OPEN, // Yeni tapşırıq həmişə OPEN statusu ilə başlayır
    };

    this.tasks.push(task);
    return task;
  }

  // 4. PATCH /tasks/:id/status - Tapşırığın statusunu yeniləyir
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id); // Əvvəlcə tapşırığın varlığını yoxlayırıq
    task.status = status;
    return task;
  }

  // 5. DELETE /tasks/:id - Tapşırığı silir
  deleteTask(id: string): void {
    const found = this.getTaskById(id); // Yoxlayırıq ki, belə bir task var ya yox
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
