/*
  Minimal connectivity procedure for the technical foundation.
  The API executes it with a typed @RequestSource parameter.
*/
CREATE OR ALTER PROCEDURE dbo.sp_Test_Conexion
  @RequestSource NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    CAST(1 AS bit) AS success,
    N'SQL Server connectivity verified through a stored procedure.' AS message,
    @RequestSource AS requestSource,
    SYSUTCDATETIME() AS executedAtUtc;
END;
GO
