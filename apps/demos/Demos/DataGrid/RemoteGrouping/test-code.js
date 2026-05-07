testUtils.postponeUntil(() => testUtils.findElements('td').some((x) => (x.innerHTML || '').indexOf('Store:') !== -1), 100, 10000);
