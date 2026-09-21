# ⚙️ NestJS Under the Hood — NestJS-in Arxa Fon Mexanizmi (Hərtərəfli Tədris Təlimatı)

Salam! NestJS öyrənmə yolunda irəliləyən gənc proqramçı, xoş gəldin! 

Bir çox proqramçı NestJS-i istifadə edir, lakin onun arxa fonda **necə işə düşdüyünü (Bootstrap)**, **sorğuların necə hərəkət etdiyini (Request Lifecycle)** və **Decorator-ların arxasında nə dayandığını** bilmir. Bu sənəddə **heç bir şəkil olmadan**, sırf aydın izahlar, canlı həyat analogiyaları, sxemlər və TypeScript kodları ilə NestJS-in daxili iş prinsipini sıfırdan öyrənəcəksən.

---

## 🎯 1. Nələri Öyrənəcəyik? (General Overview)

NestJS-in kapotunun altına (Under the Hood) baxdıqda 4 əsas sütun görürük:

1. **Application Bootstrap Process:** `NestFactory.create()` çağırılanda proqram addım-addım necə işə düşür?
2. **Request Lifecycle Flow:** Bir HTTP sorğusu (request) gələndə mərhələli şəkildə hansı süzgəclərdən keçir?
3. **Metadata Reflection System:** `@Controller()`, `@Get()`, `@Injectable()` kimi decorator-lar arxa fonda məlumatı necə yadda saxlayır və oxuyur?
4. **Lifecycle Hooks:** Proqram işə düşəndə və ya bağlananda servislər necə xəbərdar olur?

---

## 🚀 2. Topic 5.1: Application Bootstrap Process (Proqramın İşə Düşmə Axını)

### 💡 Sadə Dildə Analogiya:
Təsəvvür et ki, yeni bir **Zavod (`NestFactory`)** açırsan:
1. Əvvəlcə anbar və idarəetmə mərkəzini tikirsən (**`NestContainer`**).
2. Sonra bütün sexləri və işçiləri skan edib siyahıya alırsan (**`DependenciesScanner`**).
3. İşçilərə alətlərini paylayıb işə başlayırsan (**`InstanceLoader`**).
4. Zavodun qapılarını müştərilər üçün açırsan (**`RoutesResolver`**).
5. Zavod tam hazır olur və konveyer işə düşür (**`Application Ready`**).

---

### ⚙️ NestJS proqramı başlatdıqda arxada baş verən 5 Əsas Addım:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. NestFactory.create(AppModule)                                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. NestContainer (Bütün modul və provayderlərin saxlanacağı DI konteyner)│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. DependenciesScanner (Modulları skan edir, asılılıq ağacını qurur)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. InstanceLoader (Servisləri düzgün sırayla 'new' edib inject edir)  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. RoutesResolver & Ready (Route-ları Express-ə bağlayır, portu dinləyir)│
└────────────────────────────────────────────────────────────────────────┘
```

#### Addım-Addım İzahı:

1. **`NestContainer` (DI Konteyneri):** NestJS daxili konteyner yaradır. Bütün modullar, servislər və controller-lər bu konteynerdə saxlanılacaq.
2. **`DependenciesScanner`:** `AppModule`-dan başlayaraq bütün bərkidilmiş modulları rekursiv skan edir. Decorator-lardan metadataları toplayır və hansı servisin hansına möhtac olduğunu xəritələndirir (Dependency Graph).
3. **`InstanceLoader`:** Servisləri **Topoloji Sıralama (Topological Sort)** alqoritmi ilə düzgün sırayla `new` edir. Məsələn: Əgər `UserService` `UserRepository`-dən asılıdırsa, əvvəlcə `UserRepository`-ni yaradır, sonra `UserService`-ə yerləşdirir. Çarpaz asılılıqları (circular dependency) həll edir.
4. **`RoutesResolver`:** `@Controller()` və `@Get()`, `@Post()` bəzədicilərini oxuyur, `/users`, `/orders` kimi URL-ləri daxili HTTP serverə (Express və ya Fastify) qeydiyyatdan keçirir.
5. **`Application Ready`:** `OnModuleInit` və `OnApplicationBootstrap` hook-larını işə salır və verilən portda (məsələn: `app.listen(3000)`) sorğuları dinləməyə başlayır.

---

## 🔄 3. Topic 5.2: Request Lifecycle Flow (Sorğunun Ömür Dövrü)

Müştəri (Browser, Postman və ya Mobil tətbiq) NestJS serverinə bir HTTP Request göndərəndə sorğu controller-ə çatana qədər və cavab geriyə qayıdana qədər **dəqiq müəyyən olunmuş sıradan** keçir.

### 📊 Sorğunun Keçid Xəritəsi:

```
[ HTTP Request Daxil Olur ]
            │
            ▼
