// Temporary WA, need to do this in yaml
function findLastStableVersion(version) {
  // eslint-disable-next-line prefer-const
  let [year, major, minor] = version.split('.');
  if (minor.includes('build')) {
    minor = Number(minor.split('-')[0]) - 1 || 1;
  }
  return `${year}.${major}.${minor}`;
}
// eslint-disable-next-line no-unused-vars
function DXDemoTheme(version) {
  const stableVersion = findLastStableVersion(version);
  const searchParams = new URLSearchParams(window.location.search);
  const theme = searchParams.get('theme') ?? 'dx.material.blue.light';

  const themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  // fix licence warning - there is cdn themes for devextreme-dist v23.2.4 but not for 23.2.3
  themeLink.href = `../../../../../../../../node_modules/devextreme/dist/css/devextreme-dist/css/${theme}.css`;

  document.head.appendChild(themeLink);
}
