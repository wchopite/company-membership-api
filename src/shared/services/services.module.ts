import { Module } from '@nestjs/common';
import { IdGeneratorServiceToken } from './domain/id-generator.service';
import { UuidGeneratorService } from './infra/uuid-generator.service';

@Module({
  providers: [
    {
      provide: IdGeneratorServiceToken,
      useClass: UuidGeneratorService,
    },
  ],
  exports: [IdGeneratorServiceToken],
})
export class SharedServicesModule {}
