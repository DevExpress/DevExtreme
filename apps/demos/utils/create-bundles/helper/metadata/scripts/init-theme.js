// eslint-disable-next-line no-unused-vars
function DXDemoTheme() {
  const searchParams = new URLSearchParams(window.location.search);
  const theme = searchParams.get('theme') ?? 'dx.material.blue.light';

  const themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  themeLink.href = `../../../../css/${theme}.css`;

  document.head.appendChild(themeLink);
}
