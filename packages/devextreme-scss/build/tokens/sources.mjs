/*
 * Which files of @devexpress/design-tokens-internal the theme is built from. Shared by the token
 * build and by tools/tokens/update.mjs, which reports what a package bump does to exactly these —
 * two copies of this list would drift and the report would quietly describe the wrong package.
 */

export const THEME_NAME = 'fluent';
export const THEME_FOLDER = 'fluent-next';

export const getThemeCommonFiles = () => [
  'base/borders',
  'base/opacity',
  'base/spacing',
  'base/typography/font-family',
  'base/typography/font-weight',
  'base/typography/font-size',
  'base/typography/letter-spacing',
  'base/typography/line-height',
  'base/typography/text-case',
  'base/typography/text-decoration',
  `base/colors/utility/${THEME_NAME}`,
  `semantic/box-shadow/${THEME_NAME}`,
  `semantic/typography/${THEME_NAME}/font-family`,
  `semantic/typography/${THEME_NAME}/font-size`,
  `semantic/typography/${THEME_NAME}/font-weight`,
  `semantic/typography/${THEME_NAME}/letter-spacing`,
  `semantic/typography/${THEME_NAME}/line-height`,
  `global/${THEME_NAME}`,
  `figma-utils/box-shadow/semantic/${THEME_NAME}`,
  `figma-utils/icon/set/${THEME_NAME}`,
];

export const getModeFiles = (mode) => [
  ...getThemeCommonFiles(),
  `base/colors/icons/${THEME_NAME}/${mode}`,
  `base/colors/palettes/${THEME_NAME}/blue`,
  `semantic/colors/${THEME_NAME}/${mode}`,
];

/*
 * Source files behind the SCSS bridge. The component tier is absent on purpose: its tokens only
 * alias the semantic roles the theme already reads, so emitting them added unreferenced custom
 * properties. Absent from the bridge, `ds.$button-color-bg-rest` is now a Sass error.
 */
export const getBridgeFiles = () => getModeFiles('light');
