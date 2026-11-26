import 'dotenv/config';

function requireValue(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function numberValue(name: string, fallback: number): number {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer.`);
  }
  return value;
}

function booleanValue(name: string, fallback: boolean): boolean {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;
  if (rawValue === 'true') return true;
  if (rawValue === 'false') return false;
  throw new Error(`Environment variable ${name} must be true or false.`);
}

export const environment = {
  port: numberValue('PORT', 3000),
  logLevel: process.env.LOG_LEVEL ?? 'info',
};

export function getDatabaseEnvironment() {
  return {
    server: requireValue('DB_SERVER'),
    port: numberValue('DB_PORT', 1433),
    database: requireValue('DB_DATABASE'),
    user: requireValue('DB_USER'),
    password: requireValue('DB_PASSWORD'),
    encrypt: booleanValue('DB_ENCRYPT', true),
    trustServerCertificate: booleanValue('DB_TRUST_SERVER_CERTIFICATE', false),
    connectionTimeout: numberValue('DB_CONNECTION_TIMEOUT_MS', 5000),
    requestTimeout: numberValue('DB_REQUEST_TIMEOUT_MS', 5000),
  };
}
