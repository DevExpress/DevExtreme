@echo off
netsh interface portproxy delete v4tov4 listenport=9223 listenaddress=0.0.0.0
start /b cmd /c call "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9223 --user-data-dir=c:\my\data --disk-cache-dir=null --overscroll-history-navigation=0 --disable-web-security -–allow-file-access-from-files "http://localhost:20090/run/DevExpress.performance/dataGridRecaclulations.tests.js?notimers=true&nocsp=true"
timeout 5
netsh interface portproxy add v4tov4 listenport=9223 connectaddress=127.0.0.1 connectport=9223 listenaddress=0.0.0.0
cls
echo ============================================
echo  Chrome started with following configuration:
echo ============================================
echo    * No-Caching
echo    * Developer Profile
echo    * Disabled TouchHistory
echo    * Disabled Web-Security
echo    * Allowed XHR Localfile Access
echo    * Forwarded Remote-Debug Port
echo ============================================
ipconfig | findstr "IPv4"
echo    Remote-Debug Port: 9223
echo ============================================
echo Dont close Chrome manually
echo Press any Button to terminate Chrome Network Debug Session
echo ============================================
pause
netsh interface portproxy delete v4tov4 listenport=9223 listenaddress=0.0.0.0
taskkill /F /IM Chrome.exe /T
