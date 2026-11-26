# Library API — Technical Foundation

Minimal REST API foundation using Node.js, TypeScript, Express and Microsoft SQL Server, organized with Clean Architecture. This increment deliberately contains no library business modules.

## Architecture

```text
src/
├── domain/                 # Framework- and database-independent business layer
├── application/            # Use cases and repository contracts
├── infrastructure/         # SQL Server, logging and environment adapters
└── presentation/http/      # Express routes and HTTP error translation
```

The dependency direction is `presentation -> application -> domain`; infrastructure implements application contracts and is composed in `src/main.ts`.

## Requirements

- Node.js 20 or newer.
- Access to Microsoft SQL Server.
- A least-privilege SQL Server account with permission to execute `dbo.sp_Test_Conexion` only.

## Installation and configuration

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and set the SQL Server values. Do not commit `.env`.
3. In the selected database, execute `database/sp_Test_Conexion.sql` using an authorized database tool.
4. Grant the application account only execution permission for the procedure, for example: `GRANT EXECUTE ON dbo.sp_Test_Conexion TO [library_api];` Adjust the principal name to your SQL Server configuration.

## Run

- Development: `npm run dev`
- Compile: `npm run build`
- Run compiled application: `npm start`
- Type-check: `npm run check`

## Endpoints

### `GET /api/v1/test`

Confirms that Express is running.

Successful response (`200`):

```json
{ "success": true, "message": "Library API is running." }
```

### `GET /api/v1/test-db`

Confirms real SQL Server connectivity by invoking `dbo.sp_Test_Conexion` with the typed parameter `@RequestSource NVARCHAR(100)`. It does not execute direct SQL queries.

Successful response (`200`):

```json
{
  "success": true,
  "message": "SQL Server connectivity verified through a stored procedure.",
  "executedAtUtc": "2026-01-01T00:00:00.000Z"
}
```

If SQL Server is unavailable, the procedure is missing, or its result is invalid, the API returns `503` with a generic response and logs the technical error without sending connection details or SQL Server internals to the client.

## Database access standard

The only data-access call in this foundation is `request.input(...).execute('dbo.sp_Test_Conexion')`. Parameters are typed and bound by the SQL Server driver. No controllers, application services, or domain code execute SQL; no SQL is built from strings.

## SQL script inventory

| Procedure | Parameters | Purpose |
|---|---|---|
| `dbo.sp_Test_Conexion` | `@RequestSource NVARCHAR(100)` | Verifies connectivity and parameterized stored-procedure execution. |
