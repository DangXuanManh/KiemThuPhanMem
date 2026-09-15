# PowerShell Script: Chạy Test Automation cho PetCare PRO
param(
    [string]$Browser = "chrome",
    [switch]$Headless
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\.."
$FrontendDir = "$ProjectRoot\frontend"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  PETCARE PRO - AUTOMATION TEST RUNNER (TestNG + Selenium)" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Kiểm tra Java & Thiết lập JAVA_HOME
Write-Host "`n[1/5] Kiem tra moi truong Java..." -ForegroundColor Yellow
$javaCmd = Get-Command java -ErrorAction SilentlyContinue
if ($null -ne $javaCmd) {
    Write-Host " -> Tim thay Java tai: $($javaCmd.Source)" -ForegroundColor Green
    & java -version 2>&1 | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host " [ERROR] Khong tim thay Java tren may! Vui long cai dat JDK 17+." -ForegroundColor Red
    exit 1
}

if (-not $env:JAVA_HOME -or -not (Test-Path "$env:JAVA_HOME\bin\javac.exe")) {
    $candidateJdks = @(
        "C:\Program Files\Java\jdk-17",
        "C:\Program Files\Java\jdk-21",
        "C:\Program Files\Java\jdk-11",
        "C:\Program Files\Eclipse Adoptium\jdk-17*",
        "C:\Program Files\Microsoft\jdk-17*"
    )
    foreach ($cand in $candidateJdks) {
        $found = Get-Item $cand -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found -and (Test-Path "$($found.FullName)\bin\javac.exe")) {
            $env:JAVA_HOME = $found.FullName
            Write-Host " -> Da tu dong thiet lap JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green
            break
        }
    }
}

# 2. Kiem tra / Tai Apache Maven tu dong neu chua co
Write-Host "`n[2/5] Kiem tra Apache Maven..." -ForegroundColor Yellow
$mvnCmd = "mvn"
$hasMvn = $false

try {
    $null = Get-Command mvn -ErrorAction Stop
    $hasMvn = $true
    Write-Host " -> Tim thay Maven san co trong he thong." -ForegroundColor Green
} catch {
    $hasMvn = $false
}

if (-not $hasMvn) {
    $toolsDir = "$ScriptDir\.tools"
    $localMvnDir = "$toolsDir\apache-maven-3.9.9"
    $mvnCmd = "$localMvnDir\bin\mvn.cmd"

    if (-not (Test-Path $mvnCmd)) {
        Write-Host " -> Dang tai ban Maven Portable (3.9.9) tu dong..." -ForegroundColor Yellow
        if (-not (Test-Path $toolsDir)) { New-Item -ItemType Directory -Path $toolsDir | Out-Null }
        
        $zipPath = "$toolsDir\maven.zip"
        $mavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
        
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri $mavenUrl -OutFile $zipPath -UseBasicParsing
            Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
            Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
            Write-Host " -> Tai va giai nen Maven thanh cong!" -ForegroundColor Green
        } catch {
            Write-Host " [ERROR] Khong the tai Maven tu dong: $_" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host " -> Su dung Maven Portable tai: $localMvnDir" -ForegroundColor Green
    }

    try {
        $fso = New-Object -ComObject Scripting.FileSystemObject
        $shortMvn = $fso.GetFolder($localMvnDir).ShortPath
        $env:MAVEN_HOME = $shortMvn
        $mvnCmd = "$shortMvn\bin\mvn.cmd"
    } catch {
        $env:MAVEN_HOME = $localMvnDir
    }

    $env:M2_HOME = $env:MAVEN_HOME
    $env:PATH = "$($env:MAVEN_HOME)\bin;$env:PATH"
}

# 3. Kiem tra Frontend Server (Vite)
Write-Host "`n[3/5] Kiem tra Web Server Frontend (http://localhost:3000)..." -ForegroundColor Yellow
$frontendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $frontendRunning = $true
        Write-Host " -> Frontend dang hoat dong san sang tren port 3000." -ForegroundColor Green
    }
} catch {
    $frontendRunning = $false
}

if (-not $frontendRunning) {
    if (-not (Test-Path "$FrontendDir\node_modules")) {
        Write-Host " -> Chua tim thay node_modules. Dang tu dong cai dat thu vien (npm install)..." -ForegroundColor Yellow
        Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$FrontendDir`" && npm install" -Wait
    }

    Write-Host " -> Dang khoi dong Frontend server o background..." -ForegroundColor Yellow
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$FrontendDir`" && npm run dev" -WindowStyle Minimized
    
    # Cho web server san sang
    $retries = 20
    while ($retries -gt 0) {
        Start-Sleep -Seconds 1
        try {
            $testReq = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 1 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($testReq.StatusCode -eq 200) {
                Write-Host " -> Frontend server da khoi dong thanh cong!" -ForegroundColor Green
                break
            }
        } catch {}
        $retries--
    }
}

# 4. Chay TestNG Suite
Write-Host "`n[4/5] Kich hoat bo kiem thu TestNG + Selenium 4..." -ForegroundColor Yellow
$headlessFlag = if ($Headless) { "true" } else { "false" }

$env:JAVA_TOOL_OPTIONS = "-Dfile.encoding=UTF-8"

$workingDir = $ScriptDir
try {
    $fso = New-Object -ComObject Scripting.FileSystemObject
    $workingDir = $fso.GetFolder($ScriptDir).ShortPath
} catch {}

Push-Location $workingDir
try {
    & $mvnCmd clean test "-Dbrowser=$Browser" "-Dheadless=$headlessFlag" "-Dfile.encoding=UTF-8"
} finally {
    Pop-Location
}

# 5. Mo bao cao ExtentReport HTML
Write-Host "`n[5/5] Tong hop va mo bao cao kiem thu HTML..." -ForegroundColor Yellow
$reportFile = "$ScriptDir\reports\PetCare_TestReport.html"
if (Test-Path $reportFile) {
    Write-Host " -> Mo bao cao ExtentReport tai: $reportFile" -ForegroundColor Green
    Start-Process $reportFile
} else {
    Write-Host " -> Chua tim thay file bao cao tai: $reportFile" -ForegroundColor Yellow
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  HOAN TAT KIEM THU TU DONG!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
