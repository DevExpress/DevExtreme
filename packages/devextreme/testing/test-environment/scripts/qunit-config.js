(function () {
  var doneCount = 0,
    parentWindow = window.opener || window.parent;

  QUnit.done(function (data) {
    if (doneCount == 1)
      notifyExtraDoneCall();

    if (!doneCount && parentWindow && parentWindow.RUNNER_ON_DONE)
      parentWindow.RUNNER_ON_DONE(window, data);

    doneCount++;
  });

  QUnit.testStart(function (data) {
    data.suiteUrl = location.pathname;
    if (parentWindow && parentWindow.RUNNER_ON_TEST_START)
      parentWindow.RUNNER_ON_TEST_START(window, data);
  });

  QUnit.log(function (data) {
    data.suiteUrl = location.pathname;
    if (parentWindow && parentWindow.RUNNER_ON_TEST_LOG)
      parentWindow.RUNNER_ON_TEST_LOG(window, data);
  });

  QUnit.testDone(function (data) {
    data.suiteUrl = location.pathname;
    if (parentWindow && parentWindow.RUNNER_ON_TEST_DONE)
      parentWindow.RUNNER_ON_TEST_DONE(window, data);
  });

  QUnit.config.urlConfig.push({
    id: "nojquery",
    label: "No jQuery",
    tooltip: "Don't use jQuery for widget rendering"
  });

  QUnit.config.urlConfig.push({
    id: "norenovation",
    label: "No Renovation",
    tooltip: "Use norenovation components with old tests",
  });

  QUnit.config.urlConfig.push({
    id: "nocsp",
    label: "No CSP",
    tooltip: "Use noscp components without CSP checks",
  });
})();