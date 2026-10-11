import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createValidationPipe } from "./common/validation.pipe";
import { AllExceptionsFilter } from "./common/all-exceptions.filter";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  });

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`API is running at http://localhost:${port}/api`);
}

void bootstrap();
