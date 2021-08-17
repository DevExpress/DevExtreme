testUtils.postponeUntilFound('td[aria-describedby="dx-col-3"]').then(() => {
    window.checkReady = function () {
        return true;
    };
    testUtils.findElements('td[aria-describedby="dx-col-3"]').forEach(x => {
        x.innerText = '01/12/1999';
    });
    const parameter = document.querySelector('.request-info:nth-child(1) .parameter-info:nth-child(3) .parameter-value');
    if (parameter)
        parameter.innerText = '';
});
