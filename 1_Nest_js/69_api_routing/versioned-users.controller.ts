import {
  Controller,
  Get,
  Version,
  Param,
  VERSION_NEUTRAL,
} from '@nestjs/common';

/**
 * 1️⃣ Basic Controller Route (@Controller('users'))
 */
@Controller('users')
export class UsersV1Controller {
  /**
   * 2️⃣ API Versioning: Version 1 (GET /v1/users)
   */
  @Version('1')
  @Get()
  getUsersV1() {
    return {
      version: 'v1.0',
      data: [{ id: 1, name: 'Əli Həsənov' }],
    };
  }

  /**
   * 3️⃣ API Versioning: Version 2 (GET /v2/users) - Təkmilləşdirilmiş cavab
   */
  @Version('2')
  @Get()
  getUsersV2() {
    return {
      version: 'v2.0',
      metadata: { total: 1, page: 1 },
      data: [{ id: 1, fullName: 'Əli Həsənov', status: 'ACTIVE' }],
    };
  }

  /**
   * 4️⃣ VERSION_NEUTRAL (Bütün API versiyaları üçün keçərlidir)
   * Nümunə: GET /users/ping (həm /v1/users/ping, həm /v2/users/ping işləyir)
   */
  @Version(VERSION_NEUTRAL)
  @Get('ping')
  pingServer() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  /**
   * 5️⃣ Wildcard Routes (Joker Marşrutlar: ab*cd)
   * Nümunə: GET /users/ab123cd, GET /users/abcd
   */
  @Get('ab*cd')
  getWildcardRoute() {
    return {
      message: 'Wildcard marşrut uyğun gəldi (ab*cd)!',
    };
  }
}

/**
 * 6️⃣ Sub-Domain Routing (Subdomen üzrə routinq)
 * Nümunə: admin.domain.com/dashboard
 */
@Controller({ host: 'admin.domain.com', path: 'dashboard' })
export class AdminDashboardController {
  @Get()
  getAdminStats() {
    return {
      role: 'ADMIN',
      systemHealth: '100%',
    };
  }
}
