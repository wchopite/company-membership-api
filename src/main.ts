import { ApplicationBootstrap } from './shared/bootstrap/application.bootstrap';

async function bootstrap() {
  const app = new ApplicationBootstrap();
  await app.init();
}

bootstrap();
