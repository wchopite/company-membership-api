export const IdGeneratorServiceToken = Symbol('IdGeneratorService');

export interface IdGeneratorService {
  generate(): string;
}
