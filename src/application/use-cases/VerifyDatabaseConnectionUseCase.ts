import type {
  TestConnectionRepository,
  TestConnectionResult,
} from '../ports/TestConnectionRepository.js';

export class VerifyDatabaseConnectionUseCase {
  public constructor(private readonly repository: TestConnectionRepository) {}

  public execute(): Promise<TestConnectionResult> {
    return this.repository.verifyConnection();
  }
}
