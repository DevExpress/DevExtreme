testUtils.postponeUntil(() => testUtils.findElements('td').some(x=>(x.innerHTML || '').indexOf('Store:') != -1), 200, 20000);