┌───────────────────────┐
│ 1. Middleware         │  ──► Request/Response-u modifikasiya edir, next() çağırır
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 2. Guards             │  ──► İcazəni yoxlayır (AuthGuard -> true/false). False olsa 403 verir
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 3. Interceptors (Pre) │  ──► Controller-dən ƏVVƏL çalışan məntiq (məs: taymer başlatmaq)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 4. Pipes              │  ──► Gələn datanı doğrulayır/çevirir (DTO Validation, ParseIntPipe)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 5. Controller Handler │  ──► Əsas biznes məntiqi işləyir və məlumatı qaytarır
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 6. Interceptors (Post)│  ──► Controller-dən SONRA çalışan məntiq (məs: cavabı formatlamaq)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 7. Exception Filters  │  ──► Baş verən xətaları tutub gözəl JSON cavabına çevirir
└───────────┬───────────┘
            │
            ▼
[ HTTP Response Çıxır ]
```

### 🧠 Yadda saxlamaq üçün qızıl qayda:
* **Middleware:** Ən daxil olan ilk divardır (Express middleware kimi).
* **Guard:** Təhlükəsizlik qapısıdır (Lisenziya/Token yoxlayır).
* **Interceptor (Pre):** Nəzarətçidir, sorğudan əvvəl taymer açır.
* **Pipe:** Təmizləyici və doğrulayıcıdır (Gələn JSON-un düzgünlüyünü yoxlayır).
* **Controller:** İşin mərkəzidir (Biznes məntiqi).
* **Interceptor (Post):** Nəzarətçidir, cavabı dəyişir/formatlayır və taymeri dayandırır.
* **Exception Filter:** Xəta tutan tor-dur.

---

## 🏷️ 4. Topic 5.3: Metadata Reflection System (Decorator-lar Necə İşləyir?)

NestJS-də yazdığımız `@Controller('/users')` və ya `@Get('/profile')` bəzədiciləri arxa fonda necə çalışır? 

JavaScript özlüyündə decorator konseptini birbaşa tanımır. NestJS **TypeScript və `reflect-metadata` kitabxanasından** istifadə edərək bu möcüzəni edir.

---

### 1️⃣ Decorator-lar Metadatanı Necə Yazır?

Decorator əslində bir funksiyadır və obyektə (klasa və ya metoda) **gizli teq (metadata)** yapışdırır:

```typescript
import 'reflect-metadata';

// @Controller('/users') bəzədicisinin daxili iş prinsipi:
function CustomController(prefix: string): ClassDecorator {
  return (target: Function) => {
    // Klasın üzərinə 'path' və 'isController' metadatasını yazırıq
    Reflect.defineMetadata('path', prefix, target);
    Reflect.defineMetadata('isController', true, target);
  };
}

// @Get('/profile') bəzədicisinin daxili iş prinsipi:
function CustomGet(path: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    // Metodun üzərinə 'path' və 'method' metadatasını yazırıq
    Reflect.defineMetadata('path', path, target, propertyKey);
    Reflect.defineMetadata('method', 'GET', target, propertyKey);
  };
}
```

---

### 2️⃣ TypeScript-in Avtomatik Metadata Yaratması (`design:paramtypes`)

`tsconfig.json` faylında `"emitDecoratorMetadata": true` olduqda TypeScript avtomatik olaraq konstruktor parametrlərinin tiplərini yadda saxlayır:

```typescript
@Injectable()
class UserService {
  constructor(repo: UserRepository) {}
}

// TypeScript kodu kompiyasiya edərkən arxada gizlicə bu kodu generasiya edir:
// Reflect.defineMetadata('design:paramtypes', [UserRepository], UserService);
```

---

### 3️⃣ NestJS Metadatanı Necə Oxuyur? (`RouteExplorer`)

NestJS işə düşəndə `RouteExplorer` klası vasitəsilə bütün controller-ləri gəzir və vurulmuş teqləri (metadataları) oxuyur:

```typescript
class RouteExplorer {
  explore(controllerClass: any) {
    // 1. Controller-in üzərindəki 'path' metadatasını oxuyur (məs: '/users')
    const controllerPath = Reflect.getMetadata('path', controllerClass);
    const prototype = controllerClass.prototype;
    const methodNames = Object.getOwnPropertyNames(prototype);

    // 2. Controller daxilindəki metodları (GET, POST və s.) skan edir
    return methodNames.map((methodName) => {
      const path = Reflect.getMetadata('path', prototype, methodName);
      const httpMethod = Reflect.getMetadata('method', prototype, methodName);

      return {
        fullPath: `${controllerPath}/${path}`, // Məsələn: '/users/profile'
        method: httpMethod,                   // Məsələn: 'GET'
        handler: prototype[methodName],
      };
    });
  }
}
```

---

## 📦 5. Topic 5.4: DI Container Internals (Konteynerin İç Mexanizmi)

Gəl NestJS-in DI Konteynerinin daxildə necə işlədiyini göstərən sadələşdirilmiş TypeScript koduna baxaq:

```typescript
import 'reflect-metadata';

