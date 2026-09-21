import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  /**
   * Xarici e-poçt xidmətini simulyasiya edən funksiya.
   */
  sendEmail(to: string, subject: string, body: string): boolean {
    console.log(`[EmailService] 📧 E-poçt göndərildi -> Kime: ${to} | Mövzu: ${subject}`);
    return true;
  }
}
