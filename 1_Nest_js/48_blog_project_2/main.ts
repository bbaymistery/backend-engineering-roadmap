import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";


async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    const logger = new Logger("Bootstrap");

    //Global Validation Pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));

    //Swagger Setup
    const config = new DocumentBuilder()
        .setTitle('Blog APi')
        .setDescription('Nest js Blog api All Fundamentals Demo')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Authentication')
        .addTag('Authors', 'Aythor management')
        .addTag('Blog', 'Blogs Post Management')
        .addTag('Comments', 'Comments CRUD Operations')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.log(`Application is running on: http://localhost:${PORT}`);
        // our swagger documentation url
        logger.log(`Swagger documentation url: http://localhost:${PORT}/api`);
    })

}

bootstrap();