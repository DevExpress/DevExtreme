0) You can use ChromeRemoteDebugger.bat instead of point 1). Please close all Chrome instances before run.

1) Launch Google Chrome with the remote debugging port - 9223 and disable web-security
--disable-web-security --remote-debugging-port=9223 --disable-popup-blocking --user-data-dir=SPECIFY_USER_DATA_DIR_HERE --remote-allow-origins=*
(Don't forget to replace the SPECIFY_USER_DATA_DIR_HERE with a valid dir path, it will be different for Win and Linux)

(https://www.chromium.org/developers/how-tos/run-chromium-with-flags)

Open localhost:9223 to check the result. This shows a list of opened browser tabs.

2) Enable Cross Domain Request. You can use the Cors-Toggle extension for this:
https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf

3) Run tests with disabled "No jQuery" checkbox

Note:
We recommend using Canary for running these tests.
