testUtils.postponeUntil(() => testUtils.findElements('div').some((x) => (x.innerHTML || '').indexOf('Chai') !== -1), 100, 10000);
