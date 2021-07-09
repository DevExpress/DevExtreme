testUtils.postponeUntil(() => testUtils.findElements('div').some(x=>(x.innerHTML || '').indexOf('Chai') != -1), 200, 20000);
