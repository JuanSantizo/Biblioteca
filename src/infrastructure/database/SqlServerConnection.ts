import sql, { type ConnectionPool, type config as SqlConfig } from 'mssql';
import { getDatabaseEnvironment } from '../config/environment.js';

export class SqlServerConnection {
  private pool: ConnectionPool | undefined;

  public async getPool(): Promise<ConnectionPool> {
    if (this.pool?.connected) return this.pool;

    const database = getDatabaseEnvironment();

    const config: SqlConfig = {
      server: database.server,
      port: database.port,
      database: database.database,
      user: database.user,
      password: database.password,
      connectionTimeout: database.connectionTimeout,
      requestTimeout: database.requestTimeout,
      options: {
        encrypt: database.encrypt,
        trustServerCertificate: database.trustServerCertificate,
      },
    };

    this.pool = await new sql.ConnectionPool(config).connect();
    return this.pool;
  }

  public async close(): Promise<void> {
    if (this.pool) await this.pool.close();
  }
}
