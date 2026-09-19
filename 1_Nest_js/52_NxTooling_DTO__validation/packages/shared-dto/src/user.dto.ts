export class CreateUserDto {
  name: string;
  email: string;
  role: string;
}

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
