import { createRunner, scss } from './stylelint-rule';

const ruleName = 'dx/no-identical-branch-declarations';
const { lint, fix } = createRunner('no-identical-branch-declarations.mjs', ruleName);

test('a variable set to one value in every @else branch is reported once, on the first branch', () => {
  const { warnings } = lint('else-chain.scss', scss(
    '$same: null !default;',
    '$differs: null !default;',
    '',
    '@if $size == "default" {',
    '  $same: 8px !default;',
    '  $differs: 8px !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $same: 8px !default;',
    '  $differs: 4px !default;',
    '}',
  ));

  expect(warnings).toEqual([{
    line: 5,
    rule: ruleName,
    text: `"$same" has the same value in all 2 branches of the @if chain; declare it once outside the chain (${ruleName})`,
  }]);
});

test('consecutive @if blocks testing one variable against different constants form a chain', () => {
  const { warnings } = lint('if-if.scss', scss(
    '@if $size == "default" {',
    '  $same: 8px !default;',
    '}',
    '',
    '@if $size == "compact" {',
    '  $same: 8px !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $same: 8px !default;',
    '}',
  ));

  expect(warnings.map((warning) => warning.line)).toEqual([2]);
});

test('nothing is reported for a value that differs, a variable missing from a branch, or a repeated constant', () => {
  const { warnings } = lint('clean.scss', scss(
    '@if $size == "default" {',
    '  $a: 8px !default;',
    '  $only-here: 1px !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $a: 4px !default;',
    '}',
    '',
    '@if $size == "default" {',
    '  $b: 8px !default;',
    '}',
    '',
    '@if $size == "default" {',
    '  $b: 8px !default;',
    '}',
  ));

  expect(warnings).toEqual([]);
});

test('--fix replaces the null pre-declaration with a literal and removes the emptied chain', () => {
  const { warnings, output } = fix('fix-literal.scss', scss(
    '$x: null !default;',
    '$keep: 1px !default;',
    '',
    '@if $size == "default" {',
    '  $x: ds.$spacing-480 !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $x: ds.$spacing-480 !default;',
    '}',
  ));

  expect(warnings).toEqual([]);
  expect(output).toBe(scss(
    '$x: ds.$spacing-480 !default;',
    '$keep: 1px !default;',
  ));
});

test('--fix puts a value that reads a branch-bound variable after the chain', () => {
  const { output } = fix('fix-after.scss', scss(
    '$height: null !default;',
    '$handle: null !default;',
    '',
    '@if $size == "default" {',
    '  $height: 20px !default;',
    '  $handle: $height !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $height: 18px !default;',
    '  $handle: $height !default;',
    '}',
  ));

  expect(output).toBe(scss(
    '$height: null !default;',
    '',
    '@if $size == "default" {',
    '  $height: 20px !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $height: 18px !default;',
    '}',
    '',
    '$handle: $height !default;',
  ));
});

test('--fix leaves no blank first line when the removed declaration opened its group', () => {
  const { output } = fix('fix-first-line.scss', scss(
    '$same: null !default;',
    '',
    '@if $size == "default" {',
    '  $same: 1px !default;',
    '',
    '  $width: 36px !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $same: 1px !default;',
    '',
    '  $width: 32px !default;',
    '}',
  ));

  expect(output).toBe(scss(
    '$same: 1px !default;',
    '',
    '@if $size == "default" {',
    '  $width: 36px !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $width: 32px !default;',
    '}',
  ));
});

test('--fix moves a value that reads a variable declared below its pre-declaration to just before the chain', () => {
  const { output } = fix('fix-before.scss', scss(
    '$padding: null !default;',
    '$margin: 0 !default;',
    '',
    '@if $size == "default" {',
    '  $padding: $margin !default;',
    '  $width: 36px !default;',
    '}',
    '',
    '@if $size == "compact" {',
    '  $padding: $margin !default;',
    '  $width: 32px !default;',
    '}',
  ));

  expect(output).toBe(scss(
    '$margin: 0 !default;',
    '$padding: $margin !default;',
    '',
    '@if $size == "default" {',
    '  $width: 36px !default;',
    '}',
    '',
    '@if $size == "compact" {',
    '  $width: 32px !default;',
    '}',
  ));
});

test('--fix only removes branch declarations that a non-null default above the chain already overrides', () => {
  const { output } = fix('fix-dead.scss', scss(
    '$x: 10px !default;',
    '',
    '@if $size == "default" {',
    '  $x: 12px !default;',
    '}',
    '',
    '@else if $size == "compact" {',
    '  $x: 12px !default;',
    '}',
  ));

  expect(output).toBe(scss('$x: 10px !default;'));
});

