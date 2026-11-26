export class DatabaseUnavailableError extends Error {
  public constructor() {
    super('Database connectivity verification failed.');
    this.name = 'DatabaseUnavailableError';
  }
}
