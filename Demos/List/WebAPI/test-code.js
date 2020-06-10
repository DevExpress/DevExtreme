new Promise(resolve => {
    const interval = setInterval(() => {
        if($('div:contains("Chai")').length) {
            clearInterval(interval);
            resolve();
        }
    }, 200);
});