import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * ============================================================================
 * 🎯 DEKORATOR: @CurrentUser()
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * Bu, NestJS-də fərdi parametr dekoratorudur (Custom Parameter Decorator).
 * Controller metodlarında (endpoint-lərdə) daxil olmuş aktiv istifadəçi
 * məlumatlarını (və ya onun müəyyən bir sahəsini, məsələn id, email)
 * birbaşa parametr kimi götürməyə imkan verir.
 * 
 * 💡 MƏSƏLƏN İSTİFADƏSİ:
 * Controller-də:
 * @Get('profile')
 * getProfile(@CurrentUser() user: UserEntity) { ... }
 * 
 * və ya sadəcə ID almaq üçün:
 * @Get('my-id')
 * getMyId(@CurrentUser('id') userId: string) { ... }
 */

export const CurrentUser = createParamDecorator(
  /**
   * @param data Dekoratora ötürülən opsional parametr (məs: 'id', 'email')
   * @param ctx NestJS ExecutionContext - sorğunun icra konteksti (HTTP request-ə giriş üçün)
   */
  (data: string | undefined, ctx: ExecutionContext) => {
    // 1. Sorğunun (Request) kontekstini HTTP rejiminə keçiririk və Express request obyektini alırıq
    const request = ctx.switchToHttp().getRequest();

    // 2. Auth Guard (JWT Guard) tərəfindən req.user hissəsinə yazılmış istifadəçi obyektini götürürük
    const user = request.user;

    // 3. Əgər dekoratora xüsusi sahə adı verilibsə (məs: 'id'), həmin sahəni qaytarırıq,
    // əks halda istifadəçi obyektinin özünü tam şəkildə qaytarırıq.
    return data ? user?.[data] : user;
  }
);

