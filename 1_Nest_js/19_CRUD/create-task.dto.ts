// 📄 dto/create-task.dto.ts - Yeni Tapşırıq yaratmaq üçün DTO
import { TaskStatus } from '../task.model';

export class CreateTaskDto {
  title: string;
  description: string;
}

export class UpdateTaskStatusDto {
  status: TaskStatus;
}
