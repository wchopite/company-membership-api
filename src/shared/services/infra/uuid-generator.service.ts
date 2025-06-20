import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

import { IdGeneratorService } from '../domain/id-generator.service';

@Injectable()
export class UuidGeneratorService implements IdGeneratorService {
  generate(): string {
    return crypto.randomUUID();
  }
}
