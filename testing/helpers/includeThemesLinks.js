const themesList = ['generic.light', 'material.blue.light'];

themesList.forEach(theme => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'dx-theme');
    link.setAttribute('data-theme', theme);
    link.setAttribute('href', SystemJS.normalizeSync(theme.replace(/\./g, '_') + '.css'));
    document.head.appendChild(link);
});
