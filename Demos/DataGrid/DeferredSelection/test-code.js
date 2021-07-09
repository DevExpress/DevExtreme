testUtils.postponeUntil(() => testUtils.findElements('#tasks-count').some(x=>(x.innerHTML || '').indexOf('0') != -1), 200, 20000);
