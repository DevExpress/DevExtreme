new Promise(resolve => {
    const interval = setInterval(() => {
        resolve();
    }, 1000);
});