import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter";
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";

@Module({
    imports: [
        //isGlobal defines  -> globablly available 
        //Foor root means it will look .env file and it wool put that in process.env 
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    providers: [],

})

export class AppModule { }