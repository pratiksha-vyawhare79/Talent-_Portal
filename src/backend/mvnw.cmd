@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM

@REM Required ENV vars:
@REM ------------------
@REM   JAVA_HOME - location of a JDK home dir
@REM   M2_HOME - location of maven2's installed home dir
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM       set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM   MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@SETLOCAL

@SET "MAVEN_PROJECTBASEDIR=%~dp0"
@IF "%MAVEN_PROJECTBASEDIR:~-1%"=="\" @SET "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"
@SET "WRAPPER_DIR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper"
@SET "WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar"
@SET "WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

@IF EXIST "%WRAPPER_DIR%\maven-wrapper.properties" goto run_maven

@ECHO ERROR: MAVEN_PROJECTBASEDIR set to "%MAVEN_PROJECTBASEDIR%" but no maven-wrapper.properties found in "%WRAPPER_DIR%"
goto end

:run_maven
@SET "MAVEN_CMD_LINE_ARGS=%*"
@SET "MAVEN_OPTS=-Xmx1024m"
@SET "JAVA_EXE="

@IF "%JAVA_HOME%"=="" (
  FOR %%I IN (java.exe) DO SET "JAVA_EXE=%%~$PATH:I"
  @IF "%JAVA_EXE%"=="" (
    FOR /D %%D IN ("C:\Program Files\Eclipse Adoptium\jdk-*") DO (
      IF EXIST "%%D\bin\java.exe" SET "JAVA_EXE=%%D\bin\java.exe"
    )
  )
) ELSE (
  @SET "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)

@IF NOT EXIST "%JAVA_EXE%" (
  @ECHO ERROR: Java not found. Install JDK 17+ and set JAVA_HOME or add java to PATH.
  goto end
)

@IF NOT EXIST "%WRAPPER_JAR%" (
  @ECHO Downloading Maven wrapper JAR...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
)

@IF NOT EXIST "%WRAPPER_JAR%" (
  @ECHO ERROR: Unable to download Maven wrapper JAR.
  goto end
)

@REM Start MAVEN
@"%JAVA_EXE%" %MAVEN_OPTS% ^
    -classpath "%WRAPPER_JAR%" ^
    "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
    org.apache.maven.wrapper.MavenWrapperMain %MAVEN_CMD_LINE_ARGS%

:end
@set ERROR_CODE=%ERRORLEVEL%
@exit /b %ERROR_CODE%
