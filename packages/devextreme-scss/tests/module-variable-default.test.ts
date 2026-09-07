import { createRunner, scss } from './stylelint-rule';

const ruleName = 'dx/module-variable-default';
const { lint, fix } = createRunner('module-variable-default.mjs', ruleName);
const classified = createRunner('module-variable-default.mjs', ruleName, [
  true,
  { exemptMarkersFrom: 'tools/review/size-markers.json' },
]);

test('a module-level variable without the flag is reported, at the top level and inside @if branches', () => {
  const { warnings } = lint('missing.scss', scss(
    '$top: 7px;',
    '$flagged: 8px !default;',
    '$global: 9px !global;',
    '',
    '@if $size == "default" {',
    '  $branch: 1px;',
    '}',
    '',
    '@else {',
    '  $branch: 2px;',
    '}',
  ));

  expect(warnings).toEqual([
    { line: 1, rule: ruleName, text: `Expected the !default flag on "$top": without it a value passed through @use … with() is ignored (${ruleName})` },
    { line: 6, rule: ruleName, text: `Expected the !default flag on "$branch": without it a value passed through @use … with() is ignored (${ruleName})` },
    { line: 10, rule: ruleName, text: `Expected the !default flag on "$branch": without it a value passed through @use … with() is ignored (${ruleName})` },
  ]);
});

test('variables local to a mixin, function or rule are not module variables', () => {
  const { warnings } = lint('local.scss', scss(
    '@mixin size($base) {',
    '  $double: $base * 2;',
    '  width: $double;',
    '}',
    '',
    '@function half($value) {',
    '  $result: $value / 2;',
    '  @return $result;',
    '}',
    '',
    '.dx-widget {',
    '  $gap: 4px;',
    '  margin: $gap;',
    '',
    '  @if $size == "compact" {',
    '    $gap: 2px;',
    '  }',
    '}',
  ));

  expect(warnings).toEqual([]);
});

test('reassigning a variable that already holds a value is not a default', () => {
  const { warnings } = lint('reassign.scss', scss(
    '$offset: 4px !default;',
    '$offset: $offset + 1px;',
    '',
    '$late: null !default;',
    '$late: 2px;',
  ));

  expect(warnings.map((warning) => warning.line)).toEqual([5]);
});

test('--fix appends the flag, also to a multi-line value', () => {
  const { warnings, output } = fix('fix.scss', scss(
    '$top: 7px;',
    '$map: (',
    '  "a": 1,',
    '  "b": 2,',
    ');',
    '',
    '@if $size == "default" {',
    '  $branch: 1px;',
    '}',
  ));

  expect(warnings).toEqual([]);
  expect(output).toBe(scss(
    '$top: 7px !default;',
    '$map: (',
    '  "a": 1,',
    '  "b": 2,',
    ') !default;',
    '',
    '@if $size == "default" {',
    '  $branch: 1px !default;',
    '}',
  ));
});

test('a size classified by the px audit is not a knob, so the flag is not required on it', () => {
  const source = scss(
    '$plain: 7px;',
    '$fixed: 28px; // dx-fixed-size: drawn as rings, so a var() cannot pass',
    '$shadow: inset 0 2px 0 0 red; // dx-shadow-geometry',
    '',
    '/*',
    ' * dx-fixed-size: its half is negated at twenty positions, so a var() would cost twenty calc()',
    ' */',
    '$above: 11px;',
    '',
    '// dx-fixed-size: the marker may also be a line comment right above',
    '$line-above: 12px;',
    '',
    '/* dx-fixed-size: a marker one blank line away explains something else */',
    '',
    '$detached: 13px;',
  );

  // only the two unclassified sizes are reported: $plain, and $detached, whose marker is a blank
  // line away and therefore explains something else
  expect(classified.lint('classified.scss', source).warnings.map(({ line }) => line)).toEqual([1, 15]);
  expect(lint('unconfigured.scss', source).warnings).toHaveLength(6);
});
