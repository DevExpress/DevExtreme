testUtils.postponeUntil(() => testUtils.findElements('span').some(x=>(x.innerHTML || '').indexOf('Stores') != -1), 100, 20000)

