export interface TestConnectionResult {
  success: boolean;
  message: string;
  executedAtUtc: Date;
}

export interface TestConnectionRepository {
  verifyConnection(): Promise<TestConnectionResult>;
}
