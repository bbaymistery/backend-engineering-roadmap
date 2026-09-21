import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number) // URL-dən string gələn "1" dəyərini number (1)-ə çevirir
  @IsInt({ message: 'Page tam ədəd olmalıdır!' })
  @Min(1, { message: 'Page ən azı 1 olmalıdır!' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number) // URL-dən string gələn "10" dəyərini number (10)-a çevirir
  @IsInt({ message: 'Limit tam ədəd olmalıdır!' })
  @Min(1, { message: 'Limit ən azı 1 olmalıdır!' })
  @Max(100, { message: 'Bir səhifədə maksimum 100 element ola bilər!' })
  limit: number = 10;

  @IsOptional()
  @IsString({ message: 'Axtarış sözü mətni olmalıdır!' })
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrder, { message: 'SortOrder yalnız ASC və ya DESC ola bilər!' })
  sortOrder?: SortOrder = SortOrder.DESC;
}
