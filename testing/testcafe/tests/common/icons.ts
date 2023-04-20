/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { isMaterial, testScreenshot } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import {
  appendElementTo,
} from '../../helpers/domUtils';
import Guid from '../../../../js/core/guid';

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
  map: '\f035',
  menu: '\f00c',
  message: '\f024',
  money: '\f036',
  music: '\f037',
  overflow: '\f00d',
  percent: '\f039',
  photo: '\f03a',
  plus: '\f00b',
  minus: '\f074',
  preferences: '\f03b',
  product: '\f03c',
  pulldown: '\f062',
  refresh: '\f03d',
  remove: '\f00a',
  revert: '\f04c',
  runner: '\f040',
  save: '\f041',
  search: '\f027',
  tags: '\f009',
  tel: '\f003',
  tips: '\f004',
  todo: '\f005',
  toolbox: '\f007',
  trash: '\f03e',
  user: '\f02d',
  upload: '\f006',
  floppy: '\f073',
  arrowleft: '\f011',
  arrowdown: '\f015',
  arrowright: '\f00e',
  arrowup: '\f013',
  spinleft: '\f04f',
  spinprev: '\f04f',
  spinright: '\f04e',
  spinnext: '\f04e',
  spindown: '\f001',
  spinup: '\f002',
  chevronleft: '\f012',
  chevronprev: '\f012',
  back: '\f012',
  chevronright: '\f010',
  chevronnext: '\f010',
  chevrondown: '\f016',
  chevronup: '\f014',
  chevrondoubleleft: '\f042',
  chevrondoubleright: '\f03f',
  equal: '\f044',
  notequal: '\f045',
  less: '\f046',
  greater: '\f047',
  lessorequal: '\f048',
  greaterorequal: '\f049',
  isblank: '\f075',
  isnotblank: '\f076',
  sortup: '\f051',
  sortdown: '\f052',
  sortuptext: '\f053',
  sortdowntext: '\f054',
  sorted: '\f055',
  expand: '\f04a',
  collapse: '\f04b',
  columnfield: '\f057',
  rowfield: '\f058',
  datafield: '\f101',
  fields: '\f059',
  fieldchooser: '\f05a',
  columnchooser: '\f04d',
  pin: '\f05b',
  unpin: '\f05c',
  pinleft: '\f05d',
  pinright: '\f05e',
  contains: '\f063',
  startswith: '\f064',
  endswith: '\f065',
  doesnotcontain: '\f066',
  range: '\f06a',
  export: '\f05f',
  exportxlsx: '\f060',
  exportpdf: '\f061',
  exportselected: '\f06d',
  warning: '\f06b',
  more: '\f06c',
  square: '\f067',
  clearsquare: '\f068',
  repeat: '\f069',
  selectall: '\f070',
  unselectall: '\f071',
  print: '\f072',
  bold: '\f077',
  italic: '\f078',
  underline: '\f079',
  strike: '\f07a',
  indent: '\f07b',
  increaselinespacing: '\f07b',
  font: '\f11b',
  fontsize: '\f07c',
  shrinkfont: '\f07d',
  growfont: '\f07e',
  color: '\f07f',
  background: '\f080',
  fill: '\f10d',
  palette: '\f120',
  superscript: '\f081',
  subscript: '\f082',
  header: '\f083',
  blockquote: '\f084',
  formula: '\f056',
  codeblock: '\f085',
  orderedlist: '\f086',
  bulletlist: '\f087',
  increaseindent: '\f088',
  decreaseindent: '\f089',
  decreaselinespacing: '\f106',
  alignleft: '\f08a',
  alignright: '\f08b',
  aligncenter: '\f08c',
  alignjustify: '\f08d',
  link: '\f08e',
  video: '\f08f',
  mention: '\f090',
  variable: '\f091',
  clearformat: '\f092',
  fullscreen: '\f11a',
  hierarchy: '\f124',
  docfile: '\f111',
  docxfile: '\f110',
  pdffile: '\f118',
  pptfile: '\f114',
  pptxfile: '\f115',
  rtffile: '\f112',
  txtfile: '\f113',
  xlsfile: '\f116',
  xlsxfile: '\f117',
  copy: '\f107',
  cut: '\f10a',
  paste: '\f108',
  share: '\f11f',
  inactivefolder: '\f105',
  newfolder: '\f123',
  movetofolder: '\f121',
  parentfolder: '\f122',
  rename: '\f109',
  detailslayout: '\f10b',
  contentlayout: '\f11e',
  smalliconslayout: '\f119',
  mediumiconslayout: '\f10c',
  undo: '\f04c',
  redo: '\f093',
  hidepanel: '\f11c',
  showpanel: '\f11d',
  checklist: '\f141',
  verticalaligntop: '\f14f',
  verticalaligncenter: '\f14e',
  verticalalignbottom: '\f14d',
  rowproperties: '\f14c',
  columnproperties: '\f14b',
  cellproperties: '\f14a',
  tableproperties: '\f140',
  splitcells: '\f139',
  mergecells: '\f138',
  deleterow: '\f137',
  deletecolumn: '\f136',
  insertrowabove: '\f135',
  insertrowbelow: '\f134',
  insertcolumnleft: '\f133',
  insertcolumnright: '\f132',
  inserttable: '\f130',
  deletetable: '\f131',
  edittableheader: '\f142',
  addtableheader: '\f143',
  pasteplaintext: '\f144',
  importselected: '\f145',
  import: '\f146',
  textdocument: '\f147',
  jpgfile: '\f148',
  bmpfile: '\f149',
  svgfile: '\f150',
  attach: '\f151',
  return: '\f152',
  indeterminatestate: '\f153',
  lock: '\f154',
  unlock: '\f155',
  imgarlock: '\f156',
  imgarunlock: '\f157',
  bell: '\f158',
  sun: '\f159',
  send: '\f160', // material only
  pinmap: '\f161', // material only
  photooutline: '\f162', // material only
  panelright: '\f163',
  panelleft: '\f164',
  optionsgear: '\f165', // material only
  moon: '\f166',
  login: '\f167',
  eyeopen: '\f168',
  eyeclose: '\f169',
  expandform: '\f170',
  description: '\f171',
  belloutline: '\f172', // material only
  to: '\f173',
};

