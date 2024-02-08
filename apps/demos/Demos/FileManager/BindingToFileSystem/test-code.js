testUtils.postponeUntilFound('td[aria-describedby="dx-col-3"]').then(() => {
  window.checkReady = function () {
    return true;
  };
  testUtils.findElements('td[aria-describedby="dx-col-3"]').forEach((x) => {
    x.innerText = '01/12/1999';
  });
  testUtils.findElements('td[aria-describedby="dx-col-4"]').forEach((x) => {
    x.innerText = '';
  });
});
