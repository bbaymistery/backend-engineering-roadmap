import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
  ParseBoolPipe,
  ParseArrayPipe,
  ParseUUIDPipe,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Controller('pipes-demo')
export class PipesDemoController {
  // 1. ParseIntPipe - ID-ni tam ədədə çevirir
  @Get('user/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return { userId: id, type: typeof id };
  }

  // 2. ParseUUIDPipe - UUID formatını yoxlayır
  @Get('uuid/:id')
  getByUuid(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return { validUuid: id };
  }

  // 3. ParseEnumPipe - Enum dəyərini yoxlayır
  @Get('role/:role')
  getByRole(@Param('role', new ParseEnumPipe(UserRole)) role: UserRole) {
    return { userRole: role };
  }

  // 4. DefaultValuePipe + ParseIntPipe + ParseBoolPipe (Pagination & Search)
  @Get('search')
  searchUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('isActive', new DefaultValuePipe(true), ParseBoolPipe) isActive: boolean,
    @Query('minRating', new DefaultValuePipe(0.0), ParseFloatPipe) minRating: number,
  ) {
    return { page, limit, isActive, minRating };
  }

  // 5. ParseArrayPipe - Vergüllə ayrılmış rəqəmləri massivə çevirir (Məsələn: ?ids=1,2,3)
  @Get('batch')
  getBatchUsers(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[],
  ) {
    return { userIds: ids, isArray: Array.isArray(ids) };
  }
}
