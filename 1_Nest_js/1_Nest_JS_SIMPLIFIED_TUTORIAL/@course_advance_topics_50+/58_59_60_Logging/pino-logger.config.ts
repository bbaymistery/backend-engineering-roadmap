/**
 * ⚡ Topic 59: NestJS + Pino Logger Configuration (High Performance JSON Logger)
 * 
 * 💡 Niyə Pino?
 * - Node.js dünyasında ən SÜRƏTLİ VƏ MİNİMAL (Zero-Overhead) loggerdir.
 * - Loqları JSON formatında çıxardığı üçün Datadog, ElasticSearch (ELK), Grafana Loki kimi
 *   Cloud sistemlər tərəfindən dərhal oxunub analiz edilə bilir.
 */

export const pinoLoggerOptions = {
  pinoHttp: {
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
        : undefined, // Production-da yüksək sürət üçün rəngsiz pure JSON istifadə olunur
    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    autoLogging: true, // Hər gələn HTTP sorğusunu (Request/Response time) avtomatik log edir
    serializers: {
      req: (req: any) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
    },
  },
};
