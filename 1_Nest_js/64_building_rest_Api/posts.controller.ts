import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 1️⃣ ALL POSTS & SEARCH (GET /posts?search=nest)
   */
  @Get()
  findAll(@Query('search') search?: string) {
    return {
      success: true,
      data: this.postsService.findAll(search),
    };
  }

  /**
   * 2️⃣ GET SINGLE POST BY ID (GET /posts/1)
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      data: this.postsService.findOne(id),
    };
  }

  /**
   * 3️⃣ CREATE NEW POST (POST /posts)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto) {
    return {
      success: true,
      message: 'Məqalə uğurla yaradıldı!',
      data: this.postsService.create(createPostDto),
    };
  }

  /**
   * 4️⃣ UPDATE POST PARTIALLY (PATCH /posts/1)
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return {
      success: true,
      message: 'Məqalə yeniləndi!',
      data: this.postsService.update(id, updatePostDto),
    };
  }

  /**
   * 5️⃣ DELETE POST (DELETE /posts/1)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.postsService.remove(id);
    return;
  }
}
