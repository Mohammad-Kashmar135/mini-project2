import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createValidationPipe } from "./common/validation.pipe";
import { AllExceptionsFilter } from "./common/all-exceptions.filter";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: "http://localhost:5173",
  });

   app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

}
bootstrap();
