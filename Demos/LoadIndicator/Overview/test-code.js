testUtils
    .postponeUntilFound(".dx-loadindicator-wrapper")
    .then(() => {
        testUtils.findElements(".dx-loadindicator-wrapper").forEach(x=>x.style.display = 'none');
    })

