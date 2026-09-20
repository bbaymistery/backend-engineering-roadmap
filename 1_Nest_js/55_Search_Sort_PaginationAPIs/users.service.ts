import { Injectable } from '@nestjs/common';
import { PaginationQueryDto, SortOrder } from './dto/pagination.dto';
import { PaginatedResult } from './interfaces/paginated-response.interface';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  // 💡 Nümunə Verilənlər Bazası (Mock Data - Yalnız Öyrənmək və Test Etmək Üçün):
  private mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : 'User',
    createdAt: new Date(Date.now() - i * 86400000), // Hər biri 1 gün fərqlə
  }));

  /**
   * 🎓 1. ÖYRƏNƏ BİLMƏYİMİZ ÜÇÜN MOCK (SÜNİ YADDAŞ) KODU:
   * --------------------------------------------------------
   * ⚠️ QEYD: Bu metod yalnız kompyuterində bazaya qoşulmadan sistemi dərhal test etməyin
   * və məntiqi anlamağın üçün JavaScript massiv metodları (.filter, .sort, .slice) ilə yazılıb.
   */
  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = query;

    let filteredUsers = [...this.mockUsers];

    // 1️⃣ SEARCH (Axtarış Mexanizmi):
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower),
      );
    }

    // 2️⃣ SORT (Sıralama Mexanizmi):
    filteredUsers.sort((a, b) => {
      const valA = a[sortBy as keyof User];
      const valB = b[sortBy as keyof User];

      if (valA < valB) return sortOrder === SortOrder.ASC ? -1 : 1;
      if (valA > valB) return sortOrder === SortOrder.ASC ? 1 : -1;
      return 0;
    });

    // 3️⃣ PAGINATION (Səhifələmə Düsturu):
    // 💡 Düstur: skip = (page - 1) * limit
    const totalItems = filteredUsers.length;
    const skip = (page - 1) * limit;
    const paginatedData = filteredUsers.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalItems / limit);

    // 4️⃣ Standart Nəticə və Metadata Qaytarması:
    return {
      data: paginatedData,
      meta: {
        totalItems,
        itemCount: paginatedData.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  /**
   * 🏢 2. REAL PROYEKTLƏRDƏ (PRODUCTION-DA) İSTİFADƏ OLUNAN 100% HƏQİQİ BAZA KODU:
   * -----------------------------------------------------------------------------
   * 🚀 HƏQİQƏT: İŞ YERLƏRİNDƏ VƏ REAL LAYİHƏLƏRDƏ AŞAĞIDAKI TYPEORM / PRISMA KODU İSTİFADƏ OLUNUR!
   * Çünki 1,000,000 istifadəçini Node.js RAM-ına çəkmək olmaz. Axtarışı və Səhifələməni 
   * Verilənlər Bazası (PostgreSQL/MySQL) özü 1-2 millisaniyəyə edir.
   */
  /*
  async findAllProduction(query: PaginationQueryDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = query;
    
    // 💡 Düstur: skip = (page - 1) * limit
    const skip = (page - 1) * limit;

    // 🔥 Real TypeORM ilə Verilənlər Bazasında 1-2 millisaniyəyə axtarış və səhifələmə:
    const [data, totalItems] = await this.userRepository.findAndCount({
      where: search ? [
        { name: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) }
      ] : {},
      order: { [sortBy]: sortOrder },
      skip: skip,   // SQL: OFFSET 10
      take: limit,  // SQL: LIMIT 10
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
  */
}
