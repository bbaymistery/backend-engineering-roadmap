/**
 * 🏢 Topic 60: NestJS + Winston Logger Configuration (Production-Ready File Transports)
 * 
 * 💡 Niyə Winston?
 * - Loqları müxtəlif yerlərə (Transports): Konsola, Fayllara (`app.log`, `error.log`),
 *   baza və ya uzaq serverə eyni anda yazmaq imkanı verir.
 * - Daily Rotate File ilə hər gün üçün ayrı `.log` faylı yarada bilir!
 */

/*
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonLoggerOptions = {
  transports: [
    // 1️⃣ Konsola çıxış (Dev mühit üçün rəngli):
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `[WINSTON] ${timestamp} [${level}] [${context || 'App'}]: ${message}`;
        }),
      ),
    }),

    // 2️⃣ Yalnız Xətaları fayla yazmaq (error.log):
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    // 3️⃣ Bütün loqları gündəlik fayllara yazmaq (combined-%DATE%.log):
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Köhnə loqları sıxışdırıb .zip edir
      maxSize: '20m',      // Fayl 20MB olanda yenisini açır
      maxFiles: '14d',     // 14 gündən köhnə loqları avtomatik silir
    }),
  ],
};
*/

export const winstonExplanation = {
  description: 'Winston multi-transport file and console logging configuration demo.',
};
