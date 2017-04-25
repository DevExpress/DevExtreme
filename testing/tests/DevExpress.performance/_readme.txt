1) Запустить хром с параметром --remote-debugging-port=9223
(https://www.chromium.org/developers/how-tos/run-chromium-with-flags)

Для проверки что параметр заработал в браузере открываем localhost:9223, должен открыться список открытых вкладок браузера

Примечание 1: Возможно придется "убить" хром через таск менеджер
Примечание 2: Лучше использовать Canary для запуска этих тестов - результат в Chrome и Canary иногда отличается

2) Необходимо в браузере разрешить Cross Domain Request

Удобнее всего сделать это расширением
https://chrome.google.com/webstore/detail/cors-toggle/omcncfnpmcabckcddookmnajignpffnh?utm_source=chrome-app-launcher-info-dialog

3) Запустить тесты