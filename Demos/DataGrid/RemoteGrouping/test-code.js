new Promise(resolve => {
    var i = 0;
    const interval = setInterval(() => {
        if(i > 100 || $('td:contains("Store:")').length) {
            clearInterval(interval);
            resolve();
        }
        i++;
    }, 200);
});