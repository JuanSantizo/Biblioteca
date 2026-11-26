import { VerifyDatabaseConnectionUseCase } from './application/use-cases/VerifyDatabaseConnectionUseCase.js';
import { environment } from './infrastructure/config/environment.js';
import { SqlServerConnection } from './infrastructure/database/SqlServerConnection.js';
import { logger } from './infrastructure/logging/logger.js';
import { SqlServerTestConnectionRepository } from './infrastructure/repositories/SqlServerTestConnectionRepository.js';
import { createApp } from './presentation/http/createApp.js';

const databaseConnection = new SqlServerConnection();
const repository = new SqlServerTestConnectionRepository(databaseConnection);
const verifyDatabaseConnection = new VerifyDatabaseConnectionUseCase(repository);
const app = createApp(verifyDatabaseConnection);

const server = app.listen(environment.port, () => {
  logger.info({ port: environment.port }, 'Library API started');
});

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Shutting down Library API');
  server.close(async () => {
    await databaseConnection.close();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
