// eslint-disable-next-line no-unused-vars
function DXDemoTheme(version) {
  const searchParams = new URLSearchParams(window.location.search);
  const theme = searchParams.get('theme') ?? 'dx.material.blue.light';

  const themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/devextreme-dist/${version}/css/${theme}.min.css`;

  document.head.appendChild(themeLink);
}
