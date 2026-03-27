@echo off
echo ==========================================
echo Codeverge Talent Portal - Backend Setup
echo ==========================================
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java from: https://www.oracle.com/java/technologies/downloads/
    echo.
    pause
    exit /b 1
)

echo ✓ Java is installed
echo.

REM Check if Maven is installed
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Maven not found in PATH
    echo Please install Maven from: https://maven.apache.org/download.cgi/
    echo.
    echo Trying to use Maven wrapper...
    if exist ".\mvnw.cmd" (
        echo ✓ Using Maven wrapper
        .\mvnw.cmd spring-boot:run
    ) else (
        echo ERROR: No Maven wrapper found
        echo Please install Maven first
        pause
        exit /b 1
    )
) else (
    echo ✓ Maven is installed
    echo.
    echo Starting Spring Boot application...
    echo The students table will be created automatically in codeverge_db
    echo.
    mvn spring-boot:run
)

echo.
pause
