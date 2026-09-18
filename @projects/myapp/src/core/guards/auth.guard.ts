import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Sadə nümayiş: Header-də 'x-api-key' yoxlanılır
    const apiKey = request.headers['x-api-key'];
    console.log('[AuthGuard] 🛡️  İcazə yoxlanılır. API Key:', apiKey ?? 'Qeyd olunmayıb');
    return true; // Nümayiş üçün icazə veririk
  }
}
