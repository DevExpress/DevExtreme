1) Launch Google Chrome with the remote debugging port - 9223 and disable web-security 
--remote-debugging-port=9223 --disable-web-security
(https://www.chromium.org/developers/how-tos/run-chromium-with-flags)
 
Open localhost:9223 to check the result. This shows a list of opened browser tabs.
 
2) Enable Cross Domain Request. You can use the Cors-Toggle extension for this:
https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf
 
3) Run tests with disabled "No jQuery" checkbox
 
Note:
We recommend using Canary for running these tests.