class Container {
  private providers = new Map<any, any>();
  private instances = new Map<any, any>();

  // Provayderi qeydiyyata alırıq
  register(token: any, provider: any) {
    this.providers.set(token, provider);
  }

  // Asılılıqları tapıb obyekti yaradırıq (Resolve)
  resolve<T>(token: any): T {
    // 1. Əgər obyekt artıq yaradılıbsa (Singleton), yaddaşdan (keşdən) qaytar
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`Provayder tapılmadı: ${token.name}`);
    }

    // 2. Reflect vasitəsilə konstruktor parametrlərini oxu
    const deps = Reflect.getMetadata('design:paramtypes', provider.useClass) || [];

    // 3. Rekursiv olaraq hər bir asılılığı resolve et
    const resolvedDeps = deps.map((dep: any) => this.resolve(dep));

    // 4. Obyekti həll olunmuş asılılıqlarla yarat (new)
    const instance = new provider.useClass(...resolvedDeps);

    // 5. Singleton Keşə yaz
    this.instances.set(token, instance);

    return instance;
  }
}
```

---

## ⏳ 6. Topic 5.5: Lifecycle Hooks (Ömür Dövrü Hadisələri)

NestJS-də servislər proqramın açılıb-bağlanma mərhələlərini izləyə bilər. Buna **Lifecycle Hooks** deyilir.

```typescript
import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnApplicationShutdown,
} from '@nestjs/common';

@Injectable()
export class DatabaseService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    OnApplicationShutdown
{
  // 1. Modulun bütün provayderləri yaradıldıqdan dərhal sonra çağırılır
  async onModuleInit() {
    console.log('📦 1. Modul init olundu');
  }

  // 2. Bütün modullar hazır olduqda və proqram işə düşməyə hazır olduqda çağırılır
  async onApplicationBootstrap() {
    console.log('🚀 2. Proqram hazırdır! Verilənlər bazasına qoşuluruq...');
    await this.connectToDatabase();
  }

  // 3. Modul silinməyə başlayanda çağırılır
  async onModuleDestroy() {
    console.log('⚠️ 3. Modul təmizlənir...');
  }

  // 4. Proqram dayandırıldıqda (SIGTERM, SIGINT və s.) çağırılır
  async onApplicationShutdown(signal?: string) {
    console.log(`🛑 4. Proqram bağlandı (${signal}). DB bağlantısı təhlükəsiz kəsilir...`);
    await this.disconnectFromDatabase();
  }

  private async connectToDatabase() {}
  private async disconnectFromDatabase() {}
}
```

> 💡 **Çox Vacib Qeyd:** `onApplicationShutdown` hook-unun işləməsi üçün `main.ts`-də mütləq bu sətri aktiv etməlisən:
> ```typescript
> async function bootstrap() {
>   const app = await NestFactory.create(AppModule);
>   
>   // 🔔 Shutdown hook-larını aktiv edirik:
>   app.enableShutdownHooks();
> 
>   await app.listen(3000);
> }
> bootstrap();
> ```

---

## 🎯 Yekun Xülasə (Özət)

| Anlayış | Nədir və Nə İşə Yarayır? |
| :--- | :--- |
| **Bootstrap Process** | `NestFactory.create()` proqramı başladanda konteyner yaradır, modulları skan edir, servisləri sırayla `new` edir və portu dinləyir. |
| **Request Lifecycle** | Sorğu gələndə sırasıyla: `Middleware -> Guard -> Interceptor (Pre) -> Pipe -> Controller -> Interceptor (Post) -> Exception Filter` keçir. |
| **Metadata Reflection** | Decorator-lar metadata yazır (`Reflect.defineMetadata`), NestJS isə jeq və parametrləri oxuyur (`Reflect.getMetadata`). |
| **DI Container Internals** | Konteyner servisləri map-də saxlayır, `design:paramtypes` ilə konstruktoru oxuyub rekursiv instansiyalar yaradır və keşləyir. |
| **Lifecycle Hooks** | `OnModuleInit`, `OnApplicationBootstrap`, `OnApplicationShutdown` sayəsində DB qoşulması və təhlükəsiz kəsilməsi idarə olunur. |
