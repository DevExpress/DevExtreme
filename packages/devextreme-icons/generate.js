import { generateFonts } from 'fantasticon';
import { icons } from './icons.js';
import * as fs from 'fs/promises';

const ARTIFACTS = './artifacts';
const NAMED_ICONS = `${ARTIFACTS}/named-icons`;
const DIST = `${ARTIFACTS}/dist`;
const ICONS_REPO = './icons';
const SCSS_ICONS = '../devextreme-scss/icons';
const SCSS_ICONS_LIST = '../devextreme-scss/scss/widgets/base/_iconsList.scss'

try {
  await fs.rm(ARTIFACTS, { recursive: true })
} catch {}


await fs.mkdir(ARTIFACTS);
await fs.mkdir(NAMED_ICONS);
await fs.mkdir(DIST);

const normalizedIcons = icons.map((icon) => {
  if (typeof icon === 'string') {
    return { devextreme_name: icon, dx_name: icon, style: 'regular' };
  }
  return { ...icon, style: icon.style || 'regular' };
});

for (const icon of normalizedIcons) {
  const { devextreme_name, dx_name, style } = icon;

  await fs.copyFile(
    `${ICONS_REPO}/icon-library/icons/${dx_name}/${dx_name}-fluent-${style}-no_color-20.svg`,
    `${NAMED_ICONS}/${devextreme_name}.svg`,
  );
}

await generateFonts({
  inputDir: NAMED_ICONS,
  outputDir: DIST,
  fontTypes: ['ttf', 'woff', 'woff2'],
  codepoints: Object.fromEntries(
    icons
      .map(({devextreme_name, devextreme_symbol}) => [devextreme_name, parseInt(devextreme_symbol, 16)])
  )
});

for (const ext of [ 'ttf', 'woff', 'woff2' ]) {
  try {
    await fs.rm(`${SCSS_ICONS}/dxiconsfluent.${ext}`);
  } catch {}

  await fs.copyFile(
    `${DIST}/icons.${ext}`,
    `${SCSS_ICONS}/dxiconsfluent.${ext}`,
  );
}

let scssIconListContent = '';

scssIconListContent += '$icons: (\n'

for (const icon of normalizedIcons) {
  scssIconListContent += `  "${icon.devextreme_name}": "\\f${icon.devextreme_symbol.slice(1)}",\n`;
}

scssIconListContent += ');\n';

await fs.writeFile(SCSS_ICONS_LIST, scssIconListContent);
