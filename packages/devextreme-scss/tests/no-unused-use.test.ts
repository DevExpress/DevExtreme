import { createRunner, scss } from './stylelint-rule';

const ruleName = 'dx/no-unused-use';
const { lint, fix } = createRunner('no-unused-use.ts', ruleName);

const builtIn = (url: string): string => `Nothing reads "${url}"; remove the @use (${ruleName})`;
const unread = (url: string): string => `Nothing reads "${url}"; remove the @use, or write @use "${url}"; when the module is loaded for its CSS or its load order (${ruleName})`;

lint('_sizes.scss', scss(
  '$size: 4px !default;',
  '',
  '@mixin padded() {',
  '  padding: $size;',
  '}',
  '',
  '@function twice($value) {',
  '  @return $value * 2;',
  '}',
  '',
  '%centered {',
  '  margin: auto;',
  '}',
));
lint('_forwarding.scss', scss('@forward "sizes" as base-*;'));
lint('_empty.scss', '');

test('a built-in module nothing reads is reported and removed', () => {
  const source = scss(
    '@use "sass:math";',
    '@use "sass:color" as paint;',
    '@use "sass:map";',
    '',
    '.dx-widget {',
    '  width: math.div(10px, 2);',
    '}',
  );

  expect(lint('built-in.scss', source).warnings).toEqual([
    { line: 2, rule: ruleName, text: builtIn('sass:color') },
    { line: 3, rule: ruleName, text: builtIn('sass:map') },
  ]);
  expect(fix('built-in.scss', source).output).toBe(scss(
    '@use "sass:math";',
    '',
    '.dx-widget {',
    '  width: math.div(10px, 2);',
    '}',
  ));
});

test('a namespace nothing reads is reported and turned into a plain @use', () => {
  const source = scss(
    '@use "sizes" as sizes;',
    '@use "sizes" as unused;',
    '',
    '.dx-widget {',
    '  width: sizes.$size;',
    '}',
  );

  expect(lint('namespace.scss', source).warnings).toEqual([
    { line: 2, rule: ruleName, text: unread('sizes') },
  ]);
  expect(fix('namespace.scss', source).output).toBe(scss(
    '@use "sizes" as sizes;',
    '@use "sizes";',
    '',
    '.dx-widget {',
    '  width: sizes.$size;',
    '}',
  ));
});

test('a global @use counts every kind of member it brings in', () => {
  ['width: $size;', '@include padded();', 'width: twice(1px);', '@extend %centered;'].forEach((body, index) => {
    expect(lint(`member-${index}.scss`, scss('@use "sizes" as *;', '', '.dx-widget {', `  ${body}`, '}')).warnings)
      .toEqual([]);
  });
});

test('a global @use nothing reads is reported and turned into a plain @use', () => {
  const source = scss('@use "sizes" as *;', '', '.dx-widget {', '  width: 1px;', '}');

  expect(lint('global.scss', source).warnings).toEqual([
    { line: 1, rule: ruleName, text: unread('sizes') },
  ]);
  expect(fix('global.scss', source).output).toBe(scss('@use "sizes";', '', '.dx-widget {', '  width: 1px;', '}'));
});

test('forwarded members keep their prefix', () => {
  expect(lint('forwarded.scss', scss('@use "forwarding" as *;', '', '.dx-widget {', '  width: $base-size;', '}')).warnings)
    .toEqual([]);
  expect(lint('forwarded-unprefixed.scss', scss('@use "forwarding" as *;', '', '.dx-widget {', '  width: $size;', '}')).warnings)
    .toEqual([{ line: 1, rule: ruleName, text: unread('forwarding') }]);
});

test('plain, configuring and member-less @use rules are left alone', () => {
  expect(lint('left-alone.scss', scss(
    '@use "sizes";',
    '@use "sizes" as * with ($size: 2px);',
    '@use "empty" as *;',
    '',
    '.dx-widget {',
    '  width: 1px;',
    '}',
  )).warnings).toEqual([]);
});
