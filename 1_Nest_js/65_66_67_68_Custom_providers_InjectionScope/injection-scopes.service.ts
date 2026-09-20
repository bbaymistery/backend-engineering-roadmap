import { Injectable, Scope } from '@nestjs/common';

/**
 * 1️⃣ Scope.DEFAULT (Singleton Scope - Susmaya Göre)
 * 
 * Tətbiq işə düşərkən yalnız 1 dəfə yaradılır və bütün sorğular tərəfindən istifadə olunur.
 * Yüksək performanslıdır, RAM-ı yormur.
 */
@Injectable({ scope: Scope.DEFAULT })
export class SingletonService {
  private instanceId = Math.floor(Math.random() * 100000);

  getInstanceId(): number {
    return this.instanceId;
  }
}

/**
 * 2️⃣ Scope.REQUEST (Request Scope - Hər Sorğuya Özəl)
 * 
 * Hər gələn HTTP sorğusunda (Request) YENİ instansiya yaradılır və sorğu bitdikdə silinir (Garbage Collected).
 * 
 * ⚠️ DİQQƏT: Performance Impact (Performans Təsiri)!
 * Əgər bir Controller və ya Service Request-Scoped provider inject edərsə,
 * həmin Controller/Service də avtomatik Request-Scoped olur!
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  private instanceId = Math.floor(Math.random() * 100000);
  private createdAt = new Date().toISOString();

  getInstanceId(): number {
    return this.instanceId;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }
}

/**
 * 3️⃣ Scope.TRANSIENT (Transient Scope - Hər İnjection-da Özəl)
 * 
 * Bu provider harada inject olunursa-olunsun, HƏR DƏFƏ TAM YENİ İNSTANSIYA yaradılır.
 * İki ayrı Service bu provider-i inject edərsə, onların hərəsinə fərqli instansiya düşür.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  private instanceId = Math.floor(Math.random() * 100000);

  getInstanceId(): number {
    return this.instanceId;
  }
}
