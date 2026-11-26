/*
  Creates the application database if it does not already exist.
  Run this script while connected to the SQL Server instance (for example, in master).
*/
USE [master];
GO

IF DB_ID(N'LibraryDb') IS NULL
BEGIN
    CREATE DATABASE [LibraryDb];
END;
GO
