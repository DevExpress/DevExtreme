const themesList = ['generic.light', 'material.blue.light'];

themesList.forEach(theme => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'dx-theme');
    link.setAttribute('data-theme', theme);
    const themeFileName = theme.replace(/\./g, '_') + '.css';
    const themeUrl = new URL(`./${themeFileName}`, import.meta.url).href;
    link.setAttribute('href', themeUrl);
    document.head.appendChild(link);
});
