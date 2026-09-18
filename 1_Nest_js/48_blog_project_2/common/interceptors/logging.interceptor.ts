import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * ============================================================================
 * ⏱️ PERFORMANS LOQLAMA İNTERCEPTOR-U: LoggingInterceptor
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * NestJS Interceptor (Yaxalayıcı) — sorğunun Controller metoduna daxil olmasından
 * cavabın verilməsinə qədər olan icra prosesinə müdaxilə etməyə imkan verir.
 * 
 * `LoggingInterceptor` hər bir endpoint-in icra olunma vaxtını (millisaniyə ilə)
 * və hansı Controller/Metodun çağırıldığını ölçür və konsola performans loqu yazır.
 * 
 * 💡 NECƏ İŞLƏYİR?
 * 1. Sorğu gələndə cari vaxtı (`Date.now()`) qeyd edir.
 * 2. `next.handle()` vasitəsilə Controller metodunun işləməsinə icazə verir.
 * 3. RxJS-in `tap` operatoru vasitəsilə metod işini bitirib cavab qaytardıqda aradakı fərqi
 *    (məsələn: 45ms) hesablayır və loqlayır.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Konsola loq yazmaq üçün "Performance" kateqoriyalı Logger
  private readonly logger = new Logger("Performance");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. Sorğu məlumatlarını alırıq (HTTP metodu: GET/POST, URL)
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // 2. Sorğunun başladığı cari vaxt (timestamp)
    const now = Date.now();

    // 3. Çağırılan Controller sinfinin və metodun adını alırıq (Məs: PostsController.findAll)
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    // 4. Controller icra olunur və nəticə qaytarılanda `tap` işə düşür
    return next.handle().pipe(
      tap(() => {
        // İcra müddətini hesablayırıq: Son vaxt - Başlanğıc vaxtı
        const duration = Date.now() - now;

        // Loqa yazırıq: Məsələn "PostsController.findAll | GET /posts - 15ms"
        this.logger.log(
          `${className}.${handlerName} | ${method} ${url} - ${duration}ms`
        );
      })
    );
  }
}

