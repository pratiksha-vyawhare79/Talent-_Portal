@echo off
echo Starting Codeverge Backend Server...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java and add it to your system PATH
    echo Download from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

echo Java found. Starting Spring Boot application...
echo.

REM Try to run with Maven first
where mvn >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Maven...
    mvn spring-boot:run
    goto end
)

REM If Maven not found, try Maven wrapper
echo Maven not found, trying Maven wrapper...
if exist ".\mvnw.cmd" (
    .\mvnw.cmd spring-boot:run
    goto end
)

echo ERROR: Neither Maven nor Maven wrapper found
echo Please install Maven from: https://maven.apache.org/download.cgi
pause

:end
pause
