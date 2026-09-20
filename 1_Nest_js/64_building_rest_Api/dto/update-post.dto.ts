import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/**
 * PartialType(CreatePostDto) CreatePostDto-dakı bütün sahələri 
 * avtomatik olaraq @IsOptional() (seçimli) edir və Validation qaydalarını qoruyur.
 */
export class UpdatePostDto extends PartialType(CreatePostDto) { }
