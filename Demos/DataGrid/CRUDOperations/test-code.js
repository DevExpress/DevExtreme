testUtils.postponeUntil(x => testUtils.findElements('#requests ul li').filter(x => (x.innerText || '').includes('GET')).length === 3).then(() => {
    testUtils.findElements('#requests ul li').forEach((x) => {
        x.innerText = x.innerText.substr(8);
    });
});
