testUtils.postponeUntil(() => testUtils.findElements('span').some(x=>(x.innerHTML || '').indexOf('Home Appliances Total') != -1), 200, 20000);