test('--fix settles a duplicate that only appears in the outer chain after the inner one is hoisted', () => {
  const { warnings, output } = fix('fix-nested.scss', scss(
    '$focused: null !default;',
    '',
    '@if $mode == "light" {',
    '  @if $color == "blue" {',
    '    $hover: #00f !default;',
    '    $focused: $hover !default;',
    '  }',
    '',
    '  @if $color == "saas" {',
    '    $hover: #0ff !default;',
    '    $focused: $hover !default;',
    '  }',
    '}',
    '',
    '@if $mode == "dark" {',
    '  @if $color == "blue" {',
    '    $hover: #008 !default;',
    '    $focused: $hover !default;',
    '  }',
    '',
    '  @if $color == "saas" {',
    '    $hover: #088 !default;',
    '    $focused: $hover !default;',
    '  }',
    '}',
  ));

  expect(warnings).toEqual([]);
  expect(output).toBe(scss(
    '@if $mode == "light" {',
    '  @if $color == "blue" {',
    '    $hover: #00f !default;',
    '  }',
    '',
    '  @if $color == "saas" {',
    '    $hover: #0ff !default;',
    '  }',
    '}',
    '',
    '@if $mode == "dark" {',
    '  @if $color == "blue" {',
    '    $hover: #008 !default;',
    '  }',
    '',
    '  @if $color == "saas" {',
    '    $hover: #088 !default;',
    '  }',
    '}',
    '',
    '$focused: $hover !default;',
  ));
});

test('--fix keeps a declaration behind the chain ahead of the declarations that read it', () => {
  const { warnings, output } = fix('fix-order.scss', scss(
    '$item-bg: null !default;',
    '$disabled-bg: null !default;',
    '$disabled-border: null !default;',
    '',
    '@if $mode == "light" {',
    '  $item-bg: #eee !default;',
    '  $disabled-bg: $item-bg !default;',
    '  $disabled-border: $disabled-bg !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $item-bg: #333 !default;',
    '  $disabled-bg: $item-bg !default;',
    '  $disabled-border: $disabled-bg !default;',
    '}',
  ));

  expect(warnings).toEqual([]);
  expect(output).toBe(scss(
    '$item-bg: null !default;',
    '',
    '@if $mode == "light" {',
    '  $item-bg: #eee !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $item-bg: #333 !default;',
    '}',
    '',
    '$disabled-bg: $item-bg !default;',
    '$disabled-border: $disabled-bg !default;',
  ));
});

test('a duplicate that a branch-bound declaration still reads is reported but not moved', () => {
  const source = scss(
    '$item-bg: null !default;',
    '$disabled-bg: null !default;',
    '$hovered-bg: null !default;',
    '',
    '@if $mode == "light" {',
    '  $item-bg: #eee !default;',
    '  $disabled-bg: $item-bg !default;',
    '  $hovered-bg: color.adjust($disabled-bg, $lightness: -4%) !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $item-bg: #333 !default;',
    '  $disabled-bg: $item-bg !default;',
    '  $hovered-bg: color.adjust($disabled-bg, $lightness: 4%) !default;',
    '}',
  );

  const { warnings, output } = fix('fix-blocked.scss', source);

  expect(warnings.map((warning) => warning.line)).toEqual([7]);
  expect(output).toBe(source);
});

test('--fix keeps a declaration under its doc comment when what it reads is not reassigned in between', () => {
  const { output } = fix('fix-doc-in-place.scss', scss(
    '@use "../colors" as *;',
    '',
    '/**',
    '* $name 100. Background color',
    '* $type color',
    '*/',
    '$common-bg: null !default;',
    '',
    '@if $mode == "light" {',
    '  $common-bg: $base-bg !default;',
    '  $accent: #00f !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $common-bg: $base-bg !default;',
    '  $accent: #0ff !default;',
    '}',
  ));

  expect(output).toBe(scss(
    '@use "../colors" as *;',
    '',
    '/**',
    '* $name 100. Background color',
    '* $type color',
    '*/',
    '$common-bg: $base-bg !default;',
    '',
    '@if $mode == "light" {',
    '  $accent: #00f !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $accent: #0ff !default;',
    '}',
  ));
});

test('--fix takes the doc comment along when the declaration has to move', () => {
  const { output } = fix('fix-doc-moves.scss', scss(
    '/**',
    '* $name 302. Divider color',
    '* $type color',
    '*/',
    '$divider: null !default;',
    '',
    '$border: null !default;',
    '',
    '@if $mode == "light" {',
    '  $border: #ccc !default;',
    '  $divider: $border !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $border: #444 !default;',
    '  $divider: $border !default;',
    '}',
  ));

  expect(output).toBe(scss(
    '$border: null !default;',
    '',
    '@if $mode == "light" {',
    '  $border: #ccc !default;',
    '}',
    '',
    '@if $mode == "dark" {',
    '  $border: #444 !default;',
    '}',
    '',
    '/**',
    '* $name 302. Divider color',
    '* $type color',
    '*/',
    '$divider: $border !default;',
  ));
});
