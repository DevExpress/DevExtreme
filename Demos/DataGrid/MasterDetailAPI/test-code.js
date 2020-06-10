new Promise(resolve => {
    const interval = setInterval(() => {
        resolve();
    }, 2000);
});