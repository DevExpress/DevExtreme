(function() {
    const head = document.head;

    [
        'generic.light',
        'material.blue.light'
    ].forEach(function(theme) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'dx-theme');
        link.setAttribute('data-theme', theme);
        link.setAttribute('href', SystemJS.normalizeSync(theme.replace(/\./g, '_') + '.css'));
        head.appendChild(link);
    });
})();
