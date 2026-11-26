import sql from 'mssql';
import { DatabaseUnavailableError } from '../../application/errors/DatabaseUnavailableError.js';
import type {
  TestConnectionRepository,
  TestConnectionResult,
} from '../../application/ports/TestConnectionRepository.js';
import { logger } from '../logging/logger.js';
import { SqlServerConnection } from '../database/SqlServerConnection.js';

interface StoredProcedureResult {
  success: boolean;
  message: string;
  executedAtUtc: Date;
}

export class SqlServerTestConnectionRepository implements TestConnectionRepository {
  public constructor(private readonly connection: SqlServerConnection) {}

  public async verifyConnection(): Promise<TestConnectionResult> {
    try {
      const pool = await this.connection.getPool();
      const result = await pool
        .request()
        .input('RequestSource', sql.NVarChar(100), 'library-api')
        .execute<StoredProcedureResult>('dbo.sp_Test_Conexion');

      const row = result.recordset[0];
      if (!row?.success || !row.message || !row.executedAtUtc) {
        throw new Error('Stored procedure returned an invalid result.');
      }

      return {
        success: true,
        message: row.message,
        executedAtUtc: new Date(row.executedAtUtc),
      };
    } catch (error) {
      logger.error({ err: error }, 'Database connectivity verification failed');
      throw new DatabaseUnavailableError();
    }
  }
}
