const themesList = [
    { name: 'generic.light', href: '/packages/devextreme/artifacts/css/dx.light.css' },
    { name: 'material.blue.light', href: '/packages/devextreme/artifacts/css/dx.material.blue.light.css' },
];

themesList.forEach(({ name, href }) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'dx-theme');
    link.setAttribute('data-theme', name);
    link.setAttribute('href', href);
    document.head.appendChild(link);
});
