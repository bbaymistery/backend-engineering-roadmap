import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyCustomLogger implements LoggerService {
  /**
   * 🟢 1. Standart İnformasiya Loqu (Log)
   */
  log(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.log(`[MY_APP] 🟢 LOG [${timestamp}] [${context || 'App'}]: ${message}`);
  }

  /**
   * 🔴 2. Kritik Xətalar (Error)
   */
  error(message: string, trace?: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.error(`[MY_APP] 🔴 ERROR [${timestamp}] [${context || 'App'}]: ${message}`);
    if (trace) {
      console.error(`[MY_APP] 📜 Stack Trace: ${trace}`);
    }
  }

  /**
   * 🟡 3. Xəbərdarlıqlar (Warn)
   */
  warn(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.warn(`[MY_APP] 🟡 WARN [${timestamp}] [${context || 'App'}]: ${message}`);
  }

  /**
   * 🔵 4. Debugging Loqları (Debug)
   */
  debug(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.debug(`[MY_APP] 🔵 DEBUG [${timestamp}] [${context || 'App'}]: ${message}`);
  }

  /**
   * 🟣 5. Ətraflı Məlumat Loqları (Verbose)
   */
  verbose(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.log(`[MY_APP] 🟣 VERBOSE [${timestamp}] [${context || 'App'}]: ${message}`);
  }
}