fixture.disablePageReloads`Icons`
  .page(url(__dirname, '../container.html'));

test('Icon set', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t.debug();
  await testScreenshot(t, takeScreenshot, 'Icon set.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  for (const [iconName, glyph] of Object.entries(iconSet)) {
    const id = `dx-${new Guid()}`;

    await appendElementTo('#container', 'div', id, {
      display: 'inline-flex',
      padding: '3px',
      border: '1px solid black',
      alignItems: 'center',
      flexDirection: 'column',
      fontSize: '10px ',
    });

    await ClientFunction(() => {
      $(`#${id}`)
        .append($('<div>').addClass(ICON_CLASS).addClass(`${ICON_CLASS}-${iconName}`))
        .append($('<div>').text(`${iconName}`))
        .append($('<div>').text(`${glyph.replace('\f', '\\f')}`));
    }, {
      dependencies: {
        ICON_CLASS, id, iconName, glyph,
      },
    })();
  }
});

test('SVG icon set', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'SVG icon set.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  for (const [iconName, glyph] of Object.entries(iconSet)) {
    const id = `dx-${new Guid()}`;

    await appendElementTo('#container', 'div', id, {
      display: 'inline-flex',
      padding: '3px',
      border: '1px solid black',
      alignItems: 'center',
      flexDirection: 'column',
      fontSize: '10px',
    });

    const isMaterialTheme = isMaterial();

    await ClientFunction(() => {
      $(`#${id}`)
        .append($(`<img src="../../../images/icons/${isMaterialTheme ? 'material' : 'generic'}/${iconName}.svg">`))
        .append($('<div>').text(`${iconName}`));
    }, {
      dependencies: {
        ICON_CLASS, id, iconName, glyph, isMaterialTheme,
      },
    })();
  }
});
