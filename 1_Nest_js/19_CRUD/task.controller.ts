// 📄 task.controller.ts - HTTP Endpoint-lərinin Qarşılanması
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

@Controller('tasks') // 📍 Bütün bu marşrutlar (routes) '/tasks' ilə başlayacaq
export class TaskController {
  // Dependency Injection vasitəsilə TaskService-i inject edirik
  constructor(private readonly taskService: TaskService) {}

  // 1. GET /tasks - Bütün tapşırıqları almaq
  @Get()
  getAllTasks(): Task[] {
    return this.taskService.getAllTasks();
  }

  // 2. GET /tasks/:id - ID-yə görə tək bir tapşırıq almaq
  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  // 3. POST /tasks - Yeni tapşırıq yaratmaq
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  // 4. PATCH /tasks/:id/status - Statusu yeniləmək
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.taskService.updateTaskStatus(id, status);
  }

  // 5. DELETE /tasks/:id - Tapşırığı silmək
  @Delete(':id')
  deleteTask(@Param('id') id: string): void {
    return this.taskService.deleteTask(id);
  }
}
