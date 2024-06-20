// eslint-disable-next-line no-unused-vars
function DXDemoTheme() {
  const searchParams = new URLSearchParams(window.location.search);
  const theme = searchParams.get('theme') ?? 'dx.material.blue.light';

  const themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  // fix licence warning - there is cdn themes for devextreme-dist v23.2.4 but not for 23.2.3
  themeLink.href = `../../../../css/${theme}.css`;

  document.head.appendChild(themeLink);
}
