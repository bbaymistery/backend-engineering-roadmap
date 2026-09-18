import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter";
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";

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
        BlogModule,
        CommentModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },

    ],

})

export class AppModule { }