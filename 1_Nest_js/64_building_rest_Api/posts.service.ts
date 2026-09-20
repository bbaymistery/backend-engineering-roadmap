import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  private posts: PostEntity[] = [
    {
      id: 1,
      title: 'NestJS REST API Qurulması',
      content: 'NestJS ilə istehsalat səviyyəli REST API necə yazılır?',
      tags: ['nestjs', 'backend', 'typescript'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'TypeORM və PostgreSQL inteqrasiyası',
      content: 'Verilənlər bazası ilə əlaqə qurmağın ən optimal yolları.',
      tags: ['database', 'typeorm'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll(search?: string): PostEntity[] {
    if (search) {
      const term = search.toLowerCase();
      return this.posts.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.content.toLowerCase().includes(term),
      );
    }
    return this.posts;
  }

  findOne(id: number): PostEntity {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundException(`${id} ID-li məqalə tapılmadı!`);
    }
    return post;
  }

  create(createPostDto: CreatePostDto): PostEntity {
    const newPost: PostEntity = {
      id: this.posts.length > 0 ? Math.max(...this.posts.map((p) => p.id)) + 1 : 1,
      ...createPostDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  update(id: number, updatePostDto: UpdatePostDto): PostEntity {
    const post = this.findOne(id); // Əgər tapılmasa avtomatik 404 atır
    const updatedPost = {
      ...post,
      ...updatePostDto,
      updatedAt: new Date(),
    };
    const index = this.posts.findIndex((p) => p.id === id);
    this.posts[index] = updatedPost;
    return updatedPost;
  }

  remove(id: number): void {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`${id} ID-li məqalə silinmək üçün tapılmadı!`);
    }
    this.posts.splice(index, 1);
  }
}
