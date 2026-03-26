import { test, expect } from '@playwright/test';
import { testScreenshot, appendElementTo } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Icons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const ICON_CLASS = 'dx-icon';
  const iconSet = {
    add: '\f00b',
    airplane: '\f000',
    bookmark: '\f017',
    box: '\f018',
    car: '\f01b',
    card: '\f019',
    cart: '\f01a',
    chart: '\f01c',
    check: '\f005',
    clear: '\f008',
    clock: '\f01d',
    close: '\f00a',
    coffee: '\f02a',
    comment: '\f01e',
    doc: '\f021',
    file: '\f021',
    download: '\f022',
    dragvertical: '\f038',
    edit: '\f023',
    email: '\f024',
    event: '\f026',
    eventall: '\f043',
    favorites: '\f025',
    find: '\f027',
    filter: '\f050',
    folder: '\f028',
    activefolder: '\f028',
    food: '\f029',
    gift: '\f02b',
    globe: '\f02c',
    group: '\f02e',
    help: '\f02f',
    home: '\f030',
    image: '\f031',
    info: '\f032',
    key: '\f033',
    like: '\f034',
    lock: '\f035',
    login: '\f036',
    map: '\f037',
    menu: '\f00c',
    message: '\f024',
    money: '\f039',
    music: '\f03b',
    overflow: '\f00d',
    percent: '\f03c',
    photo: '\f03d',
    pin: '\f03e',
    pinleft: '\f04e',
    pinright: '\f04d',
    preferences: '\f03f',
    product: '\f040',
    pulldown: '\f062',
    refresh: '\f041',
    remove: '\f00a',
    revert: '\f04c',
    runner: '\f042',
    save: '\f044',
    search: '\f027',
    selectall: '\f048',
    square: '\f045',
    spindown: '\f001',
    spinleft: '\f002',
    spinprev: '\f002',
    spinright: '\f003',
    spinnext: '\f003',
    spinup: '\f004',
    star: '\f025',
    tags: '\f009',
    tel: '\f046',
    tips: '\f004',
    todo: '\f005',
    toolbox: '\f047',
    trash: '\f03a',
    user: '\f02d',
    unselectall: '\f049',
    upload: '\f006',
    videocam: '\f04a',
    arrowleft: '\f011',
    arrowright: '\f012',
    arrowdown: '\f015',
    arrowup: '\f013',
    back: '\f04b',
    collapse: '\f020',
    copy: '\f015a',
    cut: '\f016a',
    paste: '\f017a',
    expand: '\f01f',
    exportxlsx: '\f051',
    exportpdf: '\f052',
    exportselected: '\f053',
    bold: '\f054',
    italic: '\f055',
    underline: '\f056',
    strike: '\f057',
    indent: '\f058',
    increaselinespacing: '\f059',
    font: '\f05a',
    fontsize: '\f05b',
    shrinkfont: '\f05c',
    growfont: '\f05d',
    color: '\f05e',
    background: '\f05f',
    fill: '\f060',
    palette: '\f061',
    superscript: '\f06a',
    subscript: '\f06b',
    header: '\f06c',
    blockquote: '\f06d',
    formula: '\f06e',
    codeblock: '\f06f',
    orderedlist: '\f070',
    bulletlist: '\f071',
    increaseindent: '\f072',
    decreaseindent: '\f073',
    decreaselinespacing: '\f074',
    alignleft: '\f075',
    aligncenter: '\f076',
    alignright: '\f077',
    alignjustify: '\f078',
    separator: '\f079',
    fullscreen: '\f11a',
    hierarchy: '\f11b',
    undo: '\f07a',
    redo: '\f07b',
    clearformat: '\f07c',
    accountbox: '\f07d',
    link: '\f07e',
    variable: '\f07f',
    detailslayout: '\f080',
    contentlayout: '\f081',
    smalliconslayout: '\f082',
    mediumiconslayout: '\f083',
    image2: '\f084',
    mention: '\f085',
    to: '\f086',
    insertrowabove: '\f087',
    insertrowbelow: '\f088',
    insertcolumnleft: '\f089',
    insertcolumnright: '\f08a',
    addrowabove: '\f08b',
    addrowbelow: '\f08c',
    addcolumnleft: '\f08d',
    addcolumnright: '\f08e',
    deleterow: '\f08f',
    deletecolumn: '\f090',
    deletetable: '\f091',
    cellproperties: '\f092',
    tableproperties: '\f093',
    inserttable: '\f094',
    tableoptions: '\f095',
  };

  test('Icon set', async ({ page }) => {
    await page.evaluate(({ iconSetData, iconClass }) => {
      const container = document.querySelector('#container');
      if (!container) return;

      const fragment = document.createDocumentFragment();

      for (const [name] of Object.entries(iconSetData)) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.marginBottom = '2px';

        const iconSpan = document.createElement('span');
        iconSpan.className = `${iconClass} ${iconClass}-${name}`;
        iconSpan.style.fontSize = '24px';
        iconSpan.style.marginRight = '10px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = name;

        div.appendChild(iconSpan);
        div.appendChild(labelSpan);
        fragment.appendChild(div);
      }

      container.append(fragment);
    }, { iconSetData: iconSet, iconClass: ICON_CLASS });

    await testScreenshot(page, 'Icon set.png');
  });

  test('SVG icon set', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.querySelector('#container');
      if (!container) return;

      const svgIcons = [
        'dx-icon-rowfield', 'dx-icon-columnfield', 'dx-icon-datafield',
        'dx-icon-fields', 'dx-icon-fieldchooser',
      ];

      const fragment = document.createDocumentFragment();

      svgIcons.forEach((iconClass) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.marginBottom = '2px';
        div.style.height = '30px';

        const iconSpan = document.createElement('span');
        iconSpan.className = `dx-icon ${iconClass}`;
        iconSpan.style.fontSize = '24px';
        iconSpan.style.marginRight = '10px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = iconClass;

        div.appendChild(iconSpan);
        div.appendChild(labelSpan);
        fragment.appendChild(div);
      });

      container.append(fragment);
    });

    await testScreenshot(page, 'SVG icon set.png');
  });
});
