import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { DatabaseUnavailableError } from '../../application/errors/DatabaseUnavailableError.js';
import { VerifyDatabaseConnectionUseCase } from '../../application/use-cases/VerifyDatabaseConnectionUseCase.js';

export function createApp(verifyDatabaseConnection: VerifyDatabaseConnectionUseCase): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  app.get('/api/v1/test', (_request, response) => {
    response.status(200).json({ success: true, message: 'Library API is running.' });
  });

  app.get('/api/v1/test-db', async (_request, response, next) => {
    try {
      const result = await verifyDatabaseConnection.execute();
      response.status(200).json({
        success: result.success,
        message: result.message,
        executedAtUtc: result.executedAtUtc.toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((_request, response) => {
    response.status(404).json({ success: false, message: 'Resource not found.' });
  });

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof DatabaseUnavailableError) {
      response.status(503).json({
        success: false,
        message: 'Database service is currently unavailable.',
      });
      return;
    }

    response.status(500).json({ success: false, message: 'Internal server error.' });
  });

  return app;
}
