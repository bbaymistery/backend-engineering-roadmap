import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";


@Module({
    imports: [
        //isGlobal defines  -> globablly available 
        //Foor root means it will look .env file and it wool put that in process.env 
        ConfigModule.forRoot({ isGlobal: true }),
        //EventEmitterModule -> to send data from one module to another module
        EventEmitterModule.forRoot(),

        //modules
        AuthModule,
        AuthorModule,

    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule { }
